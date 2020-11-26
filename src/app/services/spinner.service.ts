import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

constructor(private router: Router, private dialog: MatDialog) { }

start(message?): MatDialogRef<SpinnerComponent> {
  console.log("Spinner wystartował");
  const dialogRef = this.dialog.open(SpinnerComponent,
    {
      data: message == ''|| message == undefined ? "Pracuję.. Proszę czekać.." : message
  });
  console.log("Spinner zwraca stronę");
  return dialogRef;
};

stop(ref:MatDialogRef<SpinnerComponent>){
  console.log("Serwis zatrzymany");
  ref.close();
}

}
