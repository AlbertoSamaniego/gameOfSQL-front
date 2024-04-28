import { Component } from '@angular/core';
import { GameConfigService } from '../../../shared/services/game-config.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  constructor( private configService: GameConfigService ) { }

  ngOnInit(): void {
    console.log(this.configService.getGameConfig());

  }
}
