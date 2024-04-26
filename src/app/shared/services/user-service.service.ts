import { User } from './../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../constants/end-points';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(endpoints.regiteredUsersUrl);
  }

  addUser(email: string, password: string): Observable<User>{
    const newUser = {
      type: [{target_id: 'registered_user'}],
      field_email: [{value: email}],
      field_password: [{value: password}],
    };
    const params = { _format: 'json'};
    return this.http.post<User>(endpoints.addUserUrl, newUser, { params });
  }

  getDataRegisteredUser(email: string): Observable<User[]> {
    const cleanEmail = email.replace(/['"]+/g, '');
    const url = `${endpoints.loggedUser}${cleanEmail}`;

    return this.http.get<User[]>(url);
  }


}

