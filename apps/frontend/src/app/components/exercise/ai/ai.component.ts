import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogRef } from '@angular/cdk/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.scss'
})
export class AiComponent {
  data =  new FormGroup({
    text: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(200),
    ])
  });
  dialogRef = inject(DialogRef<string>);

  closeWithText() {
    if (!this.data.valid) return;
    if (typeof this.data.value.text !== 'string') return;
    this.dialogRef.close(this.data.value.text);
  }

  closeEmpty() {
    this.dialogRef.close();
  }
}
