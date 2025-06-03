import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage {

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  // cerrar sesión
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
      
      // limpar el localstorage
      localStorage.removeItem('authToken');
      
      // redirigir al login
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}