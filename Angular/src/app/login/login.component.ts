import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  emailInput= new FormControl('');
  togglePasswordVisibility(passwordInput: HTMLInputElement, eyeIcon: HTMLElement){
    if(passwordInput.type === 'password'){
      passwordInput.type = 'text'; //this will show the password
      //changing icoon
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    }else{ //it's either gonna be password or text, only this method modifies it so far
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }
}
