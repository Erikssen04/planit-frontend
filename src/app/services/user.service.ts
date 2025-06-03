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
    return this.http.put(`${this.backendUrl}/users/${userId}/username`, { username });
  }

  deleteCurrentUser() {
    return this.http.delete(`${this.backendUrl}/users/me`, { responseType: 'text' });
  }
}