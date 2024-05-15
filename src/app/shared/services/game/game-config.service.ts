import { Injectable } from '@angular/core';
import { GameConfig } from '../../interfaces/game-config.interface';

/**
 * Servicio de gestión de la configuración del juego.
 */
@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  private gameConfig: GameConfig = {
    dayNight: "false",
    fullScreen: "false",
    musicVolume: 30,
    soundEffect: 50,
    pointSize: 'medium'
  };

  constructor() {

  }

  /**
   * Actualiza la configuración del juego con la nueva configuración proporcionada.
   * @param newConfig La nueva configuración del juego.
   */
  updateGameConfig(newConfig: GameConfig): void {
    this.gameConfig = newConfig;
  }

  /**
   * Recupera la configuración actual del juego.
   * @returns La configuración actual del juego.
   */
  getGameConfig(): GameConfig {
    return this.gameConfig;
  }

  /**
   * Restablece la configuración del juego a sus valores predeterminados.
   */
  rebootGameConfig(): void {
    this.gameConfig = {
      dayNight: "false",
      fullScreen: "false",
      musicVolume: 30,
      soundEffect: 50,
      pointSize: 'medium'
    };
  }
}
