import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plan } from 'src/app/models/plan.model';
import { PlanService } from 'src/app/services/plan.service';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { PlanValidationService } from 'src/app/services/plan-validation.service';


@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.page.html',
  styleUrls: ['./create-plan.page.scss'],
  standalone: false
})
export class CreatePlanPage implements OnInit {
  plan: Plan = {
    title: '',
    description: '',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: '',
    taskIds: []
  };

  userTasks: Task[] = [];
  validationErrors: { title?: string } = {};


  constructor(
    private planService: PlanService,
    private taskService: TaskService,
    private router: Router,
    private validationService: PlanValidationService

  ) {}

  // Al entrar se obtiene la lista de tareas
  ngOnInit() {
    this.taskService.getUserTasks().subscribe({
      next: (tasks) => this.userTasks = tasks,
      error: (err) => console.error('Error cargando tareas del usuario', err)
    });
  }

  // Crear plan y refrescarlo en plans directamente
  createPlan() {
    const validation = this.validationService.validatePlan(this.plan);
    this.validationErrors = validation.errors;

    
    if (validation.valid) {
      this.planService.createPlan(this.plan).subscribe({
        next: () => this.router.navigate(['/plans'], {
          state: { refresh: true }
        }),
        error: (err) => console.error('Error creando plan', err)
      });
    }
  }
}
