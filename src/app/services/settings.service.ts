import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SettingsComponent } from '../settings/settings.component';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

constructor(private dialog: MatDialog) { }

openSettingsPage(): MatDialogRef<SettingsComponent> {
  const dialogRef = this.dialog.open(SettingsComponent,
    {
      
  });
  return dialogRef;
};

closeSettingsPage(ref:MatDialogRef<SettingsComponent>){
  ref.close();
}

}
