import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { AlertController } from '@ionic/angular';
import { sendPasswordResetEmail } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  isPasswordVisible = false;
  isLoading = false;

  constructor(private router: Router, private alertController: AlertController) {}

  // Intento de inicio de sesión
  async login() {
    if (!this.email || !this.password) return;

    this.isLoading = true;

    try {

      // Autenticación con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);

      // Obtenemos el token JWT
      const token = await userCredential.user.getIdToken();
      console.log('TOKEN:', token);

      // Guardamos el token para futuras peticiones
      localStorage.setItem('authToken', token);

      this.router.navigateByUrl('/home');
    } catch (error: any) {
      alert('Error al iniciar sesión: ' + error.message);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

   // Recuperación de contraseña
  async forgotPassword() {

    // Mostramos alerta para ingresar email
    const ionAlert = await this.alertController.create({
      header: 'Recuperar contraseña',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Tu correo electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            const email = data.email;
            if (!email) {
              window.alert('Por favor ingresa un correo válido.');
              return false;
            }

            try {
              // envío de correo para resetear la contraseña
              await sendPasswordResetEmail(auth, email);
              window.alert('Se ha enviado un enlace de recuperación a tu correo.');
            } catch (error: any) {
              window.alert('Error: ' + error.message);
            }

            return true;
          }
        }
      ]
  });

  await ionAlert.present();
}

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}
