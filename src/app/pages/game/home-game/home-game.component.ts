import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrl: './home-game.component.scss'
})
export class HomeGameComponent implements OnInit, OnDestroy {

  private imgElement!: HTMLElement;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.imgElement = this.renderer.createElement('img');
    this.renderer.setAttribute(this.imgElement, 'src', '../../../../assets/game/fondo-main-menu.jpeg');
    this.renderer.setStyle(this.imgElement, 'width', '100%');
    this.renderer.setStyle(this.imgElement, 'height', 'auto');
    this.renderer.appendChild(document.body, this.imgElement);
  }

  ngOnDestroy(): void {
    if (this.imgElement && this.imgElement.parentNode === document.body) {
      document.body.removeChild(this.imgElement);
    }
  }

  OnClickCloseSession() {
    localStorage.clear();
  }

}
