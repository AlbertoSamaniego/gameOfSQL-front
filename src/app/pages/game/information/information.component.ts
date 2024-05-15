import { Component, OnDestroy, OnInit, Renderer2, ElementRef } from '@angular/core';
import { informationUml  } from '../../../shared/constants/information-uml';
import { informationEr } from '../../../shared/constants/information-er';
import { AudioService } from '../../../shared/services/game/audio-service.service';

/**
 * Componente encargado de mostrar información sobre el juego.
 */
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

  /**
   * Inicializa el componente.
   */
  ngOnInit() {
    this.loadImage();
    this.imgPopup = this.elementRef.nativeElement.querySelector('.img-popup');
    this.popupImage = this.elementRef.nativeElement.querySelector('.img-popup img');
  }

  /**
   * Destruye el componente.
   */
  ngOnDestroy(): void {
    if (this.imgElement && this.imgElement.parentNode === document.body) {
      document.body.removeChild(this.imgElement);
    }
  }

  /**
   * Controlador de eventos para el evento de clic del botón de reproducción.
   * Reproduce un sonido de clic.
   */
  OnClickPlay() {
    this.audioService.reproducirAudio('click-sound');
  }

  /**
   * Carga la imagen de fondo del componente.
   */
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

  /**
   * Muestra la imagen UML en una ventana emergente.
   */
  displayImageUml() {
    if (this.imgPopup && this.popupImage) {
      this.popupImage.src = '../../../../assets/game/info/uml.jpg';
      this.imgPopup.classList.add('opened');
    }
  }

  /**
   * Muestra la imagen de ER en una ventana emergente.
   */
  displayImageEr() {
    if (this.imgPopup && this.popupImage) {
      this.popupImage.src = '../../../../assets/game/info/er.jpg';
      this.imgPopup.classList.add('opened');
    }
  }

  /**
   * Cierra la ventana emergente de la imagen.
   */
  closePopup() {
    if (this.imgPopup && this.popupImage) {
      this.imgPopup.classList.remove('opened');
      this.popupImage.src = '';
    }
  }

  /**
   * Detiene la propagación del evento dado.
   * @param event: el evento para detener la propagación.
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
