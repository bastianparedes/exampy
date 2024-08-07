import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, type ValidatorFn, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signUp.component.html'
})
export class SignUpComponent {
  httpClient = inject(HttpClient);
  router = inject(Router);

  userData = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    {
      validators: [this.passwordsAreEqual()]
    }
  );

  passwordsAreEqual(): ValidatorFn {
    return (): ValidationErrors | null => {
      if (this.userData?.get('password')?.value === this.userData?.get('confirmPassword')?.value) return null;
      return { passwordsNotEqual: true };
    };
  }

  hidePassword = true;
  toggleHidePassword() {
    this.hidePassword = !this.hidePassword;
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    firstValueFrom(this.httpClient.post('/api/auth/sign_up', this.userData.value))
      .then(() => {
        this.router.navigate(['/log_in']);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
