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
import { PerformanceChartComponent } from './performance-chart/performance-chart.component';
import { ShiftViewComponent } from './shift-view/shift-view.component';
import { SpinnerService } from './services/spinner.service';
import { FormsComponent } from './forms/forms.component';
import { ModPickerComponent } from './mod-picker/mod-picker.component';
import { DividerComponent } from './divider/divider.component';
import { VirtualTrucksComponent } from './virtual-trucks/virtual-trucks.component';
import { ProductionPlanByCountryComponent } from './production-plan-by-country/production-plan-by-country.component';
import { NgApexchartsModule } from 'node_modules/ng-apexcharts';
import { VirtualTrucksChartComponent } from './virtual-trucks-chart/virtual-trucks-chart.component';
import { VirtualTruckItemsComponent } from './virtual-truck-items/virtual-truck-items.component';

@NgModule({
   declarations: [											
      AppComponent,
      MachinesComponent,
      LinePerformanceComponent,
      SpinnerComponent,
      MachineComponent,
      WelcomeComponent,
      ScanningItemsComponent,
      PerformanceChartComponent,
      ShiftViewComponent,
      FormsComponent,
      ModPickerComponent,
      DividerComponent,
      VirtualTrucksComponent,
      ProductionPlanByCountryComponent,
      VirtualTrucksChartComponent,
      VirtualTruckItemsComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MaterialModule,
      FormsModule,
      HttpClientModule,
      NgApexchartsModule
   ],
   providers: [ Settings, SpinnerService ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
