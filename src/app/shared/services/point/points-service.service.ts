import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PointsService } from './points.service';
import { Point } from '../../interfaces/point.inteface';

@Injectable({
  providedIn: 'root'
})
export class PointService {
  private currentPointSubject: BehaviorSubject<Point | null>;
  private currentPoint!: Point;

  constructor(private pointsService: PointsService) {
    this.currentPointSubject = new BehaviorSubject<Point | null>(null);
  }

  /**
   * Obtenga el punto actual.
   * @returns El punto actual.
   */
  get getCurrentPoint() {
    return this.currentPoint;
  }

  /**
   * Establezca el punto actual.
   * @param point - El punto a establecer como punto actual.
   */
  public setCurrentPoint(point: Point | null): void {
    this.currentPointSubject.next(point);
  }

  /**
   * Consigue un punto por su ID.
   * @param id - El ID del punto a recuperar.
   * @returns Una promesa que se resuelve en el punto recuperado, o nula si no se encuentra.
   */
  public async getPointById(id: string): Promise<Point | null> {
    return new Promise<Point | null>((resolve, reject) => {
      this.pointsService.getDataPoint(parseInt(id)).subscribe({
        next: (value: Point[]) => {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              this.currentPoint = value[0];
              this.setCurrentPoint(value[0]);
              resolve(value[0]);
            } else {
              resolve(null);
            }
          } else {
            this.currentPoint = value;
            this.setCurrentPoint(value);
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
