import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Shield } from '../interfaces/shield.interface';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../constants/end-points';

@Injectable({providedIn: 'root'})
export class ShieldsService {
  constructor( private http: HttpClient ) { }

  getShields(premiumShields: string[]): Observable<Shield[]> {
    return this.http.get<Shield[]>(endpoints.shieldsUrl).pipe(
      map((shields) => {
        return shields.filter((shield) => {
          return shield.isPremium === '0' || premiumShields.includes(shield.id);
        });
      })
    );
  }

  getShieldById(id: string): Observable<Shield> {
    console.log(`${endpoints.shieldById}${id}`);
    console.log(this.http.get<Shield>(`${endpoints.shieldById}${id}`));


    return this.http.get<Shield>(`${endpoints.shieldById}${id}`);
  }
}
