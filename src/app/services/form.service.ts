import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '../interfaces/form';
import { Observable } from 'rxjs';
import * as secrets from '../secrets';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private http: HttpClient
  ) { }

  getForms(): Observable<Form[]>{
    return this.http.get<Form[]>(secrets.ApiAddress + 'GetForms');
  }

  getForm(id: number): Observable<Form>{
    return this.http.get<Form>(secrets.ApiAddress + 'GetForm?Id=' + id);
  }

}
