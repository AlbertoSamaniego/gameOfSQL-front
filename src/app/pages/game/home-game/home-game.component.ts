import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/interfaces/user.interface';
import { UserServiceService } from '../../../shared/services/user-service.service';

@Component({
  selector: 'app-home-game',
  templateUrl: './home-game.component.html',
  styleUrl: './home-game.component.scss'
})
export class HomeGameComponent implements OnInit{
  users: User[] = [];

  constructor(private userService: UserServiceService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe( users => {
      this.users = users;
      console.log(users);

    });
  }
}
