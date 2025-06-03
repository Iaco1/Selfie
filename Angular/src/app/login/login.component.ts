import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterOutlet, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet
  ],
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.css'
})
export class LoginComponent {
  usernameInput =  new FormControl('', [Validators.required]);
  passwordInputControl = new FormControl('');
  loginGroup = new FormGroup({
    usernameInput: this.usernameInput, passwordInputControl: this.passwordInputControl
  })
  protected timeout: number = 2000;

  constructor(private router: Router) {
  }

  togglePasswordVisibility(passwordInputTag: HTMLInputElement, eyeIcon: HTMLElement){
    if(passwordInputTag.type === 'password'){
      passwordInputTag.type = 'text'; //this will show the password
      //changing icoon
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
    }else{ //it's either gonna be password or text, only this method modifies it so far
      passwordInputTag.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
    }
  }

  onSubmit(){
    //this.testdbquery(this.usernameInput.value, this.passwordInputControl.value, "davideiacomino");

    let message: string = "<p>log in successful</p>\n";

    if(this.usernameInput.invalid){
      console.log("invalid form");
    }else{
      console.log("form valid")
      setTimeout(()=>{
        this.router.navigate([{outlets: { header: 'HomeheaderComponent', primary: "HomepageComponent"}}]);
      }, this.timeout);
      this.router.navigate(['/SuccessComponent'], {queryParams: {sm: message, timeout: this.timeout}});
    }
    return
  }
/*
  testdbquery(email: string | null, password: string | null, username: string| null){
    if(!email || !password || !username ){
      console.log("one of the inputs (email, password, username) are null, undefined, false, 0, `` or NaN");
      return;
    }

    this.authService.http.post('/users/login', {
      email: email,
      password: password,
    }).subscribe({
      next: res => {
        console.log('Logged in:', res);
      },
      error: err => {
        console.error('Login failed:', err);
      }
    });

  }*/
}
