import { User } from './../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  addUser(email: string, password: string): Observable<User> {
    const newUser = {
      type: [{ target_id: 'registered_user' }],
      field_email: [{ value: email }],
      field_password: [{ value: password }],
    };
    const params = { _format: 'json' };
    return this.http.post<User>(endpoints.addUserUrl, newUser, { params });
  }

  getDataRegisteredUser(email: string): Observable<User[]> {
    const cleanEmail = email.replace(/['"]+/g, '');
    const url = `${endpoints.loggedUser}${cleanEmail}`;

    return this.http.get<User[]>(url);
  }

  updateEmail(email: string, id: string): Observable<User> {
    const newUser = {
      field_email: [{ value: email }],
      type: [{ target_id: 'registered_user' }],
    };
    console.log(newUser);

    const params = { _format: 'json' };
    console.log(`${endpoints.updateUserUrl}/${id}`);

    return this.http.patch<User>(`${endpoints.updateUserUrl}/${id}`, newUser, { params });
  }

  updatePassword(password: string, id: string): Observable<User> {
    const newUser = {
      field_password: [{ value: password }],
      type: [{ target_id: 'registered_user' }],
    };
    const params = { _format: 'json' };
    return this.http.patch<User>(`${endpoints.updateUserUrl}/${id}`, newUser, { params });
  }

  deleteUser(id: string): Observable<User> {
    const params = { _format: 'json' };
    return this.http.delete<User>(`${endpoints.deleteUserUrl}/${id}`, { params });
  }

  rebootUser(id: string): Observable<User> {
    const newUser = {
      "field_character_name": [
        {
          "value": "Medger"
        }
      ],
      "field_character_nickname": [
        {
          "value": "El fuerte"
        }
      ],
      "field_house_name": [
        {
          "value": "Cerwyn"
        }
      ],
      "field_house_motto": [
        {
          "value": "Afilado y listo"
        }
      ],
      "field_archievements_unlock": [
        {
          "value": []
        }
      ],
      "field_shield": [
        {
          "value": "https://game-of-sql.ddev.site/themes/custom/game_of_sql/images/escudos/cerwyn.png"
        }
      ],
      "type": [
        {
          "target_id": "registered_user"
        }
      ]
    }
    const params = { _format: 'json' };
    return this.http.patch<User>(`${endpoints.rebootUserUrl}/${id}`, newUser, { params });
  }


}

