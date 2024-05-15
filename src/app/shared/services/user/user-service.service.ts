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

  /**
   * Recupera una lista de usuarios.
   * @returns Un Observable que emite una matriz de objetos de Usuario.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(endpoints.regiteredUsersUrl);
  }

  /**
   * Agrega un nuevo usuario.
   * @param email: el correo electrónico del usuario.
   * @param contraseña: la contraseña del usuario.
   * @returns Un Observable que emite el objeto Usuario recién creado.
   */
  addUser(email: string, password: string): Observable<User> {
    const newUser = {
      type: [{ target_id: 'registered_user' }],
      field_email: [{ value: email }],
      field_password: [{ value: password }],
    };
    const params = { _format: 'json' };
    return this.http.post<User>(endpoints.addUserUrl, newUser, { params });
  }

  /**
   * Recupera datos de un usuario registrado por correo electrónico.
   * @param email: el correo electrónico del usuario.
   * @returns Un Observable que emite una matriz de objetos de Usuario.
   */
  getDataRegisteredUser(email: string): Observable<User[]> {
    const cleanEmail = email.replace(/['"]+/g, '');
    const url = `${endpoints.loggedUser}${cleanEmail}`;

    return this.http.get<User[]>(url);
  }

  /**
   * Actualiza el correo electrónico de un usuario.
   * Correo electrónico @param: el nuevo correo electrónico.
   * @param id: el ID del usuario.
   * @returns Un Observable que emite el objeto Usuario actualizado.
   */
  updateEmail(email: string, id: string): Observable<User> {
    const newUser = {
      field_email: [{ value: email }],
      type: [{ target_id: 'registered_user' }],
    };
    const params = { _format: 'json' };
    return this.http.patch<User>(`${endpoints.updateUserUrl}/${id}`, newUser, { params });
  }

  /**
   * Actualiza la contraseña de un usuario.
   * @param contraseña: la nueva contraseña.
   * @param id: el ID del usuario.
   * @returns Un Observable que emite el objeto Usuario actualizado.
   */
  updatePassword(password: string, id: string): Observable<User> {
    const newUser = {
      field_password: [{ value: password }],
      type: [{ target_id: 'registered_user' }],
    };
    const params = { _format: 'json' };
    return this.http.patch<User>(`${endpoints.updateUserUrl}/${id}`, newUser, { params });
  }

  /**
   * Actualiza los logros de un usuario.
   * @param id: el ID del usuario.
   * @param archiements: una variedad de logros para actualizar.
   * @returns Un Observable que emite el objeto Usuario actualizado.
   */
  updateArchievements(id: string, archievements: string[]): Observable<User> {
    const newUser = {
      field_archievements_unlock: archievements ,
      type: [{ target_id: 'registered_user' }],
    };
    const params = { _format: 'json' };
    return this.http.patch<User>(`${endpoints.updateUserUrl}/${id}`, newUser, { params });
  }

  /**
   * Actualiza los escudos premium de un usuario.
   * @param id: el ID del usuario.
   * @param premiumShields: una variedad de escudos premium para actualizar.
   * @returns Un Observable que emite el objeto Usuario actualizado.
   */
  updatePremiumShields(id: string, premiumShields: string[]): Observable<User> {
    const newUser = {
      field_premium_shields: premiumShields,
      type: [{ target_id: 'registered_user' }],
    };
    const params = { _format: 'json' };
    return this.http.patch<User>(`${endpoints.updateUserUrl}/${id}`, newUser, { params });
  }

  /**
   * Elimina un usuario.
   * @param id: el ID del usuario que se va a eliminar.
   * @returns Un Observable que emite el objeto Usuario eliminado.
   */
  deleteUser(id: string): Observable<User> {
    const params = { _format: 'json' };
    return this.http.delete<User>(`${endpoints.deleteUserUrl}/${id}`, { params });
  }

  /**
   * Reinicia los datos de un usuario.
   * @param id: el ID del usuario que se va a reiniciar.
   * @returns Un Observable que emite el objeto Usuario actualizado.
   */
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

  /**
   * Actualiza los datos del personaje de un usuario.
   * @param usuario: el objeto Usuario que contiene los datos de caracteres actualizados.
   * @returns Un Observable que emite el objeto Usuario actualizado.
   */
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
