import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrl: './home-game.component.scss'
})
export class HomeGameComponent {
  users: User[] = [];

  constructor() { }

}
