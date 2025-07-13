import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes the service available throughout the application
})
export class AuthService {
  private baseUrl = 'http://localhost:4200/api'; // proxied then to the backend url, i.e. localhost:3002, to avoid cors policies blocks

  constructor(private http: HttpClient) {}

  // sends login credentials
  login(username: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`; // Full URL to the login endpoint
    const body = { username, password }; // Request payload

    return this.http.post(url, body, {
      withCredentials: true, // Required to send/receive cookies for sessions
    });
  }
}
