import { Component, OnInit } from '@angular/core';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword, updateProfile, User, deleteUser } from 'firebase/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service'; // Asumiendo que tenemos un servicio para usuarios

@Component({
  selector: 'app-change-data',
  templateUrl: './change-data.page.html',
  styleUrls: ['./change-data.page.scss'],
  standalone: false
})
export class ChangeDataPage implements OnInit {
  username: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmNewPassword: boolean = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    const auth = getAuth();
    this.currentUser = auth.currentUser;
    if (this.currentUser) {
      this.username = this.currentUser.displayName || '';
    }
  }

  async updateData() {
    if (!this.currentUser) {
      alert('No hay usuario autenticado');
      return;
    }

    // Validar que las nuevas contraseñas coincidan
    if (this.newPassword !== this.confirmNewPassword) {
      alert('Las nuevas contraseñas no coinciden');
      return;
    }

    try {
      // Reautenticar al usuario
      const credential = EmailAuthProvider.credential(this.currentUser.email!, this.currentPassword);
      await reauthenticateWithCredential(this.currentUser, credential);
      
      // Actualizar la contraseña si se proporcionó una nueva
      if (this.newPassword) {
        await updatePassword(this.currentUser, this.newPassword);
      }

      // Actualizar el nombre de usuario en Firebase y en el bckend
      if (this.username !== this.currentUser.displayName) {
        await updateProfile(this.currentUser, { displayName: this.username });

        // Actualizar en el backend
        await this.userService.updateUsername(this.currentUser.uid, this.username).toPromise();
      }

      alert('Datos actualizados correctamente');
      this.router.navigate(['/home']);
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  async confirmDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Eliminar cuenta',
      message: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible. Tendrás 10 segundos para confirmar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            // No permitimos que se elimine inmediatamente, sino que mostramos otra alerta con cuenta regresiva, para mas seguridad
            this.presentDeleteCountdown();
          }
        }
      ]
    });

    await alert.present();
  }

  //Advertencia con cuenta regresiva
  async presentDeleteCountdown() {
    let seconds = 10;
    const alert = await this.alertController.create({
      header: 'Eliminar cuenta',
      message: `La cuenta se eliminará en ${seconds} segundos. ¿Estás seguro?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteAccount();
          }
        }
      ]
    });

    await alert.present();

    const interval = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        clearInterval(interval);
        alert.dismiss();
      } else {
        alert.message = `La cuenta se eliminará en ${seconds} segundos. ¿Estás seguro?`;
      }
    }, 1000);
  }

  async deleteAccount() {
    if (!this.currentUser) {
      this.showAlert('Error', 'No hay usuario autenticado');
      return;
    }

    try {
      // Se verifica que se haya proporcionado la contraseña actual por seguridad
      if (!this.currentPassword) {
        this.showAlert('Error', 'Debes ingresar tu contraseña actual para eliminar la cuenta');
        return;
      }

      // Reautenticación con email y contraseña
      const credential = EmailAuthProvider.credential(
        this.currentUser.email!, 
        this.currentPassword
      );
      
      await reauthenticateWithCredential(this.currentUser, credential);
      
      // Se elimina el usuario del backend primero
      await this.userService.deleteCurrentUser().toPromise();

      // Posteriormente se elimina el mismo de Firebase
      await deleteUser(this.currentUser);

      // Limpiar estado y redirigir
      localStorage.removeItem('authToken');
      this.showAlert('Éxito', 'Cuenta eliminada correctamente');
      this.router.navigate(['/login'], { replaceUrl: true });
      
    } catch (error: any) {
      console.error('Error al eliminar cuenta:', error);

      if (error.code === 'auth/invalid-credential') {
        this.showAlert('Error', 'La contraseña actual es incorrecta');
      } else if (error.code === 'auth/requires-recent-login') {
        this.showAlert('Error', 'Debes iniciar sesión nuevamente para realizar esta acción');
      } else {
        this.showAlert('Error', 'Ocurrió un problema al eliminar la cuenta: ' + error.message);
      }
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}