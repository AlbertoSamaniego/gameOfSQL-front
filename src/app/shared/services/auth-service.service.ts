import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
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

  get getCurrentUser() {
    return this.user;
  }

  public setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

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
