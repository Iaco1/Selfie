import { Component } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
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
