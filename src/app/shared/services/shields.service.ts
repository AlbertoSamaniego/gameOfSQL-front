import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shield } from '../interfaces/shield.interface';
import { HttpClient } from '@angular/common/http';
import { endpoints } from '../constants/end-points';

@Injectable({providedIn: 'root'})
export class ShieldsService {
  constructor( private http: HttpClient ) { }
  //get shields
  getShields(): Observable<Shield[]> {
    return this.http.get<Shield[]>(endpoints.shieldsUrl);
  }
}
