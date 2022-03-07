import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';

const MaterialComponents = [
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatTableModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatTabsModule,
  MatDialogModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]


})

export class MaterialModule { }
