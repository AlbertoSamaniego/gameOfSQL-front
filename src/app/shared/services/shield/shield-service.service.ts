import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Shield } from '../../interfaces/shield.interface';
import { ShieldsService } from './shields.service';

@Injectable({providedIn: 'root'})
export class ShieldService {

  private currentShieldSubject: BehaviorSubject<Shield | null>;
  private currentShield!: Shield;

  constructor( private shieldService: ShieldsService ) {
    this.currentShieldSubject = new BehaviorSubject<Shield | null>(null);
  }

  /**
   * Consigue el escudo actual.
   */
  get getShield() {
    return this.currentShield;
  }

  /**
   * Establece el escudo actual.
   * @param shield - El escudo que se establecerá como escudo actual.
   */
  public setCurrentArchievement(shield: Shield | null): void {
    this.currentShieldSubject.next(shield);
  }

  /**
   * Consigue un escudo por su ID.
   * @param id - El ID del escudo a recuperar.
   * @returns Una promesa que se resuelve con el escudo, o nula si no se encuentra.
   */
  getShieldById(id: string):  Promise<Shield | null> {
    return new Promise<Shield | null>((resolve, reject) => {
      this.shieldService.getShieldById(id).subscribe({
        next: (value: Shield) => {
          if(Array.isArray(value)){
            if(value.length > 0){
              this.currentShield = value[0];
              this.setCurrentArchievement(value[0]);
              resolve(value[0]);
            } else {
              resolve(null);
            }
          } else {
            this.currentShield = value;
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
