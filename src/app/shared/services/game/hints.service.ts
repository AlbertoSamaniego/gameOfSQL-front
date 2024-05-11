import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hint } from '../../interfaces/hint.interface';
import { endpoints } from '../../constants/end-points';

@Injectable({providedIn: 'root'})
export class HintsService {
  constructor( private http: HttpClient ) { }

  getHints(): Observable<Hint[]> {
    return this.http.get<Hint[]>(`${endpoints.hintsUrl}`);
  }

}
