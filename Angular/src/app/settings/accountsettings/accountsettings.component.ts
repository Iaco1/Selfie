import { Component } from '@angular/core';
import {DatumupdaterComponent} from '../datumupdater/datumupdater.component';
import {DatumType} from "../datumupdater/datumtype.enum";
import {UserService} from '../../services/user.service';

/**
 * Component that displays a user's account settings and lets them modify: Person's name, birthday, username, email and password. And also lets them delete their account.
 */
@Component({
  selector: 'app-accountsettings',
  imports: [
    DatumupdaterComponent,
  ],
  templateUrl: './accountsettings.component.html',
  styleUrl: './accountsettings.component.css'
})
export class AccountsettingsComponent {

  // variables to hide/show components on the page conditionally
  showModal: boolean = false;
  nameEditorHidden = true;
  birthdayEditorHidden = true;
  emailEditorHidden = true;

  //data to be displayed on the page
  name: string = 'John Smith';
  birthday: Date = new Date(Date.now());
  email: string = 'something@domain.com';
  userPassword: string = 'password1234';
  username: string = 'default-username';

  //text to show on left hand side of the data displaying section. used for data displayed in component DatumUpdater.
  usernameFieldName = 'Username';
  passwordFieldName: string = "Password:";

  // data to display locally saved profile picture using DatumUpdater
  userProfilePicStorageKey: string = "userProfilePic";
  userProfilePicUrl: string =  localStorage.getItem(this.userProfilePicStorageKey) || "/default-user-profile-pic.png";
  userProfilePicFieldName: string = "Profile Picture";


  constructor(private userService: UserService) {
    //value initialization for name, birthday, email fields
    this.setAccountDetails();
  }


  /**
   * wrapper for the homonymous UserService method to update a user field on mongodb
   * @param newDatum HTMLInputElement containing the data to update on mongodb
   * @param fieldName name of the field to update on mongodb
   */
  editField(newDatum: HTMLInputElement, fieldName: string){
    this.userService.editField(newDatum, fieldName);
    this.setAccountDetails();
  }

  /**
   * hides/shows the name editor field
   */
  toggleNameEdit(){
    this.nameEditorHidden = !this.nameEditorHidden;
  }

  /**
   * triggers the update of the person's name field for the user and hides the form used to insert the new name
   */
  editName(newName: HTMLInputElement){
    this.editField(newName, 'name');
    this.toggleNameEdit();
  }

  /**
   * hides/shows the birthday editor field
   */
  toggleBirthdayEdit(){
    this.birthdayEditorHidden = !this.birthdayEditorHidden;
  }

  /**
   * triggers the update of the birthday field for the user and hides the form used to insert the new birthday
   */
  editBirthday(newDateInput: HTMLInputElement){
    this.editField(newDateInput, 'birthday');
    this.toggleBirthdayEdit();
  }

  /**
   * hides/shows the email editor form
   */
  toggleEmailEdit(){
    this.emailEditorHidden = !this.emailEditorHidden;
  }

  /**
   * triggers the update of the email field for the user and hides the form used to insert the new email
   */
  editEmail(newEmailInput: HTMLInputElement){
    this.editField(newEmailInput, 'email');
    this.toggleEmailEdit();
  }

  /**
   * calls the user service to get the user information to display on the page
   */
  setAccountDetails(){
    console.log("authToken: ", localStorage.getItem("authToken"));
    this.userService.getAccountDetails(localStorage.getItem("authToken")).subscribe({
      next: (res) => {
        const user = res.user;
        this.username = user.username;
        this.userPassword = user.password;
        this.email = user.email;
        this.name = user.name;
        this.birthday = new Date(user.birthday);
      },
      error: (err) => {
        console.log("get request failed: ", err);
      }
    })
  }

  /**
   * calls the user service to perform the deletion on the database
   */
  deleteAccount(){
    this.userService.deleteAccount(localStorage.getItem("authToken")).subscribe({
      next: (res) => {
        this.userService.logout();
      },
      error: (err) => {
        console.log("delete request failed: ", err);
      }
    });
  }

  protected readonly DatumType = DatumType;
}
