import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Bug } from '@shared/models/admin/bugs.model';

const routes = {
  GET_BUG: (id: number) => `/bugs/${id}/?related_data=1`,
  GET_ALL_BUGS: '/bugs/?related_data=2',
  POST_BUG: '/bugs',
  PUT_BUG: '/bugs',
  DELETE_BUG: (id: number) => `/bugs/${id}`,
};

@Injectable({
  providedIn: 'root',
})
export class BugsService {
  constructor(private httpClient: HttpClient) {}


  /**
   * Get bug by id
   * @param {number} id
   * @returns {Observable<Bug>}
   * @memberof BugsService
   */
  get(id: number): Observable<Bug> {
    return this.httpClient.get<Bug>(routes.GET_BUG(id));
  }


  /**
   * Get all bugs
   * @returns {Observable<Bug[]>}
   * @memberof BugsService
   */
  getAll(): Observable<Bug[]> {
    return this.httpClient.get<Bug[]>(routes.GET_ALL_BUGS);
  }


  /**
   * Save a bug
   * @param {Bug} bug
   * @returns {Observable<Bug>}
   * @memberof BugsService
   */
  post(bug: Bug): Observable<Bug> {
    return this.httpClient.post<Bug>(routes.POST_BUG, bug);
  }


  /**
   * Delete a bug by id
   * @param {number} id
   * @returns {Observable<Bug>}
   * @memberof BugsService
   */
  delete(id: number): Observable<Bug> {
    return this.httpClient.delete<Bug>(routes.DELETE_BUG(id));
  }


  /**
   * Update a bug
   * @param {Bug} bug
   * @returns {Observable<Bug>}
   * @memberof BugsService
   */
  update(bug: Bug): Observable<Bug> {
    return this.httpClient.put<Bug>(routes.PUT_BUG, bug);
  }
}