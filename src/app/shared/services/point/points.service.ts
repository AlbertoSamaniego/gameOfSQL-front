import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Point } from '../../interfaces/point.inteface';
import { Observable } from 'rxjs';
import { endpoints } from '../../constants/end-points';

/**
 * Servicio de gestión de puntos de interés.
 */
@Injectable({providedIn: 'root'})
export class PointsService {
  constructor( private http: HttpClient ) { }

  /**
   * Recupera todos los puntos de interés.
   * @returns Un Observable que emite una serie de objetos puntuales.
   */
  getPointsOfInterest(): Observable<Point[]> {
    return this.http.get<Point[]>(endpoints.pointsUrl);
  }

  /**
   * Recupera puntos de interés por nivel.
   * @param level - El nivel de los puntos a recuperar.
   * @returns Un Observable que emite una serie de objetos puntuales.
   */
  getPointsByLevel(level: number): Observable<Point[]> {
    return this.http.get<Point[]>(`${endpoints.pointsLevelUrl}${level}`);
  }

  /**
   * Recupera un punto de datos específico por su ID.
   * @param id - El ID del punto de datos que se va a recuperar.
   * @returns Un Observable que emite una serie de objetos puntuales.
   */
  getDataPoint(id: number): Observable<Point[]> {
    return this.http.get<Point[]>(`${endpoints.pointsUrl}${id}`);
  }
}
