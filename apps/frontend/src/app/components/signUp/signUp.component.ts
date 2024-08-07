import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators, type ValidatorFn, type ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [TranslateModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signUp.component.html'
})
export class SignUpComponent {
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

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log(this.userData.errors);
    console.log({ password: this.userData.get('password')?.valid, confirmPassword: this.userData.get('confirmPassword')?.valid });
  }
}
