import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DividerItem } from '../interfaces/divider-item';
import * as secrets from '../secrets';

@Injectable({
  providedIn: 'root'
})
export class DividerService {

  constructor(
    private http: HttpClient
  ) { }

  getDivider(week: number, year: number): Observable<DividerItem[]>{
    return this.http.get<DividerItem[]>(secrets.ApiAddress + 'GetDivider?week=' + week + "&year=" + year);
  }

  getDividerItem(week: number, year: number, product: number): Observable<DividerItem>{
    return this.http.get<DividerItem>(secrets.ApiAddress + 'GetDivider?week=' + week + "&year=" + year + "&product=" + product);
  }

}
