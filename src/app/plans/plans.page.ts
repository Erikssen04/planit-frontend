import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Plan } from 'src/app/models/plan.model';
import { PlanService } from 'src/app/services/plan.service';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss'],
  standalone: false
})
export class PlansPage implements OnInit {
  plans: Plan[] = [];
  filteredPlans: Plan[] = [];
  selectedFilter: string = 'all';
  searchQuery: string = '';
  selectedDateFilter: string = 'all';
  planTasks: { [planId: string]: Task[] } = {};
  
  constructor(
    private planService: PlanService,
    private taskService: TaskService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController
  ) {}

  // Al iniciar, cargamos los planes
  ngOnInit() {
    this.loadPlans();
  }

  ionViewDidEnter() {
    this.loadPlans();
  }

  ionViewWillEnter() {
    if (this.router.getCurrentNavigation()?.extras?.state?.['refresh']) {
      this.ngOnInit();
    }
  }

  // Cargamos los planes del usuario
  private loadPlans() {
    this.planService.getUserPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.applyFilters();
        this.loadTasksForPlans();
      },
      error: (err) => console.error('Error cargando planes', err)
    });
  }

  // Carga las tareas para cada plan (en paralelo)
  private loadTasksForPlans() {
    this.planTasks = {}; 

    // Creamos un array de peticiones (una por plan)
    const requests = this.plans
      .filter(plan => plan.id)
      .map(plan => {
        return this.taskService.getTasksByPlan(plan.id!).pipe(
          switchMap(tasks => {
            return of({ planId: plan.id!, tasks });
          })
        );
      });

      // Ejecutamos todas las peticiones en paralelo
    if (requests.length > 0) {
      forkJoin(requests).subscribe({
        next: (results) => {
          results.forEach(result => {
            this.planTasks[result.planId] = result.tasks;
          });
          this.cdr.detectChanges(); 
        },
        error: (err) => console.error('Error cargando tareas', err)
      });
    } else {

      // Inicialización de planes sin tareas
      this.plans.forEach(plan => {
        if (plan.id) {
          this.planTasks[plan.id] = [];
        }
      });
    }
  }

  getTasks(planId: string): Task[] {
    return this.planTasks[planId] || [];
  }

  getTaskCount(planId: string): number {
    return this.getTasks(planId).length;
  }

  applyFilters() {
    this.filteredPlans = this.plans.filter(plan => {
      const statusMatch = this.selectedFilter === 'all' ||
                        (this.selectedFilter === 'completed' && plan.completed) ||
                        (this.selectedFilter === 'active' && !plan.completed);

      const searchMatch = plan.title.toLowerCase().includes(this.searchQuery.toLowerCase());

      const dateMatch = this.checkDateFilter(plan.dueDate);

      return statusMatch && searchMatch && dateMatch;
    });
  }

  private checkDateFilter(dueDate?: string): boolean {
    if (!dueDate || this.selectedDateFilter === 'all') return true;

    const planDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    planDate.setMinutes(planDate.getMinutes() + planDate.getTimezoneOffset());

    switch(this.selectedDateFilter) {
      case 'today':
        return this.isSameDate(planDate, today);
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.isSameDate(planDate, tomorrow);
      case 'week':
        return this.isInCurrentWeek(planDate, today);
      default:
        return true;
    }
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private isInCurrentWeek(date: Date, referenceDate: Date): boolean {
    const startOfWeek = new Date(referenceDate);
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  }

  // Alterna el estado completado de un plan
  togglePlan(id: string) {
    this.planService.togglePlan(id).subscribe({
      next: (updatedPlan) => {
        const index = this.plans.findIndex(p => p.id === id);
        if (index !== -1) {

          // Actualizamos el plan localmente
          this.plans[index] = updatedPlan;
          this.applyFilters();
          
          // Si el plan se marca como completado, se marcan todas sus tareas como completadas
          if (updatedPlan.completed) {
            this.markAllTasksComplete(id);
          }
        }
      },
      error: (err) => console.error('Error actualizando plan', err)
    });
  }

  // Confirmación antes de borrar un plan
  async confirmDeletePlan(plan: Plan) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar el plan "${plan.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deletePlan(plan.id!);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmDeleteTask(task: Task, planId: string) {
    const taskTitle = task.title || 'tarea sin título';
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar la tarea "${taskTitle}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteTask(task.id!, planId);
          }
        }
      ]
    });

    await alert.present();
  }

  deletePlan(id: string) {
    this.planService.deletePlan(id).subscribe({
      next: () => {
        this.plans = this.plans.filter(p => p.id !== id);
        delete this.planTasks[id];
        this.applyFilters();
      },
      error: (err) => console.error('Error eliminando plan', err)
    });
  }

  toggleTask(taskId: string, planId: string) {
    this.taskService.toggleTask(taskId).subscribe({
      next: (updatedTask) => {
        const tasks = this.planTasks[planId];
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          tasks[index] = updatedTask;
          
          // Verificar si todas las tareas están completadas
          const allTasksCompleted = tasks.every(t => t.completed);
          if (allTasksCompleted) {
            this.markPlanComplete(planId);
          }
        }
      },
      error: (err) => console.error('Error actualizando tarea', err)
    });
  }

  deleteTask(taskId: string, planId: string) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.planTasks[planId] = this.planTasks[planId].filter(t => t.id !== taskId);
      },
      error: (err) => console.error('Error eliminando tarea', err)
    });
  }

  // Marca todas las tareas de un plan como completadas
  markAllTasksComplete(planId: string) {
    const tasks = this.getTasks(planId);
    if (tasks.length === 0) return;

    // Esto crea un array de observables para actualizar todas las tareas
    const updateObservables = tasks
      .filter(task => !task.completed) // Solo tareas no completadas
      .map(task => this.taskService.toggleTask(task.id!));

    // Ejecutamos en paralelo
    if (updateObservables.length > 0) {
      forkJoin(updateObservables).subscribe({
        next: (results) => {

          // Actualiza estado local de las tareas
          tasks.forEach(task => {
            if (!task.completed) {
              task.completed = true;
            }
          });
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error completando tareas', err)
      });
    }
  }

  markPlanComplete(planId: string) {
    const plan = this.plans.find(p => p.id === planId);
    if (plan && !plan.completed) {
      this.planService.togglePlan(planId).subscribe({
        next: (updatedPlan) => {
          const index = this.plans.findIndex(p => p.id === planId);
          if (index !== -1) {
            this.plans[index] = updatedPlan;
            this.applyFilters();
          }
        },
        error: (err) => console.error('Error completando plan', err)
      });
    }
  }

  getPriorityColor(priority?: string): string {
    switch(priority?.toLowerCase()) {
      case 'alta': return 'danger';
      case 'media': return 'warning';
      case 'baja': return 'success';
      default: return 'medium';
    }
  }

  goToCreatePlan() {
    this.router.navigate(['/create-plan']);
  }

  goToUpdatePlan(planId: string) {
    this.router.navigate(['/update-plan', planId]);
  }
}