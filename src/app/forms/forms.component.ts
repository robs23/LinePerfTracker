import { Component, OnInit } from '@angular/core';
import { Form } from '../interfaces/form';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  forms: Form[];
  columnNames: string[] = ['Name', 'Link', 'CreatedOn', 'Description'];
  constructor(private formService: FormService) { }

  ngOnInit(): void {
    this.getForms();
  }

  getForms(): void{
    this.formService.getForms().subscribe(response => this.forms = response);
  }

}
