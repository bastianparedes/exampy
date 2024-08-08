import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [TranslateModule, ButtonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isOpen = false;

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  async logOut() {
    await this.authService.logOut();
    this.router.navigate(['/']);
  }
}
