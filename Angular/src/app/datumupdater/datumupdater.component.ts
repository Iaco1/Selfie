import {Component, Input} from '@angular/core';
import {DatumType} from "./datumtype.enum";
import {NgOptimizedImage} from "@angular/common";

/*export const DATUM_STORAGE_KEY = new InjectionToken<string>('DatumStorageKey');
export const DATUM_NAME = new InjectionToken<string>('DatumName');
export const DATUM = new InjectionToken<string>('Datum');*/


@Component({
  selector: 'app-datumupdater',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './datumupdater.component.html',
  styleUrl: './datumupdater.component.css',
  standalone: true,
  /*providers: [
    {provide: DATUM_STORAGE_KEY, useValue: 'password'},
    {provide: DATUM_NAME, useValue: 'Password::'},
    {provide: DATUM, useValue: 'password'}
  ]*/
})
export class DatumupdaterComponent {
  @Input() datum: string = "password345";
  @Input() datumName: string = "Password:::";
  datumEditorHidden = true;
  @Input() datumStorageKey: string = "password";
  @Input() datumType: DatumType = DatumType.STRING;
  @Input() placeholderText: string = "somekindofpassword";

  constructor(/*@Inject(DATUM_STORAGE_KEY) datumStorageKey: string, @Inject(DATUM_NAME) datumName: string, @Inject(DATUM) datum: string*/) {
    //this.datumStorageKey = datumStorageKey;
    this.datum = localStorage.getItem(this.datumStorageKey) || this.datum;
    /*console.log("this.datum: " + this.datumType + " was loaded to " + this.datum);
    console.log("datum: " + this.datum);
    console.log("localstorage: " + localStorage.getItem(this.datumStorageKey));*/
    //this.datumName = datumName;
  }

  toggleDatumEdit(){
    this.datumEditorHidden = !this.datumEditorHidden;
  }
  editDatum(newDatum: HTMLInputElement){
    localStorage.setItem(this.datumStorageKey, newDatum.value);
    this.datum = newDatum.value;
    this.toggleDatumEdit();
    console.log("ran editDatum");
    console.log("datum " + this.datumType + " changed to: " +  localStorage.getItem(this.datumStorageKey));
  }

  protected readonly DatumType = DatumType;
}
