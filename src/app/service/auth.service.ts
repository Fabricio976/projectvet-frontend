import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/projectvet';
  private tokenKey = 'token';
  private userName: string | null = null;

  private userNameSubject = new BehaviorSubject<string | null>(this.getUserName());
  userName$ = this.userNameSubject.asObservable();

  constructor(private http: HttpClient) {
    this.userName = localStorage.getItem('userName');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        const token = response.token;
        const userName = response.userNome;

        if (token) {
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem('userName', userName || '');
          this.userName = userName;
          this.userNameSubject.next(userName); 
        } else {
          console.error('Token não encontrado no response:', response);
          throw new Error('Resposta da API inválida');
        }
      })
    );
  }

  register(userData: {
    name: string;
    email: string;
    password: string;
    cpf: string;
    address: string;
    phone: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/funcionario`, userData).pipe(
      catchError((error) => {
        console.error('Erro no registro:', error);
        throw error;
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userName');
    this.userName = null;
    this.userNameSubject.next(null);
  }

  getUserName(): string | null {
    return this.userName || localStorage.getItem('userName');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  forgotPassword(email: string): Observable<any> {
    const userData = { email };
    return this.http.post(`${this.apiUrl}/code-forgot`, userData).pipe(
      catchError((error) => {
        console.error('Erro ao enviar código:', error);
        throw error;
      })
    );
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    const userData = { email, codeRecoveryPassword: code, password: newPassword };
    return this.http.post(`${this.apiUrl}/change-password`, userData).pipe(
      catchError((error) => {
        console.error('Erro ao redefinir senha:', error);
        throw error;
      })
    );
  }

  verifyCode(email: string, code: string): Observable<any> {
    const data = { email, codeRecoveryPassword: code };
    return this.http.post(`${this.apiUrl}/verify-code`, data).pipe(
      catchError((error) => {
        console.error('Erro ao verificar código:', error);
        throw error;
      })
    );
  }
}
