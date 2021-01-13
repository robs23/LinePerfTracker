import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachinesComponent } from './machines/machines.component';
import { MachineComponent } from './machine/machine.component';
import { LinePerformanceComponent } from './line-performance/line-performance.component';
import { FormsComponent } from './forms/forms.component';
import { ModPickerComponent } from './mod-picker/mod-picker.component';
import { DividerComponent } from './divider/divider.component';

const routes: Routes = [
  { path: '', component: ModPickerComponent},
  { path: 'machines', component: MachinesComponent},
  { path: 'forms', component: FormsComponent},
  { path: 'divider/:week/:year', component: DividerComponent},
  { path: 'divider', component: DividerComponent},
  { 
    path: 'linePerformance', 
    component: LinePerformanceComponent,
    children: [
      { path: 'machine/:id', component: MachineComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
