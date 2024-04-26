import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../shared/services/auth-service.service';
import { User } from '../../../../../shared/interfaces/user.interface';
import { Shield } from '../../../../../shared/interfaces/shield.interface';
import { ShieldsService } from '../../../../../shared/services/shields.service';
import { endpoints } from '../../../../../shared/constants/end-points';

@Component({
  selector: 'app-game-profile',
  templateUrl: './game-profile.component.html',
  styleUrls: ['./game-profile.component.scss']
})
export class GameProfileComponent implements OnInit {

  public currentUser: User = {} as User;
  public shields: Shield[] = [];
  public urlShields: string[] = [];
  public indexShield!: number;

  constructor(private authService: AuthService, private shieldService: ShieldsService) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser;
    this.addCharacterToDOM(this.currentUser.character_name, this.currentUser.house_name, this.currentUser.character_nickname, this.currentUser.house_motto)
    this.initShields();
  }

  addCharacterToDOM(name: string, house: string, nickname: string, motto: string) {
    const nameElement = document.getElementById('name') as HTMLInputElement;
    const houseElement = document.getElementById('house') as HTMLInputElement;
    const nicknameElement = document.getElementById('nickname') as HTMLInputElement;
    const mottoElement = document.getElementById('motto') as HTMLInputElement;

    nameElement.value = name;
    houseElement.value = house;
    nicknameElement.value = nickname;
    mottoElement.value = motto;
  }

  initShields() {
    this.shieldService.getShields().subscribe((shields) => {
      this.shields = shields;
      this.shields.forEach((shield) => {
        const filename: string = shield.image.split("/").pop()!;
        this.urlShields.push(filename);
        this.addCurrentShieldToDOM(this.urlShields);
      });
    });
  }

  addCurrentShieldToDOM(urlShields: string[]) {
    const shieldElement = document.getElementById('user-shield') as HTMLInputElement;
    if (shieldElement) {
      shieldElement.style.backgroundImage = `url(${endpoints.urlImageShield}${this.getUserShieldImage()})`;
      this.indexShield = urlShields.indexOf(this.getUserShieldImage());
    }
  }

  showPreviousShield() {
    if (this.shields.length === 0) return;
    this.indexShield = (this.indexShield - 1 + this.shields.length) % this.shields.length;
    this.updateShieldImage();
  }

  showNextShield() {
    if (this.shields.length === 0) return;
    this.indexShield = (this.indexShield + 1) % this.shields.length;
    this.updateShieldImage();
  }

  updateShieldImage() {
    const shieldElement = document.getElementById('user-shield') as HTMLInputElement;
    if (shieldElement) {
      shieldElement.style.backgroundImage = `url(${endpoints.urlImageShield}${this.urlShields[this.indexShield]})`;
    }
  }

  getUserShieldImage(): string {
    return this.currentUser.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  filterNameShieldImage(fullUrl: string): string {
    return fullUrl.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

}
