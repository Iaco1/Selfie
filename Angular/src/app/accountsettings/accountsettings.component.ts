import { Component } from '@angular/core';
import {DatumupdaterComponent} from '../datumupdater/datumupdater.component';
import {DatumType} from "../datumupdater/datumtype.enum";
import {UserService} from '../user.service';

@Component({
  selector: 'app-accountsettings',
  imports: [
    DatumupdaterComponent,
  ],
  templateUrl: './accountsettings.component.html',
  styleUrl: './accountsettings.component.css'
})
export class AccountsettingsComponent {
  name: string;
  birthday: Date;
  email: string;

  usernameStorageKey = 'username';
  username: string = localStorage.getItem(this.usernameStorageKey) || 'default-username';
  usernameFieldName = 'Username';

  passwordStorageKey: string = 'password';
  userPassword: string = localStorage.getItem(this.passwordStorageKey) || "password1234";
  passwordFieldName: string = "Password:";

  userProfilePicStorageKey: string = "userProfilePic";
  userProfilePicUrl: string =  localStorage.getItem(this.userProfilePicStorageKey) || "/default-user-profile-pic.png";
  userProfilePicFieldName: string = "Profile Picture";


  constructor(private userService: UserService) {
    //value initialization for name, birthday, email fields
    this.name = localStorage.getItem('name') || 'John Smith';
    this.birthday = new Date(localStorage.getItem('date') || Date.now());
    this.email = localStorage.getItem('email') || 'something@domain.com';
    this.setAccountDetails();
  }
  nameEditorHidden = true;
  birthdayEditorHidden = true;
  emailEditorHidden = true;


  toggleNameEdit(){
    this.nameEditorHidden = !this.nameEditorHidden;
    this.setAccountDetails();
  }
  editName(newName: HTMLInputElement){
    localStorage.setItem('name', newName.value);
    this.name = newName.value;
    this.toggleNameEdit();
  }

  toggleBirthdayEdit(){
    this.birthdayEditorHidden = !this.birthdayEditorHidden;
  }
  editBirthday(newDateInput: HTMLInputElement){
    localStorage.setItem('date', newDateInput.value);
    this.birthday = new Date(newDateInput.value);
    this.toggleBirthdayEdit();
  }

  toggleEmailEdit(){
    this.emailEditorHidden = !this.emailEditorHidden;
  }
  editEmail(newEmailInput: HTMLInputElement){
    localStorage.setItem('email', newEmailInput.value);
    this.email = newEmailInput.value;
    this.toggleEmailEdit();
  }

  setAccountDetails(){
    console.log("authToken: ", localStorage.getItem("authToken"));
    this.userService.getAccountDetails(localStorage.getItem("authToken")).subscribe({
      next: (res) => {
        const user = res.user;
        this.username = user.username;
        this.userPassword = user.password;
        this.email = user.email;
      },
      error: (err) => {
        console.log("get request failed: ", err);
      }
    })
  }

  protected readonly DatumType = DatumType;
}
