import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {}

  ngOnInit() {
    this.platform.ready().then(() => {

      // Ajuste automático para moviles con notch
      if (this.platform.is('android')) {
        const statusBarHeight = (window as any).statusBarHeight || 0;
        document.documentElement.style.setProperty(
          '--ion-safe-area-top', 
          `${statusBarHeight > 0 ? statusBarHeight : 20}px`
        );
      }
    });
  }
}
