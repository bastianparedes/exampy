import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatCheckboxModule],
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
