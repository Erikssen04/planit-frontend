import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { Plan } from '../models/plan.model';
import { PlanService } from '../services/plan.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.page.html',
  styleUrls: ['./update-task.page.scss'],
  standalone: false
})
export class UpdateTaskPage implements OnInit {
  task: Task = {
    id: '',
    title: '',
    description: '',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: '',
    priority: '',
    planId: null
  }; // Tarea que estamos editando

  userPlans: Plan[] = []; // Planes disponibles para asignar

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private planService: PlanService
  ) {}

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {

      // Cargamos la tarea a editar
      this.taskService.getTaskById(taskId).subscribe({
        next: (task) => {
          this.task = {
            ...task,
            dueDate: task.dueDate || '',
            planId: task.planId || null
          };
        },
        error: (err) => console.error('Error cargando tarea', err)
      });
    }

    // Cargamos planes para poder asignar la tarea
    this.planService.getUserPlans().subscribe({
      next: (plans) => this.userPlans = plans,
      error: (err) => console.error('Error cargando planes', err)
    });
  }

  // Actualiza la tarea en el servidor
  updateTask() {
    if (this.task.id) {
    
      // Preparamos los datos actualizados
      const taskToUpdate: Task = {
        ...this.task,
        dueDate: this.task.dueDate || undefined,
        planId: this.task.planId || null
      };
      
      // Enviamos al backend
      this.taskService.updateTask(this.task.id, taskToUpdate).subscribe({
        next: () => this.router.navigate(['/home'], {
          state: { refresh: true }
        }),
        error: (err) => console.error('Error actualizando tarea', err),
      });
    }
  }
}
