import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Point } from '../../../../../shared/interfaces/point.inteface';
import { User } from '../../../../../shared/interfaces/user.interface';
import { endpoints } from '../../../../../shared/constants/end-points';
import { chatGPTService } from '../../../../../shared/services/game/chatGPT.service';
import { ddl } from '../../../../../shared/constants/database';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})

/**
 * Componente que muestra la vantana donde el usuario inserta la consulta SQL.
 */
export class ChatbotComponent implements OnInit {

  @Input() point: Point = {} as Point;
  @Input() currentUser: User | null = {} as User;
  @Input() hintsClicked: number[] = [];
  @Input() level: string = '';
  @Output() showHintComponentEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() hintsClickedUpdated: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() chatbotHidden: EventEmitter<void> = new EventEmitter<void>();
  @Output() archievementGained: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() chatbotResponse: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() finalReached: EventEmitter<void> = new EventEmitter<void>();
  @Output() showComponentEvent: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('userQueryTextarea') userQueryTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('shield') shield!: ElementRef<HTMLDivElement>;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  private imgPopup!: HTMLElement | null;
  private popupImage!: HTMLImageElement | null;
  public isButtonClicked: boolean = false;
  public isLoadingResponse: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private chatgpt: chatGPTService,
    private cdr: ChangeDetectorRef,
  ) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit() {
    this.imgPopup = this.elementRef.nativeElement.querySelector('.img-popup');
    this.popupImage = this.elementRef.nativeElement.querySelector('.img-popup img');
    setTimeout(() => {
      this.addShieldToDOM(this.getNameShieldImage());
    }, 100);
    this.disableClickedHints(this.hintsClicked);
  }

  /**
   * Llama a la API de ChatGPT para obtener la respuesta del chatbot.
   * @returns la respuesta del chatbot.
   * @emits chatbotResponse
   */
  callChatGPT(): void {
    const sqlCode = this.userQueryTextarea.nativeElement.value;
    this.isButtonClicked = true;
    this.isLoadingResponse = true;

    const prompt = `
    Según esta base de datos:\n${ddl}\nEvalúa si esta bien o mal la siguiente consulta:\n${sqlCode}\n para obtener la siguiente información \n${this.point.question}\n.
    Si la consulta es correcta, escribe: ¡ENHORABUENA!, imprime el resultado de la consulta y no escribas nada más.
    \nSi la consulta es errónea, explica por qué está mal, proporciona su corrección y NUNCA ESCRIBAS ¡ENHORABUENA!.
`;


    this.chatgpt.getChatResponse(prompt).subscribe((res: any) => {
      const respuesta = res.choices[0].message.content;
      this.userQueryTextarea.nativeElement.value = respuesta;

      this.cdr.detectChanges();

      setTimeout(() => {
        this.isLoadingResponse = false;
        this.cdr.detectChanges();
      }, 0);

      if (respuesta.includes('¡ENHORABUENA!')) {
        this.archievementGained.emit();
        this.chatbotResponse.emit(true);
      } else {
        this.chatbotResponse.emit(false);
      }
    });
  }


  /**
   * Muestra la pista correspondiente.
   * @param numberHint - El número de pista a mostrar.
   */
  displayHint(numberHint: number): void {
    if (!this.hintsClicked.includes(numberHint)) {
      this.showHintComponentEvent.emit(numberHint);
      this.hintsClicked.push(numberHint);
      this.hintsClickedUpdated.emit(this.hintsClicked);
    }
  }

  /**
   * Deshabilita las pistas que se han mostrado.
   * @param hintsClicked - Las pistas que se han mostrado.
   */
  disableClickedHints(hintsClicked: number[]): void {
    hintsClicked.forEach((hintClicked: number) => {
      const hintElement = this.elementRef.nativeElement.querySelector(`.hint-link-${hintClicked + 1}`);
      if (hintElement) {
        hintElement.classList.add('disabled');
      }
    });
  }

  /**
   * Obtiene el nombre de la imagen del escudo.
   * @returns el nombre de la imagen del escudo.
   */
  getNameShieldImage(): string {
    return this.currentUser?.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  /**
   * Agrega el escudo al DOM.
   * @param shieldName - El nombre del escudo.
   */
  addShieldToDOM(shieldName: string): void {
    this.shield.nativeElement.style.backgroundImage = `url('${endpoints.urlImageShield}${shieldName}')`;
  }

  /**
   * Muestra la imagen del esquema Entidad-Relacion de la base de datos.
   */
  displayImageEr() {
    if (this.imgPopup && this.popupImage) {
      this.popupImage.src = '../../../../../assets/game/info/er.jpg';
      this.imgPopup.classList.add('opened');
    }
  }

  /**
   * Muestra la imagen del diagrama relacional de la base de datos.
   */
  closePopup() {
    if (this.imgPopup && this.popupImage) {
      this.imgPopup.classList.remove('opened');
      this.popupImage.src = '';
    }
  }

  /**
   * Detiene la propagación del evento.
   * @param event - El evento a detener.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Continúa o cierra el componente.
   */
  continueOrClose(): void {
    if (this.isButtonClicked) {
      this.hideComponent();
      if (this.level === '7') {
        this.finalReached.emit();
      }
    } else {
      this.callChatGPT();
    }
  }

  /**
   * Oculta el componente.
   */
  hideComponent(): void {
    this.isButtonClicked = false;
    this.userQueryTextarea.nativeElement.value = '';
    this.container.nativeElement.style.display = 'none';
    this.chatbotHidden.emit();
  }

  showComponent(): void {
    this.container.nativeElement.style.display = 'block';
    this.showComponentEvent.emit(); // Emitir evento cuando se muestra el componente
  }
}
