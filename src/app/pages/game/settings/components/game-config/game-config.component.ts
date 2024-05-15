import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GameConfig } from '../../../../../shared/interfaces/game-config.interface';
import { GameConfigService } from '../../../../../shared/services/game/game-config.service';

@Component({
  selector: 'app-game-config',
  templateUrl: './game-config.component.html',
  styleUrl: './game-config.component.scss'
})
/**
 * Componente que representa la página de configuración del juego.
 */
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


  /**
   * Inicializa el componente.
   * Recupera la configuración del juego desde gameConfigService y establece los valores del formulario en consecuencia.
   */
  ngOnInit() {
    this.currentConfig = this.gameConfigService.getGameConfig();
    this.setCharacterFormValues(this.currentConfig.dayNight, this.currentConfig.fullScreen, this.currentConfig.musicVolume, this.currentConfig.soundEffect, this.currentConfig.pointSize);
  }

  /**
   * Establece los valores del formulario para la configuración de caracteres.
   *
   * @param dayNight: el modo día/noche seleccionado.
   * @param fullScreen: el modo de pantalla completa seleccionado.
   * @param musicVolume: el volumen de la música seleccionada.
   * @param soundEffect: el nivel del efecto de sonido seleccionado.
   * @param pointSize: el tamaño en puntos seleccionado.
   */
  setCharacterFormValues(dayNight: string, fullScreen: string, musicVolume: number, soundEffect: number, pointSize: string) {
    this.configGameForm.patchValue({
      dayNight: dayNight,
      fullScreen: fullScreen,
      musicVolume: musicVolume,
      soundEffect: soundEffect,
      pointSize: pointSize
    });
  }

  /**
   * Actualiza la configuración del juego.
   */
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
  }
}


