import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterOutlet, Router} from '@angular/router';
import { AuthService } from '../auth.service';

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
  usernameInput =  new FormControl('');
  passwordInputControl = new FormControl('');
  loginGroup = new FormGroup({
    usernameInput: this.usernameInput, passwordInputControl: this.passwordInputControl
  })
  protected timeout: number = 2000;

  constructor(private router: Router, private authService: AuthService) {
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
    if(this.usernameInput == null || this.passwordInputControl == null){
      console.log("invalid form, null username or password");
    }else{
      this.authenticate( this.usernameInput.value!, this.passwordInputControl.value!);
    }
  }

  authenticate(username: string, password: string){
    let message: string = "<p>log in failed</p>\n";

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log("login result: ", response.message);

        if(response.status == 200){ //auth succeeded
          message = "<p>log in successful</p>\n";
          //wait timeout and redirect to the homepage
          setTimeout(()=>{
            this.router.navigate([{outlets: { header: 'HomeheaderComponent', primary: "HomepageComponent", footer: "TimemachineComponent"}}]);
          }, this.timeout);
          this.router.navigate(['/SuccessComponent'], {queryParams: {sm: message, timeout: this.timeout}});
        }else{ //auth failed
          // wait timeout and redirect to login
          setTimeout(()=>{
            this.router.navigate([{outlets: { header: 'HeaderComponent', primary: "LoginComponent"}}]);
          }, this.timeout);
          this.router.navigate(['/SuccessComponent'], {queryParams: {sm: message, timeout: this.timeout}});
        }
      },
      error: (error) => {
        console.log("login failed: ", error);
        setTimeout(()=>{
            this.router.navigate([{outlets: { header: 'HeaderComponent', primary: "LoginComponent"}}]);
          }, this.timeout);
          this.router.navigate(['/SuccessComponent'], {queryParams: {sm: message, timeout: this.timeout}});
      }
    })
  }
}
