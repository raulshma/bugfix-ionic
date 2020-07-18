import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { Country } from '@shared/models/admin/countries.model';
import { Tech } from '@shared/models/admin/technologies.model';
import { Version_M, Version_M_SAVE } from '@shared/models/admin/versions.model';

const routes = {
  GET_ALL_COUNTRIES: '/countries',
  GET_ALL_TECHNOLOGIES: '/tech',
  GET_ALL_VERSIONS: '/versions',
  POST_VERSION: '/versions',
  PUT_VERSION: '/versions',
  DELETE_VERSION: (id: number) => `/versions/${id}`,
};

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  /**
   * Fetch all countries
   * @returns {Observable<Country[]>}
   * @memberof AdminService
   */
  getAllCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(routes.GET_ALL_COUNTRIES);
  }

  /**
   * Fetch all technologies
   * @returns {Observable<Tech[]>}
   * @memberof AdminService
   */
  getAllTechnologies(): Observable<Tech[]> {
    return this.http.get<Tech[]>(routes.GET_ALL_TECHNOLOGIES);
  }

  /**
   * Fetch all versions
   * @returns {Observable<Version_M[]>}
   * @memberof AdminService
   */
  getAllVersions(): Observable<Version_M[]> {
    return this.http.get<Version_M[]>(routes.GET_ALL_VERSIONS);
  }

  /**
   * Save version in db
   * @param {Version_M_SAVE} version
   * @returns {Observable<Version_M>}
   * @memberof AdminService
   */
  postVersion(version: Version_M_SAVE): Observable<Version_M> {
    return this.http.post<Version_M>(routes.POST_VERSION, version);
  }

  /**
   * Updates version in db
   * @param {Version_M_SAVE} version
   * @returns {Observable<number>}
   * @memberof AdminService
   */
  putVersion(version: Version_M_SAVE): Observable<number> {
    return this.http.put<number>(routes.PUT_VERSION, version);
  }

  /**
   * Deletes version in db using id
   * @param {number} id
   * @returns {Observable<number>}
   * @memberof AdminService
   */
  deleteVersion(id: number): Observable<number> {
    return this.http.delete<number>(routes.DELETE_VERSION(id));
  }
}
