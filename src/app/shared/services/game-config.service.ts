import { Injectable } from '@angular/core';
import { GameConfig } from '../interfaces/game-config.interface';

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

  updateGameConfig(newConfig: GameConfig): void {
    this.gameConfig = newConfig;
  }

  getGameConfig(): GameConfig {
    return this.gameConfig;
  }

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
