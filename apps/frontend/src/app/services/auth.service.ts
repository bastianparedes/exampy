import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { FilteredColumnsByArray } from '../../types/dictionary';

interface UserData {
  id: number;
  email: string;
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

  isAuthenticated: undefined | null | boolean = undefined;
  userData:
    | undefined
    | null
    | {
        firstName: string;
      } = undefined;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchUserData(['firstName']).then((response) => {
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
    try {
      await firstValueFrom(this.httpClient.post('/api/auth/sign_up', userData));
      return {
        success: true
      };
    } catch {
      return {
        success: false
      };
    }
  }

  async logIn(email: string, password: string) {
    try {
      await firstValueFrom(this.httpClient.post('/api/auth/log_in', { email, password }));
      return {
        success: true
      };
    } catch {
      return {
        success: false
      };
    }
  }

  async logOut() {
    try {
      await firstValueFrom(this.httpClient.get('/api/auth/log_out'));
      return {
        success: true
      };
    } catch {
      return {
        success: false
      };
    }
  }

  async fetchUserData<T extends (keyof UserData)[]>(columns: T): Promise<FilteredColumnsByArray<UserData, T> | null> {
    const queryParams = new URLSearchParams();
    for (const column of new Set(columns)) queryParams.append('columns', column);

    const url = `/api/auth/get_user_data?${queryParams.toString()}`;
    try {
      const json = await firstValueFrom(this.httpClient.get<FilteredColumnsByArray<UserData, T>>(url, { responseType: 'json' }));
      return json;
    } catch {
      return null;
    }
  }
}
