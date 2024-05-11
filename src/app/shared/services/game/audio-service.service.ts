import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
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

  reproducirAudio(archivo: string) {
    const audio = new Audio();
    audio.src = `../../assets/sound-effects/${archivo}.mp3`;
    audio.load();
    audio.play();
  }

  setMusicVolume(volume: number) {
    this.audioMusicaDeFondo.volume = volume / 100;
  }

  reproducirMusicaDeFondo() {
    this.audioMusicaDeFondo.play();
  }

  detenerMusicaDeFondo() {
    this.audioMusicaDeFondo.pause();
  }

}
