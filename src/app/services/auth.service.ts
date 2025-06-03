import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { createUserWithEmailAndPassword, getAuth, updateProfile, User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  async register(email: string, password: string, username: string): Promise<void> {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const backendUser = { 
          username, 
          email, 
          firebaseUid: userCredential.user.uid
      };
      await this.http.post(`${this.backendUrl}/users`, backendUser).toPromise();
  }

  // Método que obtiene el id del usuario logeado desde Firebase
  async getCurrentUserId(): Promise<string> {
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    return user.uid;
  }

  
}
