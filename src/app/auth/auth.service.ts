import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';
import { User } from './user';
import { AuthResponse } from './auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authSubject = new BehaviorSubject(false);
  constructor(private httpClient: HttpClient, private storage: Storage) {}

  register(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`/auth/signup`, user).pipe(
      tap((res: AuthResponse) => {
        if (res.user) {
          this.storage.set('ACCESS_TOKEN', res.token);
          this.storage.set('EXPIRES_IN', res.expiresAt);
          this.storage.set('USER', res.user);
          this.authSubject.next(true);
        }
      })
    );
  }

  login(user: User): Observable<AuthResponse> {
    return this.httpClient.post(`/auth/signin`, user).pipe(
      tap((res: AuthResponse) => {
        if (res.user) {
          this.storage.set('ACCESS_TOKEN', res.token);
          this.storage.set('EXPIRES_IN', res.expiresAt);
          this.storage.set('USER', res.user);
          this.authSubject.next(true);
        }
      })
    );
  }

  async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.remove('EXPIRES_IN');
    this.authSubject.next(false);
  }

  refreshLogin() {
    this.authSubject.next(true);
  }
  
  isLoggedIn() {
    return this.authSubject.value;
  }
}
