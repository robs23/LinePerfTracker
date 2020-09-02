import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MachinesComponent } from './machines/machines.component';
import { LinePerformanceComponent } from './line-performance/line-performance.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { MachineComponent } from './machine/machine.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { ScanningItemsComponent } from './scanningItems/scanningItems.component';
import { Settings } from './settings';

@NgModule({
   declarations: [	
      AppComponent,
      MachinesComponent,
      LinePerformanceComponent,
      SpinnerComponent,
      MachineComponent,
      WelcomeComponent,
      ScanningItemsComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MaterialModule,
      FormsModule,
      HttpClientModule
   ],
   providers: [ Settings ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
