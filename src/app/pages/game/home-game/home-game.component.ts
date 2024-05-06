import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AudioService } from '../../../shared/services/audio-service.service';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../shared/services/auth-service.service';
import { endpoints } from '../../../shared/constants/end-points';

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

   async ngOnInit() {
    this.loadImage();
    await this.getUserByEmail();
    this.currentUser =  this.authService.getCurrentUser;
  }

  ngOnDestroy(): void {
    if (this.imgElement && this.imgElement.parentNode === document.body) {
      document.body.removeChild(this.imgElement);
    }
  }

  OnClickCloseSession() {
    this.audioService.detenerMusicaDeFondo();
    localStorage.clear();
    this.authService.setCurrentUser(null);
  }

  OnClickPlay() {
    this.audioService.reproducirAudio('click-sound');
  }

  loadImage() {
    this.imgElement = this.renderer.createElement('img');
    this.renderer.setAttribute(this.imgElement, 'src', '../../../../assets/game/fondo-main-menu.jpeg');
    this.renderer.setStyle(this.imgElement, 'width', '100%');
    this.renderer.setStyle(this.imgElement, 'height', '100vh');
    this.renderer.appendChild(document.body, this.imgElement);
    this.audioService.reproducirMusicaDeFondo();
  }

  async getUserByEmail() {
    const userEmail = localStorage.getItem('user')?.toString();

    if (userEmail) {
      try {
        const user = await this.authService.getUserByEmail(userEmail);
        if (user) {
          this.currentUser = user;
          this.addShieldToDOM(this.getNameShieldImage());
        } else {
          console.log('No se encontró ningún usuario para el correo electrónico proporcionado.');
        }
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    }
  }

  getNameShieldImage(): string {
    return this.currentUser.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  addShieldToDOM(shieldName: string) {
    const shieldDiv = document.getElementById('user-shield');
    if(shieldDiv){
      shieldDiv.style.backgroundImage = `url('${endpoints.urlImageShield}${shieldName}')`;
    }
  }

}
