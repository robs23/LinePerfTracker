import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as secrets from '../secrets';
import { ScanningItem } from '../scanningItem';
import { catchError, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScanningItemService {

constructor(
  private http: HttpClient
) { }

getScanningItems(MachineId: number): Observable<ScanningItem[]>{
  console.log("ScanningItemService wystartował");
  return this.http.get<ScanningItem[]>(secrets.ApiAddress + 'GetRecentScans?MachineId=' + MachineId + '&EanType=2').pipe(catchError(err => of([])))
}
}
