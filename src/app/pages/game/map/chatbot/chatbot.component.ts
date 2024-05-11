import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Point } from '../../../../shared/interfaces/point.inteface';
import { User } from '../../../../shared/interfaces/user.interface';
import { endpoints } from '../../../../shared/constants/end-points';
import { chatGPTService } from '../../../../shared/services/game/chatGPT.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
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
  @ViewChild('userQueryTextarea') userQueryTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('shield') shield!: ElementRef<HTMLDivElement>;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  private imgPopup!: HTMLElement | null;
  private popupImage!: HTMLImageElement | null;
  public isButtonClicked: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private chatgpt: chatGPTService,
  ) { }

  ngOnInit() {
    this.imgPopup = this.elementRef.nativeElement.querySelector('.img-popup');
    this.popupImage = this.elementRef.nativeElement.querySelector('.img-popup img');
    setTimeout(() => {
      this.addShieldToDOM(this.getNameShieldImage());
    }, 100);
    this.disableClickedHints(this.hintsClicked);
  }

  callChatGPT(): void {
    const sqlCode = this.userQueryTextarea.nativeElement.value;
    this.isButtonClicked = true;

    const prompt = `
      Según la base de datos proporcionada, evalúa si la siguiente consulta SQL es correcta o incorrecta:
      \nConsulta SQL:
      \n${sqlCode}
      \nPara obtener la siguiente información:
      \n${this.point.question}.
      \nSi la consulta es correcta, escribe: ¡ENHORABUENA!, imprime el resultado de la consulta y no escribas nada más.
      \nSi la consulta es errónea, explica por qué está mal, proporciona su corrección y NUNCA ESCRIBAS ¡ENHORABUENA!.
    `;

    this.chatgpt.getChatResponse(prompt).subscribe((res: any) => {
      const respuesta = res.choices[0].message.content;
      this.userQueryTextarea.nativeElement.value = respuesta;
      if (respuesta.includes('¡ENHORABUENA!')) {
        this.archievementGained.emit();
        this.chatbotResponse.emit(true);
      } else {
        this.chatbotResponse.emit(false);
      }
    });
  }


  displayHint(numberHint: number): void {
    if (!this.hintsClicked.includes(numberHint)) {
      this.showHintComponentEvent.emit(numberHint);
      this.hintsClicked.push(numberHint);
      this.hintsClickedUpdated.emit(this.hintsClicked);
    }
  }

  disableClickedHints(hintsClicked: number[]): void {
    hintsClicked.forEach((hintClicked: number) => {
      const hintElement = this.elementRef.nativeElement.querySelector(`.hint-link-${hintClicked + 1}`);
      if (hintElement) {
        hintElement.classList.add('disabled');
      }
    });
  }

  getNameShieldImage(): string {
    return this.currentUser?.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  addShieldToDOM(shieldName: string): void {
    this.shield.nativeElement.style.backgroundImage = `url('${endpoints.urlImageShield}${shieldName}')`;
  }

  displayImageEr() {
    if (this.imgPopup && this.popupImage) {
      this.popupImage.src = '../../../../../assets/game/info/er.jpg';
      this.imgPopup.classList.add('opened');
    }
  }

  closePopup() {
    if (this.imgPopup && this.popupImage) {
      this.imgPopup.classList.remove('opened');
      this.popupImage.src = '';
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  continueOrClose(): void {
    if (this.isButtonClicked) {
      this.hideComponent();
      if(this.level === '7'){
        this.finalReached.emit();
      }
    } else {
      this.callChatGPT();
    }
  }

  hideComponent(): void {
    this.isButtonClicked = false;
    this.userQueryTextarea.nativeElement.value = '';
    this.container.nativeElement.style.display = 'none';
    this.chatbotHidden.emit();
  }
}
