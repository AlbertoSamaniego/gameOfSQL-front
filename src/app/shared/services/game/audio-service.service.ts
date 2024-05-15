import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para gestionar la reproducción de audio en el juego.
 */
export class AudioService {

  private audioMusicaDeFondo: HTMLAudioElement;

  constructor() {
    this.audioMusicaDeFondo = new Audio();
    this.audioMusicaDeFondo.src = '../../assets/sound-effects/ambient-sound.mp3';
    this.audioMusicaDeFondo.loop = true;
    this.audioMusicaDeFondo.load();
    this.audioMusicaDeFondo.play();
    this.audioMusicaDeFondo.addEventListener('ended', () => {
      this.audioMusicaDeFondo.currentTime = 0;
      this.audioMusicaDeFondo.play();
    });
  }

  /**
   * Reproduce el archivo de audio especificado.
   * @param archivo - El nombre del archivo de audio que se reproducirá (sin la extensión del archivo).
   */
  reproducirAudio(archivo: string) {
    const audio = new Audio();
    audio.src = `../../assets/sound-effects/${archivo}.mp3`;
    audio.load();
    audio.play();
  }

  /**
   * Establece el volumen de la música de fondo.
   * @param volume - El nivel de volumen a configurar (entre 0 y 100).
   */
  setMusicVolume(volume: number) {
    this.audioMusicaDeFondo.volume = volume / 100;
  }

  /**
   * Comienza a reproducir la música de fondo.
   */
  reproducirMusicaDeFondo() {
    this.audioMusicaDeFondo.play();
  }

  /**
   * Deja de reproducir la música de fondo.
   */
  detenerMusicaDeFondo() {
    this.audioMusicaDeFondo.pause();
  }

}
