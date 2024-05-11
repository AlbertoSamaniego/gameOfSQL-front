import { Injectable } from '@angular/core';
import { ArchievementService } from './archievements.service';
import { BehaviorSubject } from 'rxjs';
import { Archievement } from '../../interfaces/archievement.interface';

@Injectable({providedIn: 'root'})
export class ArchievementsService {
  private currentAchievementSubject: BehaviorSubject<Archievement | null>;
  private currentAchievement!: Archievement;

  constructor( private archievementService: ArchievementService ) {
    this.currentAchievementSubject = new BehaviorSubject<Archievement | null>(null);
  }

  get getArchievement() {
    return this.currentAchievement;
  }

  public setCurrentArchievement(archievement: Archievement | null): void {
    this.currentAchievementSubject.next(archievement);
  }

  getArchievementById(id: string):  Promise<Archievement | null> {
    return new Promise<Archievement | null>((resolve, reject) => {
      this.archievementService.getDataArchievement(parseInt(id)).subscribe({
        next: (value: Archievement[]) => {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              this.currentAchievement = value[0];
              this.setCurrentArchievement(value[0]);
              resolve(value[0]);
            } else {
              resolve(null);
            }
          } else {
            this.currentAchievement = value;
            this.setCurrentArchievement(value);
            resolve(value);
          }
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

}
