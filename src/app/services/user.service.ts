import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  updateUsername(userId: string, username: string) {
  // Pasar solo los campos que quieres actualizar, backend solo usa username y email (que puede ir vacio)
  return this.http.put(`${this.backendUrl}/users/${userId}`, { 
    username,
    email: "", // obligatorio pero no usado
    firebaseUid: "" // obligatorio pero no usado, o puedes eliminar si no se usa
  });
}


  deleteCurrentUser() {
    return this.http.delete(`${this.backendUrl}/users/me`, { responseType: 'text' });
  }
}