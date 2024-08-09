import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, PasswordModule, ButtonModule, CheckboxModule],
  templateUrl: './logIn.component.html'
})
export class LogInComponent {
  httpClient = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  userData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    keepSesion: new FormControl(false, [Validators.required])
  });

  hidePassword = true;
  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    const { email, password, keepSesion } = this.userData.value;
    if (typeof email !== 'string' || typeof password !== 'string' || typeof keepSesion !== 'boolean') return;

    const { success } = await this.authService.logIn(email, password, keepSesion);
    if (success) {
      await this.router.navigate(['/create_exam']).then(() => window.location.reload());
    }
  }
}
