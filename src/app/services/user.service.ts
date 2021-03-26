import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const BASE_URL = environment.BASE_URL;
declare const gapi: any;
@Injectable({
  providedIn: 'root'
})
export class UserService {

  public auth2: any;

  constructor(private http: HttpClient, 
              private router: Router,
              private ngZone: NgZone,
              ) {
    this.googleInit();
  }


  signUp( formData: RegisterForm){
    return this.http.post(`${ BASE_URL }/user`, formData)
               .pipe(
                tap(( resp: any ) => {
                  localStorage.setItem('token', resp.token);
                }));
  }

  signIn(formData: LoginForm){
    return this.http.post(`${ BASE_URL }/login`, formData)
               .pipe(
                 tap(( resp: any ) => {
                   localStorage.setItem('token', resp.token);
                 }));
  }


  googleInit(){
    return new Promise(resolve => {
      gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '77121684616-jnmm4otihdmjvgmgdjl750dhqpo633qb.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      resolve();
      });
    });
  }

  signInWithGoogle(token){
    console.log(token);
    return this.http.post(`${ BASE_URL }/login/google`, { token })
               .pipe(
                 tap(( resp: any ) => {
                   localStorage.setItem('token', resp.token);
                 }));
  }

  validateToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${ BASE_URL }/login/updateToken`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true ),
      catchError(err => of(false))
    );
  }

  logOut(){
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }


}
