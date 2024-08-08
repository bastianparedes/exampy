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

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [TranslateModule, FormsModule, ReactiveFormsModule, InputTextModule, FloatLabelModule, PasswordModule, ButtonModule],
  templateUrl: './signUp.component.html'
})
export class SignUpComponent {
  httpClient = inject(HttpClient);
  router = inject(Router);

  constructor() {
    this.userData.addValidators(() => {
      if (this?.passwordsAreEqual()) return null;
      return { passwordsNotEqual: true };
    });
  }

  userData = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  passwordsAreEqual() {
    return this?.userData?.get('password')?.value === this?.userData?.get('confirmPassword')?.value;
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.userData.invalid) return;

    firstValueFrom(this.httpClient.post('/api/auth/sign_up', this.userData.value))
      .then(() => {
        this.router.navigate(['/log_in']);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
