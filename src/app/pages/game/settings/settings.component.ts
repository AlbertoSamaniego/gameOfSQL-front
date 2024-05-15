import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AudioService } from '../../../shared/services/game/audio-service.service';

/**
 * Componente que representa la página de configuración del juego.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {
  /**
   * La sección actual de la página de configuración.
   */
  currentSection: string = 'game-profile';

  private imgElement!: HTMLElement;

  constructor(private renderer: Renderer2, private audioService: AudioService) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit(): void {
    this.loadImage();
    this.audioService.reproducirMusicaDeFondo();
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
   * Muestra la sección especificada de la página de configuración.
   * @param section: la sección que se mostrará.
   */
  showSection(section: string) {
    this.audioService.reproducirAudio('click-sound');
    this.currentSection = section;
  }

  /**
   * Reproduce el sonido de click al presionar el botón de play.
   */
  OnClickPlay() {
    this.audioService.reproducirAudio('click-sound');
  }

  /**
   * Carga la imagen de fondo de la página de configuración.
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
}
