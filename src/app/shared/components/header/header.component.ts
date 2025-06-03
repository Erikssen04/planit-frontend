import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { getAuth, signOut } from 'firebase/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  showBackButton: boolean = false;
  safeAreaTop: string = '0px';
  isMobile: boolean = true; // Por defecto asumimos móvil

  constructor(
    private location: Location,
    private router: Router,
    private platform: Platform,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    
    // Detecta si estamos en web o móvil
    this.isMobile = this.platform.is('mobile') || this.platform.is('mobileweb');
    
    this.checkCurrentRoute();
    this.router.events.subscribe(() => {
      this.checkCurrentRoute();
    });
  }

  private checkCurrentRoute() {
    const currentRoute = this.router.url;
    this.showBackButton = !(currentRoute === '/home' || currentRoute === '/');
  }

  goBack() {
    this.location.back();
  }
  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, salir',
          handler: () => {
            this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private async performLogout() {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem('authToken');
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}