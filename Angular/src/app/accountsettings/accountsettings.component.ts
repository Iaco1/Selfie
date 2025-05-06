import { Component } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-accountsettings',
  imports: [
    NgIf
  ],
  templateUrl: './accountsettings.component.html',
  styleUrl: './accountsettings.component.css'
})
export class AccountsettingsComponent {
  name: string;
  birthday: Date;

  constructor() {
    this.name = localStorage.getItem('name') || 'John Smith';
    this.birthday = new Date(localStorage.getItem('date') || Date.now());
    this.email = localStorage.getItem('email') || 'something@domain.com';
  }
  nameEditorHidden = true;
  birthdayEditorHidden = true;
  emailEditorHidden = true;


  toggleNameEdit(){
    this.nameEditorHidden = !this.nameEditorHidden;
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
}
