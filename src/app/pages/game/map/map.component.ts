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

/**
 * Representa la clase MapComponent.
 * Este componente es responsable de mostrar el mapa del juego y manejar las interacciones del usuario.
 */
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

  /**
   * Inicializa el componente después de que Angular haya inicializado las vistas del componente.
   * Carga la imagen y el mapa, y carga la introducción del juego.
   * Establece el usuario actual para el componente de detalle de punto y recupera el punto con el ID especificado.
   * Actualiza la propiedad de punto del componente de detalle de punto con el punto recuperado.
   */
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

  /**
   * Carga la introducción del juego.
   * Establece el usuario actual para el componente de detalle de punto y recupera el punto con el ID especificado.
   * Actualiza la propiedad de punto del componente de detalle de punto con el punto recuperado.
   */
  async loadIntroduccion() {
    this.pointDetailComponent!.currentUser = this.currentUser;
    await this.pointService.getPointById("53");
    this.pointDetailComponent!.point = this.pointService.getCurrentPoint;
  }

  /**
   * Carga la configuración del juego.
   */
  loadGameConfig(): void {
    this.gameConfig = this.configService.getGameConfig();
    this.isFullScreen = this.gameConfig.fullScreen === "true";
    this.isDayNight = this.gameConfig.dayNight === "true";
    this.audioService.setMusicVolume(this.gameConfig.musicVolume);
  }

  /**
   * Maneja la respuesta del chatbot.
   * Actualiza los puntos a cargar y los puntos a mostrar en el mapa.
   * @param result - El resultado de la respuesta del chatbot.
   */
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

  /**
   * Actualiza el nivel del juego y los puntos a cargar.
   * @param pointsToLoad - Un array de puntos a cargar.
   * @returns Un array de puntos a cargar actualizado.
   */
  updateLevel(pointsToLoad: Point[]) {
    this.level = (parseInt(this.level) + 1).toString();
    this.pointsService.getPointsByLevel(parseInt(this.level)).subscribe((points) => {
      pointsToLoad.push(...points);
    });
    return pointsToLoad;
  }

  /**
   * Filtra los puntos a mostrar en el mapa.
   * @param points - Un array de puntos a filtrar.
   * @returns Un array de puntos filtrados.
   */
  filterPoints(points: Point[]): Point[] {
    return points.filter(point => {
      const failedMatch = this.failedIDPoints.every(id => 	point.failed_required_points.includes(id));
      const guessedMatch = this.guessedIDPoints.every(id => 	point.guessed_required_points.includes(id));
      return failedMatch && guessedMatch;
    });
  }

  /**
   * Limpia el mapa de marcadores.
   */
  clearMap() {
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  }

  /**
   * Cambia el tamaño de la pantalla a pantalla completa o viceversa.
   */
  toggleFullScreen(): void {
    if (this.isFullScreen) {
      this.isFullScreen = false;
      document.body.requestFullscreen();
    } else if (document.fullscreenElement) {
      this.isFullScreen = true;
      document.exitFullscreen();
    }
  }

  /**
   * Cambia entre el modo día y el modo noche.
   */
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

  /**
   * Muestra el componente de chatbot.
   * @param point - El punto seleccionado.
   */
  onPointDetailComponentHidden(): void {
    this.showChatbotComponent = true;
  }

  /**
   * Actualiza los puntos de pista que se han hecho clic.
   * @param updatedHints - Un array de índices de pistas que se han hecho clic.
   */
  updateClickedHints(updatedHints: number[]): void {
    this.hintsClicked = updatedHints;
  }

  /**
   * Muestra la pista seleccionada.
   * @param index - El índice de la pista seleccionada.
   */
  showHint(index: number) {
    this.hintService.getHints().subscribe((hints) => {
      const hint = hints[index];
      if (hint) {
        this.selectedHint = hint;
        this.showHintComponent = true;
      }
    });
  }

  /**
   * Oculta el componente de pista.
   */
  hideHintComponent(): void {
    this.showHintComponent = false;
    this.selectedHint = null;
  }

  /**
   * Actualiza el logro del usuario según el punto seleccionado.
   * Si el punto seleccionado tiene un logro y aún no está incluido en los logros del usuario,
   * agrega el logro a los logros del usuario y actualiza los datos del usuario.
   * Después de la actualización, establece un tiempo de espera para ocultar el componente de logros después de 7 segundos.
   */
  updateUserArchievement(): void {
    if (this.selectedPoint?.archievement !== false) {
      if (Array.isArray(this.currentUser?.archievements_id) &&
       this.selectedPoint?.archievement &&
        !this.currentUser?.archievements_id?.includes(this.selectedPoint?.archievement)) {
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

  /**
   * Carga los puntos en el mapa.
   * @param points - Un array de puntos a cargar.
   * @returns Un array de puntos cargados.
   */
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

  /**
   * Muestra la pantalla final del juego.
   */
  showEnding() {
    this.endReached = true;
  }

  /**
   * Carga la imagen del mapa y luego inicializa el mapa.
   * La imagen se carga primero para obtener el ancho y el alto de la imagen.
   * Luego, el mapa se inicializa con la imagen cargada.
   * Esto se hace para que el mapa se ajuste correctamente a la imagen.
   */
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

  /**
   * Inicializa el mapa con la imagen del mapa cargada.
   * El mapa se inicializa con la imagen del mapa cargada y se establecen los límites del mapa.
   * El mapa se ajusta a los límites de la imagen.
   */
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
  /**
   * Maneja los eventos del teclado.
   * Si el usuario presiona la tecla Escape, deshabilita las interacciones del mapa.
   * Si el usuario presiona Ctrl + F, cambia al modo de pantalla completa.
   * Si el usuario presiona Ctrl + D, cambia entre el modo día y el modo noche.
   * @param event - El evento del teclado.
   */
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

  /**
   * Navega al inicio del juego.
   */
  confirmExit() {
    this.router.navigateByUrl('/game/home-game');
  }

  /**
   * Cancela la navegación al inicio del juego.
   * Habilita las interacciones del mapa.
   */
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
