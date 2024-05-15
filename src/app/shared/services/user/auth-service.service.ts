import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  private user!: User;

  constructor(private userService: UserService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
  }

  /**
   * Obtener el usuario actual.
   * @returns El usuario actual.
   */
  get getCurrentUser() {
    return this.user;
  }

  /**
   * Establecer el usuario actual.
   * @param user - El usuario a establecer como el usuario actual.
   */
  public setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Consigue un usuario por correo electrónico.
   * @param email: el correo electrónico del usuario a recuperar.
   * @returns Una promesa que se resuelve con el usuario si se encuentra, o nula si no se encuentra.
   */
  public async getUserByEmail(email: string): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      this.userService.getDataRegisteredUser(email).subscribe({
        next: (userData: User[]) => {
          if (userData.length > 0) {
            this.user = userData[0];
            this.setCurrentUser(userData[0]);
            resolve(userData[0]);
          } else {
            resolve(null);
          }
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  }

}
