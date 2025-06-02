import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { SignupUserResquest } from '../models/interfaces/user/signupUser-request';
import { SigninUserResquest } from '../models/interfaces/user/signinUser-request';
import { CookieService } from 'ngx-cookie-service'


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL;
  private tokenKey = environment.tokenKey;

  private userName: string | null = null;
  private userRole: string | null = null;

  private userNameSubject = new BehaviorSubject<string | null>(this.getUserName());
  userName$ = this.userNameSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.userName = localStorage.getItem('userName');
    this.userRole = localStorage.getItem('userRole');
  }


  getToken(): string | null {
    return this.cookieService.get(this.tokenKey);
  }

  logout(): void {
    this.cookieService.delete(this.tokenKey);
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    this.userName = null;
    this.userRole = null;
    this.userNameSubject.next(null);
  }

  getUserRole(): string | null {
    return this.userRole || localStorage.getItem('userRole');
  }

  getUserName(): string | null {
    return this.userName || localStorage.getItem('userName');
  }

  isLoggedIn(): boolean {
    const token = this.cookieService.get(this.tokenKey);
    return !!token;
  }

  forgotPassword(email: string): Observable<any> {
    const userData = { email };
    return this.http.post(`${this.API_URL}/code-forgot`, userData).pipe(
      catchError((error) => {
        console.error('Erro ao enviar código:', error);
        throw error;
      })
    );
  }

  login(authData : SigninUserResquest): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { authData }).pipe(
      tap((response: any) => {
        const token = response?.token;
        const userName = response.userNome;
        const userRole = response.role;

        if (token) {
          this.cookieService.set(this.tokenKey, token);
          localStorage.setItem('userName', userName || '');
          localStorage.setItem('userRole', userRole || '');
          this.userName = userName;
          this.userNameSubject.next(userName);
          this.userRole = userRole;
        } else {
          console.error('Token não encontrado no response:', response);
          throw new Error('Resposta da API inválida');
        }
      })
    );
  }

  register(userData: SignupUserResquest): Observable<any> {
    return this.http.post(`${this.API_URL}/register/client`, userData, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Erro no registro:', error);
        throw error;
      })
    );
  }

  resetPassword(email: string, code: string, newPassword: string): Observable<any> {
    const userData = { email, codeRecoveryPassword: code, password: newPassword };
    return this.http.post(`${this.API_URL}/change-password`, userData).pipe(
      catchError((error) => {
        console.error('Erro ao redefinir senha:', error);
        throw error;
      })
    );
  }

  verifyCode(email: string, code: string): Observable<any> {
    const data = { email, codeRecoveryPassword: code };
    return this.http.post(`${this.API_URL}/verify-code`, data).pipe(
      catchError((error) => {
        console.error('Erro ao verificar código:', error);
        throw error;
      })
    );
  }
}
