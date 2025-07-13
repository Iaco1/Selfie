import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {VisualeffectsService} from '../visualeffects.service';
import {UserService} from '../user.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private router: Router, protected visualeffectsService: VisualeffectsService, private userService: UserService) {
  }
  protected timeout: number = environment.timeout;
  emailInputControl = new FormControl('');
  passwordInputControl = new FormControl('');
  usernameInputControl = new FormControl('');

  signupGroup = new FormGroup({
    emailInputControl: this.emailInputControl, passwordInputControl: this.passwordInputControl, usernameInputControl: this.usernameInputControl
  })

  insertNewUserInDB(email: string, password: string, username: string){
    let message: string = "<p>signup failed</p>\n";
    this.userService.signup(email, username, password).subscribe({
      next: (response) => {
        console.log("signup result: ", response.message);

        if(response.status == 200){
          message = "<p>signup successful, you can now log in with your credentials</p>\n";

          setTimeout(()=>{
            this.router.navigate([{outlets: { header: 'HeaderComponent', primary: "LoginComponent"}}]);
          }, this.timeout);
          this.router.navigate(['/SuccessComponent'], {queryParams: {sm: message, timeout: this.timeout}});
        }else{
          setTimeout(()=>{
            this.router.navigate([{outlets: { header: 'HeaderComponent', primary: "SignupComponent"}}]);
          }, this.timeout)
          this.router.navigate(['/SuccessComponent'], {queryParams: {sm: message, timeout: this.timeout}});
        }
      }
    })
  }


  onSubmit(){
    if(this.usernameInputControl == null || this.emailInputControl == null || this.passwordInputControl == null){
      console.log("invalid form, null username or password");
    }else{
      this.insertNewUserInDB(this.emailInputControl.value!, this.passwordInputControl.value!, this.usernameInputControl.value!)
    }
  }
}
