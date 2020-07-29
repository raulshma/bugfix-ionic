import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Bug } from '@shared/models/admin/bugs.model';
import { Fix, VOTES_POST } from '@shared/models/fix.model';

const routes = {
  GET_BUG: (id: number) => `/bugs/${id}/?related_data=1`,
  GET_ALL_BUGS: '/bugs/?related_data=2',
  POST_BUG: '/bugs',
  POST_FIX: '/fixes',
  PUT_BUG: '/bugs',
  PUT_FIX: '/fixes',
  DELETE_BUG: (id: number) => `/bugs/${id}`,
  DELETE_FIX: (id: number) => `/fixes/${id}`,
  POST_FIX_VOTES: `/votes/fix`,
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

  /**
   * Save a Fix
   * @param {Fix} fix
   * @returns {Observable<Fix>}
   * @memberof BugsService
   */
  postFix(fix: Fix): Observable<Fix> {
    return this.httpClient.post<Fix>(routes.POST_FIX, fix);
  }

  /**
   * Update a bug
   * @param {Fix} bug
   * @returns {Observable<Fix>}
   * @memberof BugsService
   */
  updateFix(fix: Fix): Observable<Fix> {
    return this.httpClient.put<Fix>(routes.PUT_FIX, fix);
  }

  /**
   * Delete a fix by id
   * @param {number} id
   * @returns {Observable<Fix>}
   * @memberof BugsService
   */
  deleteFix(id: number): Observable<Fix> {
    return this.httpClient.delete<Fix>(routes.DELETE_FIX(id));
  }

  /**
   * Upvote and downvote fix
   * @param {VOTES_POST} data
   * @returns {Observable<Number>}
   * @memberof BugsService
   */
  updownVotesFix(data: VOTES_POST): Observable<Number> {
    return this.httpClient.post<Number>(routes.POST_FIX_VOTES, data);
  }
}
