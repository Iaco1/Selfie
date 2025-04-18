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
  styleUrl: 'login.component.scss'
})
export class LoginComponent {
  emailInput =  new FormControl('', [Validators.required, Validators.email]);
  passwordInputControl = new FormControl('');
  loginGroup = new FormGroup({
    emailInput: this.emailInput, passwordInputControl: this.passwordInputControl
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
    let message: string = "<p>log in successful</p>\n";

    if(this.emailInput.invalid){
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
}
