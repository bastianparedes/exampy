import { Injectable, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  auth = inject(AuthService);
  router = inject(Router);

  async canActivate() {
    const isLoggedIn = await this.auth.isAuthenticatedPromise;
    if (!isLoggedIn) {
      this.router.navigate(['/']);
      return isLoggedIn;
    }
    return isLoggedIn;
  }
}