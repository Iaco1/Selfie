import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  constructor(private route: ActivatedRoute, private timeout: number = 2000) {
  }

  successMessage: string = "";

  ngOnInit() {
    this.successMessage = "<br>\n" +
    "<p>you'll be automatically redirected in " + this.timeout +  "</p>";

    this.route.queryParams.subscribe((params) => {
      this.successMessage = params['sm'] + "\n" + this.successMessage;
      this.timeout = params['timeout'];
    })
  }

}
