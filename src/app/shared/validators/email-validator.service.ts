import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class EmailValidator implements AsyncValidator{

  private userRegitered = 'https://game-of-sql.ddev.site/es/api/users';
  //'https://game-of-sql.ddev.site/es/api/users?q=${email}';

  constructor(private http: HttpClient) { }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;
    return this.http.get<User[]>(this.userRegitered).pipe(map( resp => {
      return (resp.length === 0) ? null : { emailTaken: true };
    }));
  }

  
}
