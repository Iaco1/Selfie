import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisualeffectsService {

  constructor() { }

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
}
