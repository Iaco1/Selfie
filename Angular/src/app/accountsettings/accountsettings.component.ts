import { Component } from '@angular/core';
import {DatumupdaterComponent} from '../datumupdater/datumupdater.component';
import {DatumType} from "../datumupdater/datumtype.enum";
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-accountsettings',
  imports: [
    DatumupdaterComponent,
  ],
  templateUrl: './accountsettings.component.html',
  styleUrl: './accountsettings.component.css'
})
export class AccountsettingsComponent {
  showModal: boolean = false;
  name: string = 'John Smith';
  birthday: Date = new Date(Date.now());
  email: string = 'something@domain.com';
  userPassword: string = 'password1234';
  username: string = 'default-username';

  usernameFieldName = 'Username';

  passwordFieldName: string = "Password:";

  userProfilePicStorageKey: string = "userProfilePic";
  userProfilePicUrl: string =  localStorage.getItem(this.userProfilePicStorageKey) || "/default-user-profile-pic.png";
  userProfilePicFieldName: string = "Profile Picture";


  constructor(private userService: UserService) {
    //value initialization for name, birthday, email fields
    this.setAccountDetails();
  }
  nameEditorHidden = true;
  birthdayEditorHidden = true;
  emailEditorHidden = true;

  editField(newDatum: HTMLInputElement, fieldName: string){
    this.userService.editField(newDatum, fieldName);
    this.setAccountDetails();
  }


  toggleNameEdit(){
    this.nameEditorHidden = !this.nameEditorHidden;
  }
  editName(newName: HTMLInputElement){
    this.editField(newName, 'name');
    this.toggleNameEdit();
  }

  toggleBirthdayEdit(){
    this.birthdayEditorHidden = !this.birthdayEditorHidden;
  }
  editBirthday(newDateInput: HTMLInputElement){
    this.editField(newDateInput, 'birthday');
    this.toggleBirthdayEdit();
  }

  toggleEmailEdit(){
    this.emailEditorHidden = !this.emailEditorHidden;
  }
  editEmail(newEmailInput: HTMLInputElement){
    this.editField(newEmailInput, 'email');
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
        this.name = user.name;
        this.birthday = new Date(user.birthday);
      },
      error: (err) => {
        console.log("get request failed: ", err);
      }
    })
  }

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
