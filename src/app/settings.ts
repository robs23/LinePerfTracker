import { Injectable } from '@angular/core';

@Injectable()
export class Settings {
  AutoUpdate: boolean = true;

  toggleAutoUpdate(): void{
      if(this.AutoUpdate){
          this.AutoUpdate = false;
      }else{
          this.AutoUpdate = true;
      }
  }
}