import { Component } from '@angular/core';

/**
 * Interfaz de configuración para un copo de nieve.
 */
interface SnowFlakeConfig {
  depth: number;
  left: number;
  speed: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    'styles/home-banner.component.scss',
    'styles/home-cards.component.scss',
    'styles/home-marquee.component.scss',
    'styles/home-houses.component.scss',
  ]
})
export class HomeComponent {

  /**
   * Array de configuraciones de copos de nieve.
   */
  public snowFlakes: SnowFlakeConfig[];

  constructor() {
    this.snowFlakes = [];

    for (let i = 0; i < 100; i++) {
      this.snowFlakes.push({
        depth: this.randRange(1, 5),
        left: this.randRange(0, 100),
        speed: this.randRange(1, 5),
      });
    }
  }

  /**
   * Genera un número aleatorio dentro del rango especificado.
   * @param min: el valor mínimo del rango.
   * @param max: el valor máximo del rango.
   * @returns Un número aleatorio dentro del rango especificado.
   */
  private randRange(min: number, max: number): number {
    var range = max - min;
    return min + Math.round(Math.random() * range);
  }
}
