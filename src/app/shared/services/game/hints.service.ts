import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hint } from '../../interfaces/hint.interface';
import { endpoints } from '../../constants/end-points';

/**
 * Servicio para recuperar pistas relacionadas con el juego.
 */
@Injectable({providedIn: 'root'})
export class HintsService {
  constructor( private http: HttpClient ) { }

  /**
   * Recupera una serie de sugerencias.
   * @returns Un Observable que emite una serie de objetos Hint.
   */
  getHints(): Observable<Hint[]> {
    return this.http.get<Hint[]>(`${endpoints.hintsUrl}`);
  }
}
