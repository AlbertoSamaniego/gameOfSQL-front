import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Shield } from '../../interfaces/shield.interface';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../../constants/end-points';

@Injectable({providedIn: 'root'})
export class ShieldsService {
  constructor( private http: HttpClient ) { }

  /**
   * Recupera los escudos según la matriz de escudos premium.
   * @param premiumShields - Conjunto de identificaciones de escudo premium
   * @returns Observable de matriz de escudo
   */
  getShields(premiumShields: string[]): Observable<Shield[]> {
    return this.http.get<Shield[]>(endpoints.shieldsUrl).pipe(
      map((shields) => {
        return shields.filter((shield) => {
          return shield.isPremium === '0' || premiumShields.includes(shield.id);
        });
      })
    );
  }

  /**
   * Recupera un escudo por tu id.
   * @param id - id del escudo
   * @returns Observable de escudo
   */
  getShieldById(id: string): Observable<Shield> {
    return this.http.get<Shield>(`${endpoints.shieldById}${id}`);
  }
}
