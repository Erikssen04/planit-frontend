import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskValidationService {

  validateTitle(title: string): boolean {
    return title.trim().length >= 3;
  }

  validatePriority(priority: string): boolean {
    return ['alta', 'media', 'baja'].includes(priority);
  }

  validateTask(task: any): { valid: boolean, errors: { title?: string, priority?: string } } {
    const errors: { title?: string, priority?: string } = {};
    let valid = true;

    if (!this.validateTitle(task.title)) {
      errors.title = 'El título debe tener al menos 3 caracteres';
      valid = false;
    }

    if (!this.validatePriority(task.priority)) {
      errors.priority = 'Selecciona una prioridad válida';
      valid = false;
    }

    return { valid, errors };
  }
}