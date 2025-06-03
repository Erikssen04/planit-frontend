import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';
import { Plan } from '../models/plan.model';
import { PlanService } from '../services/plan.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
  standalone: false
})
export class CreateTaskPage {
  task: Task = {
    title: '',
    description: '',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: '',
    priority: '',
    planId: null
  };
  userPlans: Plan[] = [];

  constructor(
    private taskService: TaskService,
    private planService: PlanService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadUserPlans();
  }

  // Al entrar se obtiene la lista de planes para poder asignarles la tarea
  loadUserPlans() {
    this.planService.getUserPlans().subscribe({
      next: (plans) => this.userPlans = plans,
      error: (err) => console.error('Error cargando planes', err)
    });
  }

  // Crear tarea y refrescarla al entrar a home
  createTask() {
    const taskToCreate: Task = {
      ...this.task,
      createdAt: new Date().toISOString()
    };
    this.taskService.createTask(this.task).subscribe({
      next: () => this.router.navigate(['/home'], {
        state: { refresh: true }
    }),
      error: (err) => console.error('Error creando tarea', err),
    });
  }
}
