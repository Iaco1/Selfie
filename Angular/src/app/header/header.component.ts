import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router ) {}
  navigateToHomePage(){
    this.router.navigate(['/HomepageComponent']);
  }
  navigateToLoginComponent(){
    this.router.navigate(['/LoginComponent']);
  }
}
