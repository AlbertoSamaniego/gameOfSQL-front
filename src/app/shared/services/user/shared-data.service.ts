import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user.interface';


/**
 * Servicio de gestión de datos compartidos relacionados con el usuario actual.
 */
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {}

  /**
   * Establece el usuario actual.
   * @param usuario El objeto de usuario que se establecerá como usuario actual.
   */
  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  /**
   * Establece el usuario actual.
   * @param usuario El objeto de usuario que se establecerá como usuario actual.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
