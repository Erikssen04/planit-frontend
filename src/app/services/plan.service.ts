import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Plan } from '../models/plan.model';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = `${environment.backendUrl}/plans`;

  constructor(private http: HttpClient) {}

    // Obtenemos los planes del usuario logeado
    getUserPlans(): Observable<Plan[]> {
     return this.http.get<Plan[]>(`${this.apiUrl}/me`);
    }

    // Crea un nuevo plan con autenticación
    createPlan(plan: Plan): Observable<any> {
        const auth = getAuth();

        // Obtenemos token de Firebase
        return from(auth.currentUser?.getIdToken() ?? Promise.reject('No user logged in')).pipe(
        switchMap(token => {

            // Incluimos token en la cabecera
            const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
            });
            return this.http.post(this.apiUrl, plan, { headers });
        })
        );
    }

    // Alterna estado completado de un plan
    togglePlan(planId: string): Observable<Plan> {
        return this.http.patch<Plan>(`${this.apiUrl}/${planId}/toggle`, {});
      }

    deletePlan(planId: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${planId}`);
    }

    getPlanById(planId: string): Observable<Plan> {
        return this.http.get<Plan>(`${this.apiUrl}/${planId}`);
    }

    updatePlan(planId: string, plan: Plan): Observable<Plan> {
        return this.http.put<Plan>(`${this.apiUrl}/${planId}`, plan);
    }

    getPlans(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getPlanTasks(planId: string): Observable<Task[]> {
        return this.http.get<Task[]>(`${this.apiUrl}/${planId}/tasks`);
    }
}