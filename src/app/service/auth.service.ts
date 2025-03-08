import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/projectvet';
  private tokenKey = 'auth_token';
  private userNameKey = 'user_name';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      }),
      catchError((error) => {
        console.error('Erro no login:', error);
        throw error;
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
      tap((response) => console.log('Resposta:', response)),
      catchError((error) => {
        console.error('Erro no registro:', error);
        throw error;
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey); //recupera o token
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey); // remove o token ao deslogar
    localStorage.removeItem(this.userNameKey); // remove o nome ao deslogar
  }

  getUserName(): string | null {
    return localStorage.getItem(this.userNameKey); // recupera o nome para nav-bar
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); //verifica se há token
  }

  forgotPassword(email: string): Observable<any> {
    const userData = { email };
    return this.http.post(`${this.apiUrl}/code-forgot`, userData).pipe(
      tap(response => console.log('Código enviado:', response)),
      catchError(error => {
        console.error('Erro ao enviar código:', error);
        throw error;
      })
    );
  }

resetPassword(email: string, code: string, newPassword: string): Observable<any> {
  const userData = { email, codeRecoveryPassword: code, password: newPassword };
  return this.http.post(`${this.apiUrl}/change-password`, userData).pipe(
    tap(response => console.log('Resposta do servidor:', response)),
    catchError(error => {
      console.error('Erro ao redefinir senha:', error);
      throw error;
    })
  );
}
  verifyCode(email: string, code: string): Observable<any> {
    const data = { email, codeRecoveryPassword: code };
    return this.http.post(`${this.apiUrl}/verify-code`, data).pipe(
      tap((response) => console.log('Resposta:', response)),
      catchError((error) => {
        console.error('Erro ao verificar código:', error);
        throw error;
      })
    );
  }
}
