import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent implements OnInit {
  isMobile: boolean = true;

  constructor(private platform: Platform) {}

  ngOnInit() {
    this.isMobile = this.platform.is('mobile') || this.platform.is('mobileweb');
  }
}
