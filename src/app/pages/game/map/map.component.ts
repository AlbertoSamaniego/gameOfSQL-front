import { Component, AfterViewInit, HostListener } from '@angular/core';
import { GameConfigService } from '../../../shared/services/game-config.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { OpenAI } from 'openai'
import { chatGPTService } from '../../../shared/services/chatGPT.service';
import { environments } from '../../../../environments/environments';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  private map!: L.Map;
  private imageWidth!: number;
  private imageHeight!: number;
  public modalActive: boolean = false;
  private openai: OpenAI = new OpenAI({
    dangerouslyAllowBrowser: true,
    project: ''
  });
  public resGPT = '';

  constructor(
    private configService: GameConfigService,
    private router: Router,
    private gpt: chatGPTService,
  ) { }

  ngAfterViewInit(): void {
    console.log(this.configService.getGameConfig());
    this.loadImageAndInitMap();
    this.gpt.getChatResponse('Hello buddy').subscribe((res : any ) => {
      console.log('res-->',res);
      this.resGPT = res.choices[0].message.content;
      console.log(this.resGPT);

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
      center: [this.imageHeight / 2, this.imageWidth / 2],
      zoom: 0,
      crs: L.CRS.Simple,
      minZoom: -0.55,
      maxZoom: 1.5,
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
    }
  }

  confirmExit() {
    this.router.navigateByUrl('/game/home-game');
  }

  cancelExit() {
    this.modalActive = false;
  }
}
