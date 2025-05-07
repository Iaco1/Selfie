import {Component, Inject, InjectionToken, Input} from '@angular/core';
export const DATUM_STORAGE_KEY = new InjectionToken<string>('DatumStorageKey');
export const DATUM_NAME = new InjectionToken<string>('DatumName');
export const DATUM = new InjectionToken<string>('Datum');

@Component({
  selector: 'app-datumupdater',
  imports: [],
  templateUrl: './datumupdater.component.html',
  styleUrl: './datumupdater.component.css',
  standalone: true,
  providers: [
    {provide: DATUM_STORAGE_KEY, useValue: 'password'},
    {provide: DATUM_NAME, useValue: 'Password::'},
    {provide: DATUM, useValue: 'password'}
  ]
})
export class DatumupdaterComponent {
  @Input() datum: string = "password345";
  @Input() datumName: string = "Password::";
  datumEditorHidden = true;
  @Input() datumStorageKey: string = "password";

  constructor(@Inject(DATUM_STORAGE_KEY) datumStorageKey: string, @Inject(DATUM_NAME) datumName: string, @Inject(DATUM) datum: string) {
    this.datumStorageKey = datumStorageKey;
    this.datum = localStorage.getItem(datumStorageKey) || datum;
    console.log("this.datum: " + this.datum);
    console.log("datum: " + datum);
    console.log("localstorage: " + localStorage.getItem(datumStorageKey));
    this.datumName = datumName;
  }

  toggleDatumEdit(){
    this.datumEditorHidden = !this.datumEditorHidden;
  }
  editDatum(newDatum: HTMLInputElement){
    localStorage.setItem(this.datumStorageKey, newDatum.value);
    this.datum = newDatum.value;
    this.toggleDatumEdit();
    console.log("ran editDatum");
    console.log(localStorage.getItem(this.datumStorageKey));
  }

}
