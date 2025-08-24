import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

/**
 * header to be displayed when the user logged in
 */
@Component({
  selector: 'app-homeheader',
  imports: [
    FormsModule
  ],
  templateUrl: './homeheader.component.html',
  styleUrl: './homeheader.component.css'
})
export class HomeheaderComponent {
  sidebarIsToggled = false;
  navbarMenuOpen = false;

  constructor(private router: Router ) {}

  // navigation methods
  openSidebar(){
    this.router.navigate([{outlets: { header: "HomeheaderComponent", asideLeft: 'SidebarComponent'}}]);
    console.log("openSideBar ran");
  }
  closeSidebar(){
    this.router.navigate([{outlets: {asideLeft: null}}]);
    console.log("closeSideBar ran");
  }
  navigateToHomepage(){
    console.log("navigateToHomepage ran");
    this.router.navigate([{outlets: {header: "HomeheaderComponent", primary: "HomepageComponent"}}]);
  }

  // button interactivity logic
  onToggleSidebar(){
    //console.log("onToggleSidebar");
    this.sidebarIsToggled = !this.sidebarIsToggled;
    if(!this.sidebarIsToggled){
      this.closeSidebar();
    }else{
      this.openSidebar();
    }
  }
  toggleNavbarBurger(navbarBurger: HTMLAnchorElement){
    if (navbarBurger.classList.contains('is-active')) {
      navbarBurger.classList.remove('is-active');
    }else{
      navbarBurger.classList.add('is-active');
    }
    this.navbarMenuOpen = !this.navbarMenuOpen;
  }
}
