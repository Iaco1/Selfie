import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homeheader',
  imports: [],
  templateUrl: './homeheader.component.html',
  styleUrl: './homeheader.component.css'
})
export class HomeheaderComponent {
  constructor(private router: Router ) {}
  openSidebar(){
    this.router.navigate([{outlets: { header: "HomeheaderComponent", primary: "HomepageComponent", aside: 'SidebarComponent'}}]);
    console.log("openSideBar ran");
  }
}
