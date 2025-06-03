import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plan } from 'src/app/models/plan.model';
import { PlanService } from 'src/app/services/plan.service';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

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

  constructor(
    private planService: PlanService,
    private taskService: TaskService,
    private router: Router
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
    this.planService.createPlan(this.plan).subscribe({
      next: () => this.router.navigate(['/plans'], {
        state: { refresh: true }
      }),
      error: (err) => console.error('Error creando plan', err)
    });
  }
}
