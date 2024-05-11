import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Point } from '../../../../shared/interfaces/point.inteface';
import { User } from '../../../../shared/interfaces/user.interface';
import { Shield } from '../../../../shared/interfaces/shield.interface';
import { endpoints } from '../../../../shared/constants/end-points';
import { UserService } from '../../../../shared/services/user/user-service.service';
import { AuthService } from '../../../../shared/services/user/auth-service.service';
import { ShieldService } from '../../../../shared/services/shield/shield-service.service';

@Component({
  selector: 'app-ending',
  templateUrl: './ending.component.html',
  styleUrl: './ending.component.scss'
})
export class EndingComponent implements OnInit{

  @Input() point: Point = {} as Point;
  @Input() currentUser: User | null = {} as User;
  @ViewChild('user_shield') user_shield!: ElementRef<HTMLDivElement>;
  @ViewChild('reward_shield') reward_shield!: ElementRef<HTMLDivElement>;
  segments: string[] = [];
  currentSegmentIndex: number = 0;
  rewardShield: Shield ={} as Shield;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private shieldService: ShieldService
   ) { }

  ngOnInit() {
    setTimeout(() => {
      this.initComponent();
    }, 100);
  }

  async initComponent() {
    this.addUserShieldToDOM(this.getUserNameShieldImage());
    this.replaceHistoryString();
    this.splitHistoryIntoSegments();
    if(this.point.reward !== false){
      this.showReward();
      await this.updateRewardShield();
      return this.addRewardShieldToDOM(await this.getShieldNameByShieldId());
    }
  }

  getUserNameShieldImage(): string {
    return this.currentUser?.url_shield?.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }

  async getShieldNameByShieldId() {
    let shieldName = '';
    if (this.point.reward) {
      await this.shieldService.getShieldById(this.point.reward);
      this.rewardShield = this.shieldService.getShield;
      shieldName = this.rewardShield.image.split("/").pop()!;
  }
  return shieldName;
}



  addUserShieldToDOM(shieldName: string): void {
    this.user_shield.nativeElement.style.backgroundImage = `url('${endpoints.urlImageShield}${shieldName}')`;
  }

  showReward(): void {
    const rewardContainer = document.getElementById('reward-container');
    if (rewardContainer) {
      rewardContainer.style.display = 'block';
    }
  }

  addRewardShieldToDOM(shieldName: string): void {
    this.reward_shield.nativeElement.style.backgroundImage = `url('${endpoints.urlImageShield}${shieldName}')`;
  }

  async updateRewardShield() {
    if (Array.isArray(this.currentUser?.premium_shields) && this.point.reward && !this.currentUser?.premium_shields?.includes(this.point.reward)) {
      this.currentUser?.premium_shields?.push(this.point.reward);
      this.userService.updatePremiumShields(this.currentUser.user_id, this.currentUser.premium_shields).subscribe({
        next: (userData: User) => {
          this.authService.setCurrentUser(userData);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }

  replaceHistoryString(): void {
    if (this.point && this.point.history) {
      const replaceCharacterName = this.currentUser!.character_name + ' "' + this.currentUser!.character_nickname + '" ';
      const replaceHouseName = this.currentUser!.house_name;
      this.point.history = this.point.history.replace("Medger", replaceCharacterName).replace("Cerwyn", replaceHouseName);
    }
  }

  splitHistoryIntoSegments(): void {
    if (this.point && this.point.history) {
      const words = this.point.history.split(' ');
      const segmentSize = 150;
      for (let i = 0; i < words.length; i += segmentSize) {
        this.segments.push(words.slice(i, i + segmentSize).join(' '));
      }
    }
  }

  onNextSegmentClick(): void {
    if (this.currentSegmentIndex < this.segments.length - 1) {
      this.currentSegmentIndex++;
    } else {
      this.router.navigateByUrl('/game/home-game');
    }
  }

}
