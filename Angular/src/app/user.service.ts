import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  signup(email: string, username: string, password: string): Observable<any>{
    if(email === '' || username === '' || password === ''){
      return throwError(()=> new Error('All fields are required'));
    }
    return this.http.post(environment.baseURL + '/signup', {email, username, password});
  }

  getAccountDetails(authToken: string | null): Observable<any>{
    return this.http.get(environment.baseURL + `/user/${authToken}`);
  }
}
