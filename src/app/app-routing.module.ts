import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachinesComponent } from './machines/machines.component';
import { MachineComponent } from './machine/machine.component';
import { LinePerformanceComponent } from './line-performance/line-performance.component';

const routes: Routes = [
  { path: 'machines', component: MachinesComponent},
  { path: 'lineperformance', component: LinePerformanceComponent, children: [
    { path: 'machine/:id', component: MachineComponent, outlet: 'main'}
  ]},
  { path: '', redirectTo: '/lineperformance', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
