import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

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

  constructor(private router: Router ) {}

  openSidebar(){
    this.router.navigate([{outlets: { header: "HomeheaderComponent", aside: 'SidebarComponent'}}]);
    console.log("openSideBar ran");
  }

  closeSidebar(){
    this.router.navigate([{outlets: {aside: null}}]);
    console.log("closeSideBar ran");
  }

  onToggleSidebar(){
    //console.log("onToggleSidebar");
    this.sidebarIsToggled = !this.sidebarIsToggled;
    if(!this.sidebarIsToggled){
      this.closeSidebar();
    }else{
      this.openSidebar();
    }
  }

  navigateToHomepage(){
    console.log("navigateToHomepage ran");
    this.router.navigate([{outlets: {header: "HomeheaderComponent", primary: "HomepageComponent"}}]);
  }
}
