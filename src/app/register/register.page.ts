import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { FormValidationService } from '../services/form-validation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  passwordVisibility = {
    password1: false,
    password2: false
  };
  isPasswordValid = false;
  emailAlreadyRegistered = false;

  private auth;

  constructor(
    private router: Router,
    public formValidation: FormValidationService,
    private authService: AuthService
  ) {
    const app = initializeApp(environment.firebase);
    this.auth = getAuth(app);
  }

  togglePasswordVisibility(field: 'password1' | 'password2') {
    this.passwordVisibility[field] = !this.passwordVisibility[field];
  }

  onPasswordChange() {
  this.isPasswordValid = this.formValidation.validatePassword(this.password);
}

   // Valida si el formulario es correcto
  isFormValid(): boolean {
    return (
      this.formValidation.validateUsername(this.username) &&
      this.formValidation.validateEmail(this.email) &&
      this.formValidation.validatePassword(this.password) &&
      this.formValidation.validatePasswordMatch(this.password, this.confirmPassword)
    );
  }

  register() {
    this.emailAlreadyRegistered = false; // Resetear antes de intentar registro

    if (!this.isFormValid()) {
      alert('Revisa los campos antes de continuar');
      return;
    }

    this.authService.register(this.email, this.password, this.username)
    .then(() => {
      alert('Cuenta creada con éxito');
      this.router.navigateByUrl('/login');
    })
    .catch((error: any) => {
      if (error.code === 'auth/email-already-in-use') {
        this.emailAlreadyRegistered = true;
      } else {
        alert('Error: ' + error.message);
      }
    });
  }


  goBack() {
    this.router.navigateByUrl('/login');
  }
}
