import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanValidationService {

  validateTitle(title: string): boolean {
    return title.trim().length >= 3;
  }

  validatePlan(plan: any): { valid: boolean, errors: { title?: string } } {
    const errors: { title?: string } = {};
    let valid = true;

    if (!this.validateTitle(plan.title)) {
      errors.title = 'El título debe tener al menos 3 caracteres';
      valid = false;
    }

    return { valid, errors };
  }
}