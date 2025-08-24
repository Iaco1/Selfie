import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

/**
 * displays a success/failure message.
 */
@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  private timeout: number = 1000;
  constructor(private route: ActivatedRoute ) {
  }

  successMessage: string = "";

  /**
   * sets the text of the component
   */
  ngOnInit() {
    this.successMessage = "<br>\n" +
    "<p>you'll be automatically redirected in " + this.timeout/1000 +  "s </p>";

    this.route.queryParams.subscribe((params) => {
      this.successMessage = params['sm'] + "\n" + this.successMessage;
      this.timeout = params['timeout'];
    })
  }

}
