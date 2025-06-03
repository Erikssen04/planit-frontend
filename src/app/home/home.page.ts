import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { Plan } from '../models/plan.model';
import { TaskService } from '../services/task.service';
import { PlanService } from '../services/plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  plans: Plan[] = [];
  filteredTasks: Task[] = [];
  selectedFilter: string = 'all';
  searchQuery: string = '';
  selectedDateFilter: string = 'all';

  constructor(
    private taskService: TaskService,
    private planService: PlanService,
    private router: Router
  ) {}

  // Al iniciar la página, cargamos los datos
  ngOnInit() {
    this.loadData();
  }

  // Cada vez que entramos a la página, recargamos por si hay cambios
  ionViewDidEnter() {
    this.loadData();
  }

  // Si venimos de otra página con flag de refresh, volvemos a refrescar
  ionViewWillEnter() {
    if (this.router.getCurrentNavigation()?.extras?.state?.['refresh']) {
      this.loadData();
    }
  }

  // Carga las tareas y planes del usuario
  private loadData() {

    // Cargar tareas y planes del usuario
    this.taskService.getUserTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilters();
    });

    // Obtenemos los planes del usuario
    this.planService.getUserPlans().subscribe(plans => {
      this.plans = plans;
    });
  }

  // filtros para las tareas
  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      const statusMatch =
        this.selectedFilter === 'all' ||
        (this.selectedFilter === 'completed' && task.completed) ||
        (this.selectedFilter === 'pending' && !task.completed);

      const searchMatch = task.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const dateMatch = this.checkDateFilter(task.dueDate);

      return statusMatch && searchMatch && dateMatch;
    });
  }

  // filtro para la fecha
  private checkDateFilter(dueDate?: string): boolean {
    if (!dueDate || this.selectedDateFilter === 'all') return true;

    const taskDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    taskDate.setMinutes(taskDate.getMinutes() + taskDate.getTimezoneOffset());

    switch (this.selectedDateFilter) {

      case 'today':
        return this.isSameDate(taskDate, today);

      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return this.isSameDate(taskDate, tomorrow);

      case 'week':
        return this.isInCurrentWeek(taskDate, today);

      default:
        return true;

    }
  }

  // Método auxiliar para verificar si las fechas coinciden
  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Método auxiliar para verificar si la semana de la tarea coinicde con el filtro
  private isInCurrentWeek(taskDate: Date, referenceDate: Date): boolean {
    const date = new Date(taskDate);
    date.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(referenceDate);
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  }

  // Alterna el estado completado/pendiente de una tarea
  toggleTask(id: string | undefined) {
    if (!id) return;
    this.taskService.toggleTask(id).subscribe(updatedTask => {
      const index = this.tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
        this.applyFilters();
      }
    });
  }

  deleteTask(id: string | undefined) {
    if (!id) return;
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.applyFilters();
    });
  }

  goToCreateTask() {
    this.router.navigate(['/create-task']);
  }

  goToUpdateTask(taskId: string) {
    this.router.navigate(['/update-task', taskId]);
  }

  getPriorityColor(priority?: string): string {
    switch (priority?.toLowerCase()) {
      case 'alta': return 'danger';
      case 'media': return 'warning';
      case 'baja': return 'success';
      default: return 'medium';
    }
  }

  getPlanName(planId: string): string {
    const plan = this.plans.find(p => p.id === planId);
    return plan ? plan.title : 'Sin plan';
  }
}
