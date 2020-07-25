import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { User } from '../auth/user';

import { AVATAR_UPDATE, USER_DETAILS } from '@shared/models/profile.model';

const routes = {
  UPDATE_USER: `/users/update`,
  GET_DETAILS: (id: number) => `/users/${id}`,
};

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Update the user avatar
   * @param {User} details
   * @returns {Observable<AVATAR_UPDATE>}
   * @memberof ProfileService
   */
  updateAvatar(details: AVATAR_UPDATE): Observable<Number> {
    return this.httpClient.put<Number>(routes.UPDATE_USER, details);
  }

  /**
   * Update user details
   * @param {USER_DETAILS} details
   * @returns {Observable<number>}
   * @memberof ProfileService
   */
  updateDetails(details: USER_DETAILS): Observable<Number> {
    return this.httpClient.put<Number>(routes.UPDATE_USER, details);
  }


  /**
   * Get user details by id
   * @param {number} id
   * @returns {Observable<USER_DETAILS>}
   * @memberof ProfileService
   */
  getUser(id: number): Observable<USER_DETAILS> {
    return this.httpClient.get<USER_DETAILS>(routes.GET_DETAILS(id));
  }
}
