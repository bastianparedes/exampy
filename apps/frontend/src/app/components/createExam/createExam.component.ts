import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderComponent } from '../../components/common/loader/loader.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProgressComponent } from '../../components/common/progress/progress.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonComponent } from '../common/skeleton/skeleton.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ViewportScroller } from '@angular/common';
import { FormBuilder, FormArray, FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-exam',
  templateUrl: './createExam.component.html',
  styleUrl: './createExam.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    LoaderComponent,
    MatPaginatorModule,
    ProgressComponent,
    TranslateModule,
    MatProgressSpinnerModule,
    SkeletonComponent,
    MatSelectModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CreateExamComponent {
  sanitizer = inject(DomSanitizer);
  httpClient = inject(HttpClient);
  matSnackBar = inject(MatSnackBar);
  translateService = inject(TranslateService);
  viewportScroller = inject(ViewportScroller);
  formBuilder = inject(FormBuilder);

  subjects = ['languageAndCommunication', 'mathematics', 'physics', 'chemistry', 'biology', 'naturalSciences', 'geographyAndSocialSciences', 'physicalEducation', 'visualArts', 'music', 'technology'];

  examDataForm = new FormGroup({
    exercises: this.formBuilder.group({
      uniqueSelection: new FormArray([] as FormGroup<{ description: FormControl<string | null>; quantity: FormControl<number | null> }>[]),
      development: new FormArray([] as FormGroup<{ description: FormControl<string | null>; quantity: FormControl<number | null> }>[]),
      trueOrFalse: new FormArray([] as FormGroup<{ description: FormControl<string | null>; quantity: FormControl<number | null> }>[]),
    }),
    subject: new FormControl('', [Validators.required, Validators.minLength(1)]),
    whiteSheets: new FormControl(0, [Validators.required, Validators.max(10)]),
    includeAnswers: new FormControl(true, [Validators.required]),
  });

  readonly sections = ['uniqueSelection', 'development', 'trueOrFalse'] as const;
  getSectionArray(section: (typeof this.sections)[number]) {
    return this.examDataForm.get('exercises.' + section) as FormArray;
  }

  isCreatingPdf = false;
  pdfUrl: undefined | SafeResourceUrl = undefined;

  setExample() {
    this.examDataForm = new FormGroup({
      exercises: this.formBuilder.group({
        uniqueSelection: new FormArray([
          new FormGroup({
            description: new FormControl('Multiplicación de matrices', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
          }),
          new FormGroup({
            description: new FormControl('Suma de fracciones', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
          }),
        ]),
        development: new FormArray([
          new FormGroup({
            description: new FormControl('Se da una función cuadrática y se pide su gráfica', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
          }),
        ]),
        trueOrFalse: new FormArray([
          new FormGroup({
            description: new FormControl('Multiplicación de números negativos', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
          }),
        ]),
      }),
      subject: new FormControl('mathematics', [Validators.required, Validators.maxLength(200)]),
      whiteSheets: new FormControl(0, [Validators.required, Validators.max(10)]),
      includeAnswers: new FormControl(true, [Validators.required]),
    });
  }

  addRow(section: (typeof this.sections)[number]) {
    const exerciseSection = this.examDataForm.get('exercises.' + section) as FormArray;
    exerciseSection.push(
      new FormGroup({
        description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
        quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]),
      })
    );
  }

  deleteRow(section: (typeof this.sections)[number], index: number) {
    const exerciseSection = this.examDataForm.get('exercises.' + section) as FormArray;
    exerciseSection.removeAt(index);
  }

  getExamCanBeCreated(): boolean {
    const thereIsAtLeastExercise = this.sections.some(section => Number(this.examDataForm.value.exercises?.[section]?.length) > 0);
    return thereIsAtLeastExercise && this.examDataForm.valid && !this.isCreatingPdf;
  }

  async createTest(event: Event) {
    event.preventDefault();

    this.matSnackBar.open(await firstValueFrom(this.translateService.get('createExam.initExamCreation')), '', { horizontalPosition: 'right', duration: 60 * 1000 });

    this.isCreatingPdf = true;
    try {
      const pdfName = await firstValueFrom(
        this.httpClient.post('/api/exam', this.examDataForm.value, {
          responseType: 'text',
        })
      );
      this.matSnackBar.open(await firstValueFrom(this.translateService.get('createExam.examCreationSucceded')), await firstValueFrom(this.translateService.get('createExam.close')), {
        horizontalPosition: 'right',
      });

      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`/api/pdf/${pdfName}`);
      setTimeout(() => this.viewportScroller.scrollToAnchor('exam-pdf'), 100);
    } catch (error) {
      console.error(error);
      this.pdfUrl = undefined;
      this.matSnackBar.open(await firstValueFrom(this.translateService.get('createExam.examCreationFailed')), await firstValueFrom(this.translateService.get('createExam.close')), {
        horizontalPosition: 'right',
      });
    }
    this.isCreatingPdf = false;
  }
}
