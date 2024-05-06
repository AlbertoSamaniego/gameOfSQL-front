import { Component, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { GameConfigService } from '../../../shared/services/game-config.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { chatGPTService } from '../../../shared/services/chatGPT.service';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../shared/services/auth-service.service';
import { PointsService } from '../../../shared/services/points.service';
import { Point } from '../../../shared/interfaces/point.inteface';
import { GameConfig } from '../../../shared/interfaces/game-config.interface';
import { AudioService } from '../../../shared/services/audio-service.service';
import { ddl } from '../../../shared/constants/database';
import { PointDetailComponent } from './point-detail/point-detail.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('pointDetail') pointDetailComponent: PointDetailComponent | undefined;

  private map!: L.Map;
  public currentUser: User = {} as User;
  private imageWidth!: number;
  private imageHeight!: number;
  private gameConfig!: GameConfig;
  public modalActive: boolean = false;
  private isFullScreen: boolean = false;
  private isDayNight: boolean = false;
  public resGPT = '';
  private intervalId: any;
  public points: Point[] = [];

  constructor(
    private configService: GameConfigService,
    private router: Router,
    private gpt: chatGPTService,
    private authService: AuthService,
    private pointsOfInterestService: PointsService,
    private audioService: AudioService,
  ) { }

  async ngAfterViewInit() {
    this.currentUser = this.authService.getCurrentUser;


    this.gameConfig = this.configService.getGameConfig();
    await this.loadImageAndInitMap();
    setTimeout(async () => {
      await this.loadPointsOfInterest();
    }, 500);
    this.loadGameConfig();
    /* this.gpt.getChatResponse(`Describe la siguiente base de datos:\n${ddl}`).subscribe((res: any) => {
      this.resGPT = res.choices[0].message.content;
      console.log(this.resGPT);
    }); */
    setTimeout(async () => {
      await this.loadIntroduccion();
    }, 1000);
  }

  async loadIntroduccion() {
    this.pointDetailComponent!.currentUser = this.currentUser;
    const pointId53 = this.points.find(point => point.id === "53");
    if (pointId53) {
      this.pointDetailComponent!.point = pointId53;
    }
  }

  loadGameConfig(): void {
    this.gameConfig = this.configService.getGameConfig();
    this.isFullScreen = this.gameConfig.fullScreen === "true";
    this.isDayNight = this.gameConfig.dayNight === "true";
    this.audioService.setMusicVolume(this.gameConfig.musicVolume);
  }

  toggleFullScreen(): void {
    if (this.isFullScreen) {
      this.isFullScreen = false;
      document.body.requestFullscreen();
    } else if (document.fullscreenElement) {
      this.isFullScreen = true;
      document.exitFullscreen();
    }
  }


  toggleDayNight(): void {
    if (this.isDayNight) {
      this.isDayNight = false;
      let brightness = 1;
      this.intervalId = setInterval(() => {
        brightness = brightness === 1 ? 0.3 : 1;
        document.getElementById('map-container')!.style.transition = 'filter 5s';
        document.getElementById('map-container')!.style.filter = `brightness(${brightness})`;
      }, 2000);
    } else {
      clearInterval(this.intervalId);
      this.isDayNight = true;
      document.getElementById('map-container')!.style.filter = 'brightness(1)';
    }
  }


  async loadPointsOfInterest() {
    let iconSize: [number, number] = [52, 72];
    switch (this.gameConfig.pointSize) {
      case 'small':
        iconSize = [32, 52];
        break;
      case 'medium':
        iconSize = [52, 72];
        break;
      case 'big':
        iconSize = [72, 92];
        break;
      default:
        break;
    }
    const customIcon = L.icon({
      iconUrl: '../../../assets/game/map/point-icon.png',
      iconSize: iconSize,
    });
    await this.pointsOfInterestService.getPointsOfInterest().subscribe(points => {
      points.forEach(point => {
        this.points.push(point);
        if (point.coordinates) {
          const coordinates = point.coordinates.split(',').map(coord => parseFloat(coord.trim()));
          const marker = L.marker(coordinates as L.LatLngExpression, { icon: customIcon }).addTo(this.map);
          marker.bindPopup(`<b>${point.title}</b>`);
        }
      });
    });
  }

  async loadImageAndInitMap() {
    const imageUrl = '../../../assets/game/map/map-layer.jpg';
    const img = new Image();
    img.onload = async () => {
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      await this.initMap();
    };
    img.src = imageUrl;
  }

  async initMap() {
    this.map = L.map('map', {
      zoom: 0,
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 1,
      zoomSnap: 0.1,
    });
    const bounds: L.LatLngBoundsLiteral = [[0, 0], [this.imageHeight, this.imageWidth]];
    L.imageOverlay('../../../assets/game/map/map-layer.jpg', bounds).addTo(this.map);
    this.map.setMaxBounds(bounds);
    this.map.fitBounds(bounds);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.modalActive = true;
      if (this.modalActive) {
        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
        if (this.map.tap) this.map.tap.disable();
      }
    } else if (event.key === 'f' || event.key === 'F') {
      if (this.gameConfig.fullScreen === "true") {
        this.toggleFullScreen();
      }
    } else if (event.key === 'd' || event.key === 'D') {
      if(this.gameConfig.dayNight === "true") {
        this.toggleDayNight();
      }
    }
  }

  confirmExit() {
    this.router.navigateByUrl('/game/home-game');
  }

  cancelExit() {
    this.modalActive = false;
    this.map.dragging.enable();
    this.map.touchZoom.enable();
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
    this.map.boxZoom.enable();
    this.map.keyboard.enable();
    if (this.map.tap) this.map.tap.enable();
  }
}
