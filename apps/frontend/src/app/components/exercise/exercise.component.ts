import { Component, OnInit, Input, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';
import { PyodideService } from '../../services/pyodide.service';
import { ExerciseService } from '../../services/exercise.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../common/loader/loader.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Dialog } from '@angular/cdk/dialog';
import { AiComponent } from './ai/ai.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule, // ¿no necesario?
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    LoaderComponent,
    TranslateModule
  ],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss'
})
export class ExerciseComponent implements OnInit {
  @Input( { required: false } ) id: undefined | string;

  aiService = inject(AiService);
  platform = inject(PLATFORM_ID);
  isClientSide = isPlatformBrowser(this.platform);
  pyodide = inject(PyodideService);
  router = inject(Router);
  auth = inject(AuthService);
  exerciseService = inject(ExerciseService);

  sanitizer = inject(DomSanitizer)   
  pdfUrl: undefined | SafeResourceUrl = undefined;
  
  canBeSaved = false;
  canBeEdited = false;
  exercise =  new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(200),
    ]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });
  isNewExercise!: boolean;
  snackBar = inject(MatSnackBar);
  isLoading = false;

  async ngOnInit() {
    this.isNewExercise = this.id === undefined;
    if (this.id === undefined) {
      this.exercise.setValue({
        name: '',
        description: '',
        code: await this.pyodide.getExampleCode() ?? null
      });

      this.canBeEdited = true;

      return;
    }

    const data = await this.pyodide.fetchExercise(['name', 'description', 'code', 'user_id'], Number(this.id));
    if (data === undefined){
      this.router.navigate(['/', 'exercises']);
      return
    }

    this.canBeEdited = data.user_id === (await this.auth.userDataPromise)?.id;

    this.exercise.setValue({
      name: data.name,
      description: data.description,
      code: data.code
    });

    this.exercise.controls.code.valueChanges.subscribe(() => {
      this.canBeSaved = false;
      this.pdfUrl = undefined;
    });
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  dialog = inject(Dialog);
  openDialog() {
    const dialogRef = this.dialog.open<string | undefined>(AiComponent, {
      width: '1000px',
      height: '500px',
    });

    dialogRef.closed.subscribe(async (text) => {
      if (text === undefined) return;
      this.isLoading = true;
      const newCode = await this.aiService.generatePythonFn(text);
      this.exercise.setValue({
        name: this.exercise.value.name ?? '',
        description: text,
        code: newCode
      });
      this.isLoading = false;
    });
  }

  async test() {
    this.pdfUrl = undefined;
    this.isLoading = true;
    document.querySelectorAll('.py-error').forEach((error) => error.remove());

    if (!this.exercise.valid) {
      this.isLoading = false;
      this.showMessage('Exercise is not valid');
      return;
    };

    const name = this.exercise.value.name ?? undefined;
    const description = this.exercise.value.description ?? undefined;
    const code = this.exercise.value.code ?? undefined;

    if (name === undefined || description === undefined || code === undefined) {
      this.isLoading = false;
      this.showMessage('Exercise is not valid');
      return;
    }

    const result = await this.exerciseService.createExam(
      [
        { fnCode: code, quantity: 5 }
      ],
      true,
      10,
      10
    );

    if (!result.isValid) {
      this.isLoading = false;
      this.showMessage(result.message);
      return;
    }

    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result.url);
    this.canBeSaved = true;
    this.isLoading = false;
    this.showMessage(`Tests passed, you can save it now`);
  }

  async save() {
    if (!this.exercise.valid) {
      this.showMessage('Exercise is not valid');
      return;
    };

    const name = this.exercise.value.name ?? undefined;
    const description = this.exercise.value.description ?? undefined;
    const code = this.exercise.value.code ?? undefined;

    if (name === undefined || description === undefined || code === undefined) {
      this.showMessage('Exercise is not valid');
      return;
    }

    const data = {
      name, description, code
    };

    if (this.id === undefined) await this.pyodide.createExercise(data);
    else await this.pyodide.updateExercise(Number(this.id), data);

    this.router.navigate(['/', 'exercises']);
  }
}
