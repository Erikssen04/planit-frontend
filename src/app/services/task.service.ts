import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = `${environment.backendUrl}/tasks`;
  
  constructor(private http: HttpClient) {}

  // Obtenemos tareas del usuario actual
  getUserTasks(): Observable<Task[]> {
      return this.http.get<Task[]>(`${this.apiUrl}/me`);
  }

  // Creamos una nueva tarea con autenticación
  createTask(task: Task): Observable<any> {
    const auth = getAuth();
    
    return from(auth.currentUser?.getIdToken() ?? Promise.reject('No user logged in')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
        return this.http.post(this.apiUrl, task, { headers });
      }),
    );
  }

  toggleTask(taskId: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/toggle`, {});
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${taskId}`);
  }

  updateTask(taskId: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}`, task);
  }

  getTasksByPlan(planId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/plan/${planId}`);
  }

  assignTaskToPlan(taskId: string, planId: string): Observable<Task> {
    return this.getTaskById(taskId).pipe(
      switchMap(task => {
        const updatedTask: Task = {...task, planId};
        return this.updateTask(taskId, updatedTask);
      })
    );
  }

  unassignTaskFromPlan(taskId: string): Observable<Task> {
    return this.getTaskById(taskId).pipe(
      switchMap(task => {
        const updatedTask: Task = {...task, planId: null};
        return this.updateTask(taskId, updatedTask);
      })
    );
  }
  
}
