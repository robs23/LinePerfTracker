import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as secrets from '../secrets';
import { ScanningItem } from '../scanningItem';

@Injectable({
  providedIn: 'root'
})
export class ScanningItemService {

constructor(
  private http: HttpClient
) { }

getScanningItems(MachineId: number): Observable<ScanningItem[]>{
  return this.http.get<ScanningItem[]>(secrets.ApiAddress + 'GetRecentScans?MachineId=' + MachineId + '&EanType=2');
}
}
