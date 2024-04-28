import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GameConfigService } from '../../../../../shared/services/game-config.service';
import { GameConfig } from '../../../../../shared/interfaces/game-config.interface';

@Component({
  selector: 'app-game-config',
  templateUrl: './game-config.component.html',
  styleUrl: './game-config.component.scss'
})
export class GameConfigComponent implements OnInit {

  public configGameForm = this.fb.group({
    dayNight: ['false'],
    fullScreen: ['false'],
    musicVolume: [30],
    soundEffect: [50],
    pointSize: ['medium']
  });
  public currentConfig: GameConfig = {} as GameConfig;

  constructor(private fb: FormBuilder, private gameConfigService: GameConfigService) {}


  ngOnInit() {
    this.currentConfig = this.gameConfigService.getGameConfig();
    this.setCharacterFormValues(this.currentConfig.dayNight, this.currentConfig.fullScreen, this.currentConfig.musicVolume, this.currentConfig.soundEffect, this.currentConfig.pointSize);
  }

  setCharacterFormValues(dayNight: string, fullScreen: string, musicVolume: number, soundEffect: number, pointSize: string) {
    this.configGameForm.patchValue({
      dayNight: dayNight,
      fullScreen: fullScreen,
      musicVolume: musicVolume,
      soundEffect: soundEffect,
      pointSize: pointSize
    });
  }

  updateGameConfig(): void {
    const formValues = this.configGameForm.value;
    const gameConfig: GameConfig = {
      dayNight: formValues.dayNight!,
      fullScreen: formValues.fullScreen!,
      musicVolume: formValues.musicVolume!,
      soundEffect: formValues.soundEffect!,
      pointSize: formValues.pointSize!
    };
    this.gameConfigService.updateGameConfig(gameConfig);
    setTimeout(() => {
      console.log('Game config updated', this.gameConfigService.getGameConfig());

    }, 1000);
  }


  }


