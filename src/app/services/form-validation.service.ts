import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FormValidationService {

    validateUsername(username: string): boolean {
        return username.trim().length >= 3;
    }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  isFormValid(email: string, password: string, confirmPassword: string): boolean {
    return (
      this.validateEmail(email) &&
      this.validatePassword(password) &&
      this.validatePasswordMatch(password, confirmPassword)
    );
  }
}
