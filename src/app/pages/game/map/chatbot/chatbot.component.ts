import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {

  private imgPopup!: HTMLElement | null;
  private popupImage!: HTMLImageElement | null;

  constructor( private elementRef: ElementRef, ) { }

  ngOnInit() {
    this.imgPopup = this.elementRef.nativeElement.querySelector('.img-popup');
    this.popupImage = this.elementRef.nativeElement.querySelector('.img-popup img');
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
}
