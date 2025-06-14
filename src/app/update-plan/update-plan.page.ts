import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/models/plan.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { PlanValidationService } from 'src/app/services/plan-validation.service';

@Component({
  selector: 'app-update-plan',
  templateUrl: './update-plan.page.html',
  styleUrls: ['./update-plan.page.scss'],
  standalone: false
})
export class UpdatePlanPage implements OnInit {
  plan: Plan = {
    id: '',
    title: '',
    description: '',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: '',
    taskIds: []
  }; // Plan que estamos editando

  userTasks: Task[] = []; // Tareas disponibles para asignar
  validationErrors: { title?: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanService,
    private taskService: TaskService,
    private validationService: PlanValidationService
  ) {}

  ngOnInit() {
    const planId = this.route.snapshot.paramMap.get('id');
    if (planId) {
      this.planService.getPlanById(planId).subscribe({
        next: (plan) => {
          this.plan = {
            ...plan,
            dueDate: plan.dueDate ? new Date(plan.dueDate).toISOString() : ''
          };
        },
        error: (err) => console.error('Error cargando plan', err)
      });
    }

    this.taskService.getUserTasks().subscribe({
      next: (tasks) => this.userTasks = tasks,
      error: (err) => console.error('Error cargando tareas del usuario', err)
    });
  }

  updatePlan() {
    // Validar los datos
    const validation = this.validationService.validatePlan(this.plan);
    this.validationErrors = validation.errors;

    if (validation.valid && this.plan.id) {
      // Preparamos los datos actualizados
      const planToUpdate: Plan = {
        ...this.plan,
        dueDate: this.plan.dueDate || undefined
      };

      // Enviamos al backend
      this.planService.updatePlan(this.plan.id, planToUpdate).subscribe({
        next: () => this.router.navigate(['/plans'], {
          state: { refresh: true }
        }),
        error: (err) => console.error('Error actualizando plan', err)
      });
    }
  }
}