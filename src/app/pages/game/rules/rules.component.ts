import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { User } from '../../../shared/interfaces/user.interface';
import { AudioService } from '../../../shared/services/game/audio-service.service';

/**
 * Componente que representa la página de reglas del juego.
 */
@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss'
})
export class RulesComponent implements OnInit, OnDestroy {
  private imgElement!: HTMLElement;
  public currentUser: User = {} as User;

  constructor(private renderer: Renderer2, private audioService: AudioService,) { }

  /**
   * Inicializa el componente.
   */
  ngOnInit() {
    this.loadImage();
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
   * Reproduce el sonido de click al presionar el botón de play.
   */
  OnClickPlay() {
    this.audioService.reproducirAudio('click-sound');
  }

  /**
   * Reproduce el sonido de click al presionar el botón de back.
   */
  loadImage(){
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
