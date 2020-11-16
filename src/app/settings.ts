import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class Settings {
  AutoUpdate: boolean = true;
  TabSwitch: boolean = true;
}