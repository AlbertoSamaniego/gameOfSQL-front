import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { endpoints } from '../../constants/end-points';
import { Archievement } from '../../interfaces/archievement.interface';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
/**
 * Servicio de recuperación de datos de archivo.
 */
export class ArchievementService {
  constructor(private http: HttpClient) { }

  /**
   * Recupera todos los logros.
   * @returns Un array observable de logro.
   */
  getArchievements(): Observable<Archievement[]> {
    return this.http.get<Archievement[]>(endpoints.archievementsUrl);
  }

  /**
   * Recupera datos para un logro específico.
   * @param id - El ID del logro.
   * @returns Un array observable de logro.
   */
  getDataArchievement(id: number): Observable<Archievement[]> {
    return this.http.get<Archievement[]>(`${endpoints.archievementsUrl}${id}`);
  }
}
