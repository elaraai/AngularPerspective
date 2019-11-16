import { Component, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@HostListener('window:resize', ['$event'])
export class AppComponent {
  title = 'AngularPerspective';
  sourceName = "5dcfa7f11c53092b9cb5c503"
  sourceUrl = "ws://localhost:8123"
  environment = environment
  width = window.innerWidth
  height = window.innerHeight

  public onResize(event) {
    this.width = window.innerWidth
    this.height = window.innerHeight
  }
}
