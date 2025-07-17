import {Component, Input} from '@angular/core';
import {DatumType} from "./datumtype.enum";
import {NgOptimizedImage} from "@angular/common";
import {UserService} from '../services/user.service';


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
  @Input() datumDbName: string = "datumDbName";
  @Input() datum: string = "password345";
  @Input() datumName: string = "Password:::";
  datumEditorHidden = true;
  @Input() datumType: DatumType = DatumType.STRING;
  @Input() placeholderText: string = "somekindofpassword";

  constructor(private userService: UserService) {
  }

  toggleDatumEdit(){
    this.datumEditorHidden = !this.datumEditorHidden;
  }
  editDatum(newDatum: HTMLInputElement){
    this.userService.editField(newDatum, this.datumDbName);
    this.toggleDatumEdit();
    console.log("ran editDatum");
    console.log("datum " + this.datumType + " changed to: " +  newDatum.value);
  }

  protected readonly DatumType = DatumType;
}
