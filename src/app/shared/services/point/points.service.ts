import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Point } from '../../interfaces/point.inteface';
import { Observable } from 'rxjs';
import { endpoints } from '../../constants/end-points';

@Injectable({providedIn: 'root'})
export class PointsService {
  constructor( private http: HttpClient ) { }

  getPointsOfInterest(): Observable<Point[]> {
    return this.http.get<Point[]>(endpoints.pointsUrl);
  }

  getPointsByLevel(level: number): Observable<Point[]> {
    return this.http.get<Point[]>(`${endpoints.pointsLevelUrl}${level}`);
  }

  getDataPoint(id: number): Observable<Point[]> {
    return this.http.get<Point[]>(`${endpoints.pointsUrl}${id}`);
  }


}
