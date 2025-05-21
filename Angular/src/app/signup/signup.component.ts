import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  loginComponentHelper = new LoginComponent(new Router());

  constructor(private router: Router) {
  }
  protected timeout: number = 2000;
  emailInputControl = new FormControl('', [Validators.required, Validators.email]);
  passwordInputControl = new FormControl('');
  usernameInputControl = new FormControl('');

  signupGroup = new FormGroup({
    emailInputControl: this.emailInputControl, passwordInputControl: this.passwordInputControl, usernameInputControl: this.usernameInputControl
  })
  onSubmit(){
    let message: string = "<p>signup successful</p>\n";
    //console.log(this.signupGroup.controls['emailInputControl'].value);
    if(this.emailInputControl.invalid){
      console.log("invalid form");
    }else{
      console.log("valid form");
      setTimeout(()=>{
        this.router.navigate(["/HomepageComponent"]);
      }, this.timeout);
      this.router.navigate(['/SuccessComponent'], {queryParams: {sm: message, timeout: this.timeout}});
    }
    return
  }
}
