import { Component, AfterViewInit, HostListener } from '@angular/core';
import { GameConfigService } from '../../../shared/services/game-config.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { chatGPTService } from '../../../shared/services/chatGPT.service';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../shared/services/auth-service.service';
import { PointsService } from '../../../shared/services/points.service';
import { Point } from '../../../shared/interfaces/point.inteface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;
  public currentUser: User = {} as User;
  private imageWidth!: number;
  private imageHeight!: number;
  public modalActive: boolean = false;
  public resGPT = '';
  public points: Point[] = [];

  constructor(
    private configService: GameConfigService,
    private router: Router,
    private gpt: chatGPTService,
    private authService: AuthService,
    private pointsOfInterestService: PointsService,
  ) { }

  ngAfterViewInit(): void {
    console.log(this.configService.getGameConfig());
    this.loadImageAndInitMap();
    this.loadPointsOfInterest();
    /* this.gpt.getChatResponse('Hello buddy').subscribe((res: any) => {
      console.log('res-->', res);
      this.resGPT = res.choices[0].message.content;
      console.log(this.resGPT);
    }); */
    this.currentUser = this.authService.getCurrentUser;
  }

  loadPointsOfInterest() {
    this.pointsOfInterestService.getPointsOfInterest().subscribe(points => {
      points.forEach(point => {
        if (point.coordinates) {
          const coordinates = point.coordinates.split(',').map(coord => parseFloat(coord.trim()));
          const marker = L.marker(coordinates as L.LatLngExpression).addTo(this.map);
          marker.bindPopup(`<b>${point.title}</b>`);
        }
      });
    });
  }

  loadImageAndInitMap(): void {
    const imageUrl = '../../../assets/game/map/map-layer.jpg';
    const img = new Image();
    img.onload = () => {
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      this.initMap();
    };
    img.src = imageUrl;
  }

  initMap(): void {
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

//TODO
/**
 * 1. Import the interest points and represent them on the map
 * 2. The chatbot received the sql of the database
 * 3. When the map component is initialized, the introduccion point is diplayed
 * 4. Only the first point is displayed
 * 5. When the user clicks on the point, the poput with the point's story is displayed (in parts)
 * 6. The user can click on the next button to see the next part of the story
 * 7. When the last part is displayed, the next popup will be the chatbot with the question
 * 8. The user can write the answer and send it
 * 9. The chatbot evaluates the answer and sends back the response
 * 10. The response is displayed in the chatbot popup
 * 11. Depending on the response, the next points are displayed and the user receives posible archievement
 * 12. Repeat from step 5
 * 13. When the last point is displayed, the final popup is displayed with the result of the story
 * 14. The user receives the premium shield
 */
