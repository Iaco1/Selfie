import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  constructor(private route: ActivatedRoute) {
  }

  successMessage: string = "<br>\n" +
    "<p>you'll be automatically redirected in 5s</p>";

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.successMessage = params['sm'] + "\n" + this.successMessage;
    })
  }

}
