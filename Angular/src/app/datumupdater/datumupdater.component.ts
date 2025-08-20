import {Component, Input} from '@angular/core';
import {DatumType} from "./datumtype.enum";
import {NgOptimizedImage} from "@angular/common";
import {UserService} from '../services/user.service';

/**
 * generic component to display a piece of data and post an update to the backend
 */
@Component({
  selector: 'app-datumupdater',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './datumupdater.component.html',
  styleUrl: './datumupdater.component.css',
  standalone: true,
})

export class DatumupdaterComponent {
  //data needed by this component from the template using this component
  @Input() datumDbName: string = "datumDbName";
  @Input() datum: string = "password345";
  @Input() datumName: string = "Password:::";
  @Input() datumType: DatumType = DatumType.STRING;
  @Input() placeholderText: string = "somekindofpassword";

  // variable to hide/show the editor form to update the data
  datumEditorHidden = true;

  constructor(private userService: UserService) {
  }

  /**
   * triggers hiding/showing the form to update the data
   */
  toggleDatumEdit(){
    this.datumEditorHidden = !this.datumEditorHidden;
  }

  /**
   * posts the updated data to the backend and hides the editor form
   * @param newDatum
   */
  editDatum(newDatum: HTMLInputElement){
    this.userService.editField(newDatum, this.datumDbName);
    this.toggleDatumEdit();
    console.log("ran editDatum");
    console.log("datum " + this.datumType + " changed to: " +  newDatum.value);
  }

  protected readonly DatumType = DatumType;
}
