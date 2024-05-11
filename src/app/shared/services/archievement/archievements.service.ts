import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoints } from '../../constants/end-points';
import { Archievement } from '../../interfaces/archievement.interface';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ArchievementService {
  constructor( private http: HttpClient ) { }

  getArchievements(): Observable<Archievement[]> {
    return this.http.get<Archievement[]>(endpoints.archievementsUrl);
  }

  getDataArchievement(id: number): Observable<Archievement[]> {
    return this.http.get<Archievement[]>(`${endpoints.archievementsUrl}${id}`);
  }

}
