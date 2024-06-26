import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { endpoints } from '../../../shared/constants/end-points';
import { User } from '../../../shared/interfaces/user.interface';
import { AudioService } from '../../../shared/services/game/audio-service.service';
import { AuthService } from '../../../shared/services/user/auth-service.service';

/**
 * Componente para la página de inicio del juego.
 */
@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrl: './home-game.component.scss'
})
export class HomeGameComponent implements OnInit, OnDestroy {

  private imgElement!: HTMLElement;
  public currentUser: User = {} as User;

  constructor(
    private renderer: Renderer2,
    private audioService: AudioService,
    private authService: AuthService,
  ) { }

  /**
   * Inicializa el componente.
   */
  async ngOnInit() {
    this.loadImage();
    await this.getUserByEmail();
    this.currentUser =  this.authService.getCurrentUser;
  }

  /**
   * Limpia el componente antes de que sea destruido.
   */
  ngOnDestroy(): void {
    if (this.imgElement && this.imgElement.parentNode === document.body) {
      document.body.removeChild(this.imgElement);
    }
  }

  /**
   * Maneja el evento de clic para el botón de cerrar sesión.
   */
  OnClickCloseSession() {
    this.audioService.detenerMusicaDeFondo();
    localStorage.clear();
    this.authService.setCurrentUser(null);
  }

  /**
   * Maneja el evento de clic para el botón de reproducción.
   */
  OnClickPlay() {
    this.audioService.reproducirAudio('click-sound');
  }

  /**
   * Carga la imagen de fondo de la página.
   */
  loadImage() {
    this.imgElement = this.renderer.createElement('img');
    this.renderer.setAttribute(this.imgElement, 'src', '../../../../assets/game/fondo-main-menu.jpeg');
    this.renderer.setStyle(this.imgElement, 'width', '100%');
    this.renderer.setStyle(this.imgElement, 'height', '100vh');
    this.renderer.appendChild(document.body, this.imgElement);
    this.audioService.reproducirMusicaDeFondo();
  }

  /**
   * Recupera al usuario por correo electrónico del servicio de autenticación.
   */
  async getUserByEmail() {
    const userEmail = localStorage.getItem('user')?.toString();

    if (userEmail) {
      try {
        const user = await this.authService.getUserByEmail(userEmail);
        if (user) {
          this.currentUser = user;
          this.addShieldToDOM(this.getNameShieldImage());
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Recupera el nombre de la imagen de escudo del usuario actual.
   * @returns El nombre de la imagen del escudo.
   */
  getNameShieldImage(): string {
    return this.currentUser.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  /**
   * Agrega la imagen de escudo del usuario al DOM.
   * @param shieldName: el nombre de la imagen del escudo.
   */
  addShieldToDOM(shieldName: string) {
    const shieldDiv = document.getElementById('user-shield');
    if(shieldDiv){
      shieldDiv.style.backgroundImage = `url('${endpoints.urlImageShield}${shieldName}')`;
    }
  }

}
