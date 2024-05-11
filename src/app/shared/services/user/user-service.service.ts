import { User } from '../../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoints } from '../../constants/end-points';

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
    const params = { _format: 'json' };
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

  updateArchievements(id: string, archievements: string[]): Observable<User> {
    const newUser = {
      field_archievements_unlock: archievements ,
      type: [{ target_id: 'registered_user' }],
    };
    const params = { _format: 'json' };
    return this.http.patch<User>(`${endpoints.updateUserUrl}/${id}`, newUser, { params });
  }

  updatePremiumShields(id: string, premiumShields: string[]): Observable<User> {
    const newUser = {
      field_premium_shields: premiumShields,
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
          "target_id": "33"
        }
      ],
      "field_premium_shields":[
        {
          "value": []
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

  updateCharacter(user: User): Observable<User> {
    const newUser = {
      "field_character_name": [{ "value": `${user.character_name}` }],
      "field_character_nickname": [{ "value": `${user.character_nickname}` }],
      "field_house_name": [{ "value": `${user.house_name}` }],
      "field_house_motto": [{ "value": `${user.house_motto}` }],
      "field_shield": [{ "target_id": `${user.url_shield}` }],
      "type": [{ "target_id": 'registered_user' }],
    };
    const params = { _format: 'json' };
    return this.http.patch<User>(`${endpoints.updateUserUrl}/${user.user_id}`, newUser, { params });
  }

}

