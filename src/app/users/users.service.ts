import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { data, login, signup, success, user } from './users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_NAME = 'auth-token';
  isLoggedIn = this._isLoggedIn.asObservable();
  user!: user;

  get token(): any {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  constructor(private http: HttpClient) {
    this._isLoggedIn.next(!!this.token);
    console.log(this.token);
    this.user = this.getCurrentUser();
  }

  login(login: login): Observable<data> {
    return this.http
      .post<data>(environment.API_URL + '/users/login', login)
      .pipe(
        tap((res: data) => {
          if (res.success) {
            this._isLoggedIn.next(true);
            localStorage.setItem(this.TOKEN_NAME, JSON.stringify(res.data));
            this.user = this.getCurrentUser();
          }
        })
      );
  }

  logout() {
    this._isLoggedIn.next(false);
    localStorage.removeItem(this.TOKEN_NAME);

    window.location.reload();
  }

  signup(signup: signup): Observable<success> {
    return this.http.post<success>(environment.API_URL + '/users/add', signup);
  }

  getCurrentUser() {
    return JSON.parse(this.token);
  }

  getUser(id: number): Observable<user> {
    return this.http.get<user>(environment.API_URL + '/users/' + id);
  }
}
