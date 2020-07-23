import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../auth/user';

const routes = {
  UPDATE_AVATAR: `/users/update/avatar`,
};

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private httpClient: HttpClient) {}


  /**
   * Update the profile avatar
   * @param {User} profile
   * @returns {Observable<User>}
   * @memberof ProfileService
   */
  updateAvatar(profile: User): Observable<User> {
    return this.httpClient.put<User>(routes.UPDATE_AVATAR, profile);
  }
}
