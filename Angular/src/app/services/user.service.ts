import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, username: string, password: string): Observable<any>{
    if(email === '' || username === '' || password === ''){
      return throwError(()=> new Error('All fields are required'));
    }
    return this.http.post(environment.baseURL + '/signup', {email, username, password});
  }

  getAccountDetails(authToken: string | null): Observable<any>{
    return this.http.get(environment.baseURL + `/user/${authToken}`);
  }

  logout(){
    this.router.navigate([{ outlets: { header: 'HeaderComponent', asideLeft: null, primary: null, asideRight: null, footer: null }}]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('saveStateUrl');
  }

  deleteAccount(authToken: string | null): Observable<any>{
    return this.http.delete(environment.baseURL + `/user/${authToken}`);
  }

  update(authToken: string | null, user: any): Observable<any>{
    return this.http.put(environment.baseURL + `/user/${authToken}`, user);
  }

  editField(newDatum: HTMLInputElement, fieldName: string): any{
    this.update(localStorage.getItem("authToken"), {[fieldName]: newDatum.value}).subscribe({
      next: (res) => {
        if(res.status == 200){
          console.log(`${fieldName} updated successfully`);
          if(fieldName === 'password') this.logout();
        }else{
          console.log("name update failed");
          console.log("response: ", res);
        }
        return res;
      }, error: (err) => {
        console.log("error: ", err);
        return JSON.stringify({
          status: 500,
          message: "Error updating name"
        });
      }
    })
  }

}
