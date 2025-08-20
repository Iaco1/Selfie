import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * service to authenticate users given one of the following:
 * - credentials: usr, pwd
 * - authToken: mongodb id of the user
 */
@Injectable({
  providedIn: 'root', // Makes the service available throughout the application
})
export class AuthService {
  private authUrl = environment.baseURL + '/auth'; // proxied then to the backend url, i.e. localhost:3002, to avoid cors policies blocks

  constructor(private http: HttpClient) {}

  authenticate(username: string, password: string): Observable<any>;
  authenticate(authToken: string): Observable<any>;

  /**
   * posts authentication credentials to the backend
   * @param arg1 username (with two args) or authToken (one arg)
   * @param arg2 password
   */
  authenticate(arg1: string, arg2?: string): Observable<any> {
    let body;

    if(arg2) body = { username: arg1, password: arg2 }
    else body = { authToken: arg1 };

    return this.http.post(this.authUrl, body, {
      withCredentials: true, // Required to send/receive cookies for sessions
    });
  }
}
