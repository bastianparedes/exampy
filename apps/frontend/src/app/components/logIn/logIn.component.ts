import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, PasswordModule, ButtonModule, CheckboxModule],
  templateUrl: './logIn.component.html'
})
export class LogInComponent {
  httpClient = inject(HttpClient);
  router = inject(Router);

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

    firstValueFrom(this.httpClient.post('/api/auth/log_in', this.userData.value))
      .then(() => {
        this.router.navigate(['/create_exam']);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
