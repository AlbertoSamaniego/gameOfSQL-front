import { Component, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../shared/interfaces/user.interface';
import { Point } from '../../../shared/interfaces/point.inteface';
import { GameConfig } from '../../../shared/interfaces/game-config.interface';
import { Hint } from '../../../shared/interfaces/hint.interface';
import * as L from 'leaflet';

import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { PointDetailComponent } from './components/point-detail/point-detail.component';

import { AuthService } from '../../../shared/services/user/auth-service.service';
import { GameConfigService } from '../../../shared/services/game/game-config.service';
import { AudioService } from '../../../shared/services/game/audio-service.service';
import { PointService } from '../../../shared/services/point/points-service.service';
import { HintsService } from '../../../shared/services/game/hints.service';
import { UserService } from '../../../shared/services/user/user-service.service';
import { PointsService } from '../../../shared/services/point/points.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  @ViewChild('pointDetail') pointDetailComponent: PointDetailComponent | undefined;
  @ViewChild('chatbot') chatbotComponent!: ChatbotComponent;

  private map!: L.Map;
  public currentUser: User = {} as User;
  private imageWidth!: number;
  private imageHeight!: number;
  private gameConfig!: GameConfig;
  public modalActive: boolean = false;
  private isFullScreen: boolean = false;
  private isDayNight: boolean = false;
  public showChatbotComponent: boolean = false;
  public showHintComponent: boolean = false;
  public showArchievementComponent: boolean = false;
  public resGPT = '';
  private intervalId: any;
  public point: Point | null = {} as Point;
  public selectedPoint: Point | null = {} as Point;
  public selectedHint: Hint | null = {} as Hint;
  public hintsClicked: number[] = [];
  public endReached: boolean = false;
  public level: string = '1';
  public guessedIDPoints: string[] = [];
  public failedIDPoints: string[] = [];
  public finalPoint: Point | null = {} as Point;


  constructor(
    private configService: GameConfigService,
    private router: Router,
    private authService: AuthService,
    private audioService: AudioService,
    private pointService: PointService,
    private pointsService: PointsService,
    private hintService: HintsService,
    private userService: UserService
  ) { }

  async ngAfterViewInit() {
    this.currentUser = this.authService.getCurrentUser;
    this.gameConfig = this.configService.getGameConfig();
    await this.loadImageAndInitMap();
    await this.loadIntroduccion();
    this.point = await this.pointService.getPointById("54");
    this.loadGameConfig();
    if (this.point) {
      this.loadPoints([this.point]);
    }
  }

  async loadIntroduccion() {
    this.pointDetailComponent!.currentUser = this.currentUser;
    await this.pointService.getPointById("53");
    this.pointDetailComponent!.point = this.pointService.getCurrentPoint;
  }

  loadGameConfig(): void {
    this.gameConfig = this.configService.getGameConfig();
    this.isFullScreen = this.gameConfig.fullScreen === "true";
    this.isDayNight = this.gameConfig.dayNight === "true";
    this.audioService.setMusicVolume(this.gameConfig.musicVolume);
  }

  async handleChatbotResponse(result: boolean) {
    let pointsToLoad: Point[] = [];
    this.guessedIDPoints = [];
    this.failedIDPoints = [];
    if (result) {
      this.guessedIDPoints.push(this.selectedPoint!.id.toString());
    } else {
      this.failedIDPoints.push(this.selectedPoint!.id.toString());
    }
    pointsToLoad = this.updateLevel(pointsToLoad);
        setTimeout(() => {
          const filteredPoints = this.filterPoints(pointsToLoad);
          this.clearMap();
          this.loadPoints(filteredPoints);
          if(this.level === '7') {
            this.finalPoint = filteredPoints[0];
          }
        }, 500);

  }

  updateLevel(pointsToLoad: Point[]) {
    this.level = (parseInt(this.level) + 1).toString();
    this.pointsService.getPointsByLevel(parseInt(this.level)).subscribe((points) => {
      pointsToLoad.push(...points);
    });
    return pointsToLoad;
  }

  filterPoints(points: Point[]): Point[] {
    return points.filter(point => {
      const failedMatch = this.failedIDPoints.every(id => 	point.failed_required_points.includes(id));
      const guessedMatch = this.guessedIDPoints.every(id => 	point.guessed_required_points.includes(id));
      return failedMatch && guessedMatch;
    });
  }

  clearMap() {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
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

  onPointDetailComponentHidden(): void {
    this.showChatbotComponent = true;
  }

  updateClickedHints(updatedHints: number[]): void {
    this.hintsClicked = updatedHints;
  }

  showHint(index: number) {
    this.hintService.getHints().subscribe((hints) => {
      const hint = hints[index];
      if (hint) {
        this.selectedHint = hint;
        this.showHintComponent = true;
      }
    });
  }

  hideHintComponent(): void {
    this.showHintComponent = false;
    this.selectedHint = null;
  }

  updateUserArchievement(): void {
    if (this.selectedPoint?.archievement !== false) {
      if (Array.isArray(this.currentUser?.archievements_id) && this.selectedPoint?.archievement && !this.currentUser?.archievements_id?.includes(this.selectedPoint?.archievement)) {
        this.currentUser?.archievements_id?.push(this.selectedPoint?.archievement);
        this.showArchievementComponent = true;
        this.userService.updateArchievements(this.currentUser.user_id, this.currentUser.archievements_id).subscribe({
          next: (userData: User) => {
            this.authService.setCurrentUser(userData);
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      }
    }
    setTimeout(() => {
      this.showArchievementComponent = false;
    }, 7000);
  }

  async loadPoints(points: Point[]) {
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
    points.forEach(point => {
      if (point.coordinates !== false) {
        const coordinates = point.coordinates.split(',').map(coord => parseFloat(coord.trim()));
        const marker = L.marker(coordinates as L.LatLngExpression, { icon: customIcon }).addTo(this.map);
        marker.bindPopup(`<b>${point.title}</b>`);

        marker.on('mouseover', () => {
          marker.openPopup();
        });

        marker.on('mouseout', () => {
          marker.closePopup();
        });

        marker.on('click', () => {
          if (this.pointDetailComponent) {
            this.showChatbotComponent = false;
            this.pointDetailComponent.showComponent(point);
            this.selectedPoint = point;
          }
        });
      }
    });
  }

  showEnding() {
    this.endReached = true;
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
      minZoom: -1,
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
    } else if ((event.ctrlKey || event.metaKey) && (event.key === 'f' || event.key === 'F')) {
      if (this.gameConfig.fullScreen === "true") {
        this.toggleFullScreen();
      }
    } else if ((event.ctrlKey || event.metaKey) && (event.key === 'd' || event.key === 'D')) {
      if (this.gameConfig.dayNight === "true") {
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
