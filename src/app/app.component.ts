import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bhakari_UI';

  constructor(){
    localStorage.setItem('isloged','false');
  }
}
