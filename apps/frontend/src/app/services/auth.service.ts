import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { FilteredColumnsByArray } from '../../types/dictionary';
import { Router } from '@angular/router';

interface UserData {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private httpClient = inject(HttpClient);
  router = inject(Router);

  isAuthenticated: undefined | null | boolean = undefined;
  userData:
    | undefined
    | null
    | {
        firstName: string;
      } = undefined;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.getUserData(['firstName']).then((response) => {
        if (response === null) {
          this.isAuthenticated = false;
          this.userData = null;
          return;
        }
        this.isAuthenticated = true;
        this.userData = response;
      });
    }
  }

  async signUp(userData: Omit<UserData, 'id'> & { password: string } & Record<string, unknown>) {
    const { success } = await firstValueFrom(this.httpClient.post<{ success: boolean }>('/api/auth/sign_up', userData));
    return { success };
  }

  async logIn(email: string, password: string, keepSesion: boolean) {
    const { success } = await firstValueFrom(this.httpClient.post<{ success: boolean }>('/api/auth/log_in', { email, password, keepSesion }));
    return { success };
  }

  async logOut() {
    const { success } = await firstValueFrom(this.httpClient.get<{ success: boolean }>('/api/auth/log_out'));
    return { success };
  }

  async getUserData<T extends (keyof Omit<UserData, 'passwordHash'>)[]>(columns: T): Promise<FilteredColumnsByArray<UserData, T> | null> {
    const queryParams = new URLSearchParams();
    for (const column of new Set(columns)) queryParams.append('columns', column);

    const url = `/api/auth/user_data?${queryParams.toString()}`;
    try {
      const json = await firstValueFrom(this.httpClient.get<FilteredColumnsByArray<UserData, T>>(url, { responseType: 'json' }));
      return json;
    } catch {
      return null;
    }
  }
}
