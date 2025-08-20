import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

/**
 * CRUDs for the user on the database and some utilities
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) { }

  /**
   * posts a request to the backend to insert a new user into the database
   */
  signup(email: string, username: string, password: string): Observable<any>{
    if(email === '' || username === '' || password === ''){
      return throwError(()=> new Error('All fields are required'));
    }
    return this.http.post(environment.baseURL + '/signup', {email, username, password});
  }

  /**
   * sends a get request to the backend to find a user with the specified authToken
   * @param authToken the mongodb `_id` associated to the entry in the users collection
   */
  getAccountDetails(authToken: string | null): Observable<any>{
    return this.http.get(environment.baseURL + `/user/${authToken}`);
  }

  /**
   * navigates back to the home screen before logging in,
   * deletes the saved authToken
   *  (used to authenticate the user to the backend for other operations that handle their data)
   * and then deletes the saveStateUrl (used to preserve the view when reloading the page)
   */
  logout(){
    this.router.navigate([{ outlets: { header: 'HeaderComponent', asideLeft: null, primary: null, asideRight: null, footer: null }}]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('saveStateUrl');
  }

  /**
   * sends a delete request to the backend to delete a user from the database
   * @param authToken
   */
  deleteAccount(authToken: string | null): Observable<any>{
    return this.http.delete(environment.baseURL + `/user/${authToken}`);
  }

  /**
   * sends a put request to the backend to update a user in the database
   * @param authToken `_id` to find the user in the database
   * @param user object containing the fields to update (also possibly a complete new user)
   */
  update(authToken: string | null, user: any): Observable<any>{
    return this.http.put(environment.baseURL + `/user/${authToken}`, user);
  }

  /**
   * sends a request to the backend to update a single field of a user on the database.
   *
   * Initially written for DatumUpdaterComponent and later moved here
   * @param newDatum
   * @param fieldName
   */
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
