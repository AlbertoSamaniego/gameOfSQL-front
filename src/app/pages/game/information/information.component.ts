import { Component, OnDestroy, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AudioService } from '../../../shared/services/audio-service.service';
import { informationUml } from '../../../shared/constants/information-uml';
import { informationEr } from '../../../shared/constants/information-er';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy {
  private imgElement!: HTMLElement;
  private imgPopup!: HTMLElement | null;
  private popupImage!: HTMLImageElement | null;
  public infoUml = informationUml;
  public infoEr = informationEr;


  constructor(
    private renderer: Renderer2,
    private audioService: AudioService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() {
    this.loadImage();
    this.imgPopup = this.elementRef.nativeElement.querySelector('.img-popup');
    this.popupImage = this.elementRef.nativeElement.querySelector('.img-popup img');
  }

  ngOnDestroy(): void {
    if (this.imgElement && this.imgElement.parentNode === document.body) {
      document.body.removeChild(this.imgElement);
    }
  }

  OnClickPlay() {
    this.audioService.reproducirAudio('click-sound');
  }

  loadImage() {
    this.imgElement = this.renderer.createElement('img');
    this.renderer.setAttribute(this.imgElement, 'src', '../../../../assets/game/fondo-main-menu.jpeg');
    this.renderer.setStyle(this.imgElement, 'position', 'fixed');
    this.renderer.setStyle(this.imgElement, 'top', '0');
    this.renderer.setStyle(this.imgElement, 'left', '0');
    this.renderer.setStyle(this.imgElement, 'width', '100%');
    this.renderer.setStyle(this.imgElement, 'height', 'auto');
    this.renderer.setStyle(this.imgElement, 'z-index', '-1');
    document.body.style.background = 'none';
    document.body.appendChild(this.imgElement);
  }

  displayImageUml() {
    if (this.imgPopup && this.popupImage) {
      this.popupImage.src = '../../../../assets/game/info/uml.jpg';
      this.imgPopup.classList.add('opened');
    }
  }

  displayImageEr() {
    if (this.imgPopup && this.popupImage) {
      this.popupImage.src = '../../../../assets/game/info/er.jpg';
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
