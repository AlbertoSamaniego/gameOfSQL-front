import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AudioService } from '../../../shared/services/audio-service.service';
import { User } from '../../../shared/interfaces/user.interface';
import { UserService } from '../../../shared/services/user-service.service';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrl: './home-game.component.scss'
})
export class HomeGameComponent implements OnInit, OnDestroy {

  private imgElement!: HTMLElement;
  private currentUser: User = {} as User;

  constructor(private renderer: Renderer2, private audioService: AudioService, private userService: UserService) { }

  ngOnInit(): void {
    this.imgElement = this.renderer.createElement('img');
    this.renderer.setAttribute(this.imgElement, 'src', '../../../../assets/game/fondo-main-menu.jpeg');
    this.renderer.setStyle(this.imgElement, 'width', '100%');
    this.renderer.setStyle(this.imgElement, 'height', 'auto');
    this.renderer.appendChild(document.body, this.imgElement);
    this.audioService.reproducirMusicaDeFondo();

    const userEmail = localStorage.getItem('user')?.toString();

    if (userEmail) {
      this.userService.getDataRegisteredUser(userEmail).subscribe({
        next: (userData: User[]) => {
          if (userData.length > 0) {
            this.currentUser = userData[0];
            console.log(this.currentUser);
          }
        },
        error: (error: any) => {
          console.error('Error al obtener los datos del usuario:', error);
        }
      });
    }
  }


  ngOnDestroy(): void {
    if (this.imgElement && this.imgElement.parentNode === document.body) {
      document.body.removeChild(this.imgElement);
    }
  }

  OnClickCloseSession() {
    this.audioService.detenerMusicaDeFondo();
    localStorage.clear();
  }

  OnClickPlay() {
    this.audioService.reproducirAudio('click-sound');
  }

}
