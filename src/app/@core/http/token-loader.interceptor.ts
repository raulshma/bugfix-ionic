import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  tap,
  flatMap,
  finalize,
} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { Storage } from '@ionic/storage';

@Injectable()
export class HttpTokenLoadingInterceptor implements HttpInterceptor {
  constructor(
    public loadingController: LoadingController,
    private storage: Storage
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.storage.get('ACCESS_TOKEN')).pipe(
      switchMap((token) => {
        if (token) {
          request = request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + token),
          });
        }

        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json'),
          });
        }
        if (request.url.match(/\/fixes\/vote\w+/)) return next.handle(request);
        return from(this.loadingController.create()).pipe(
          tap((loading) => {
            return loading.present();
          }),
          switchMap((loading) => {
            return next.handle(request).pipe(
              finalize(() => {
                loading.dismiss();
              }),
              catchError((error: HttpErrorResponse) => {
                console.error(error);
                this.loadingController.dismiss();
                return throwError(error);
              })
            );
          })
        );
        // this.showLoader();
        // return next.handle(request).pipe(
        //   map((event: HttpEvent<any>) => {
        //     // if (event instanceof HttpResponse) {
        //     //   console.log('event--->>>', event);
        //     // }
        //     return event;
        //   }),
        //   catchError((error: HttpErrorResponse) => {
        //     console.error(error);
        //     this.hideLoader();
        //     return throwError(error);
        //   })
        // );
      })
    );
  }
}
