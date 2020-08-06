import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menuOpened = false;
  title = 'Tablica ';
  menuButton;

  constructor(private el: ElementRef) {
    let menuButton = this.el.nativeElement.querySelector("menuToggle");
  }

  

  toggleMenu(){
    if(this.menuOpened){
      // Close menu
      this.menuOpened = false;
      this.menuButton.classList.remove('menuToggle-expanded');
      
    }else{
      // Open menu
      this.menuOpened = true;
      this.menuButton.classList.add('menuToggle-expanded');
    }
    
  }

}
