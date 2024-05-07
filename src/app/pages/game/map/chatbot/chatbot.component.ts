import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Point } from '../../../../shared/interfaces/point.inteface';
import { User } from '../../../../shared/interfaces/user.interface';
import { endpoints } from '../../../../shared/constants/end-points';
import { chatGPTService } from '../../../../shared/services/chatGPT.service';
import { ddl } from '../../../../shared/constants/database';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {

  @Input() point: Point = {} as Point;
  @Input() currentUser: User | null = {} as User;
  @ViewChild('userQueryTextarea') userQueryTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('shield') shield!: ElementRef<HTMLDivElement>;
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  private imgPopup!: HTMLElement | null;
  private popupImage!: HTMLImageElement | null;
  isButtonClicked: boolean = false;


  constructor(private elementRef: ElementRef, private chatgpt: chatGPTService) { }

  ngOnInit() {
    this.imgPopup = this.elementRef.nativeElement.querySelector('.img-popup');
    this.popupImage = this.elementRef.nativeElement.querySelector('.img-popup img');
    setTimeout(() => {
      this.addShieldToDOM(this.getNameShieldImage());
    }, 100);
    console.log(this.point);
  }

  callChatGPT(): void {
    const sqlCode = this.userQueryTextarea.nativeElement.value;
    this.isButtonClicked = true;
    this.chatgpt.getChatResponse(`Según esta base de datos:\n${ddl}\nEvalúa si esta bien o mal la siguiente consulta:\n${sqlCode}\n para obtener la siguiente información \n${this.point.question}\n.Si esta bien, da la enhorabuena e imprime el resultado de la consulta. Si no, explica el por qué está mal y su corrección`).subscribe((res: any) => {
      this.userQueryTextarea.nativeElement.value = res.choices[0].message.content;
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
    } else {
      this.callChatGPT();
    }
  }

  hideComponent(): void {
    this.isButtonClicked = false;
    this.container.nativeElement.style.display = 'none';
  }
}
