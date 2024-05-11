import { Component, OnInit } from '@angular/core';
import { Archievement } from '../../../../../shared/interfaces/archievement.interface';
import { endpoints } from '../../../../../shared/constants/end-points';
import { User } from '../../../../../shared/interfaces/user.interface';
import { ArchievementService } from '../../../../../shared/services/archievement/archievements.service';
import { AuthService } from '../../../../../shared/services/user/auth-service.service';

@Component({
  selector: 'app-user-archievements',
  templateUrl: './user-archievements.component.html',
  styleUrl: './user-archievements.component.scss'
})
export class UserArchievementsComponent implements OnInit{

  public archievements: Archievement[] = [];
  public currentUser: User = {} as User;

  constructor( private authService: AuthService, private archievementService: ArchievementService ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser;
    this.getArchievements();
  }

  representArchievements() {
    this.archievements.forEach(archievement => {
      if(!this.currentUser.archievements_id.includes(archievement.id)) {
        this.setArchievementToUnknown(archievement);
      }else{
        archievement.image = this.filterNameArchievementImage(archievement.image);
        archievement.image = `${endpoints.urlImageArchievement}${archievement.image}`;
      }
    });
  }

  getArchievements() {
    this.archievementService.getArchievements().subscribe((archievements) => {
      this.archievements = archievements;
      this.representArchievements();
    });
  }

  isArchievementUnlock(archievement: Archievement) {
    return this.currentUser.archievements_id.includes(archievement.id);
  }

  setArchievementToUnknown(archievement: Archievement) {
    archievement.title = '????????';
    archievement.description = '????????????????????';
    archievement.image = '../../../assets/game/archievement/unknown.png'
  }

  filterNameArchievementImage(fullUrl: string): string {
    return fullUrl.replace('sites/default/files/2024-04/', '')?.replace('/', '') || '';
  }
}
