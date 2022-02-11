import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

constructor() { }

addDays(date: Date, days: number): Date{
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

formatDate(date: Date):string {
  let datePart = date.toISOString().split('T')[0];
  let timePart = date.toDateString().split('T')[1].substring(0,8);
  return datePart;
}

}


