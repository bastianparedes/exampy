import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface UserData {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private platform = inject(PLATFORM_ID);

  private promiseData = this.getUserData();
  private router = inject(Router);

  isAuthenticated: boolean | undefined = undefined;
  userData: undefined | UserData | null = undefined;
  isAuthenticatedPromise = this.promiseData.then((data) => data.authenticated);
  userDataPromise = this.promiseData.then((data) => data.user_data);

  constructor() {
    if (isPlatformBrowser(this.platform)) {
      this.promiseData.then((userData) => {
        this.isAuthenticated = userData.authenticated
        this.userData = userData.user_data;
      });
    }
  }

  async getUserData() {
    if (isPlatformServer(this.platform)) return {
      authenticated: false,
      user_data: null
    };
    const url = `${environment.domain}/api/auth/user_data`;

    const json = await firstValueFrom(this.httpClient.get<{
      id: number;
      name: string;
      email: string;
    } | null>(url, { responseType: 'json' }));

    if (json === null) return {
      authenticated: false as const,
      user_data: null,
    };
  
    return {
      authenticated: true as const,
      user_data: json,
    };
  };

  login() {
    this.router.navigate(['/', 'exercises']);
  }

  async logout() {
    await firstValueFrom(this.httpClient.get(`${environment.domain}/api/auth/logout`));
    this.router.navigate(['/', 'exercises']);
  }
}
