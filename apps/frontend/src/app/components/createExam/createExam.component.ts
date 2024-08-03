import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
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
import {
  FormBuilder,
  FormArray,
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
    ReactiveFormsModule
  ],
})
export class CreateExamComponent {
  sanitizer = inject(DomSanitizer);
  httpClient = inject(HttpClient);
  matSnackBar = inject(MatSnackBar);
  translateService = inject(TranslateService);
  viewportScroller = inject(ViewportScroller);
  formBuilder = inject(FormBuilder);

  subjects = [
    'languageAndCommunication',
    'mathematics',
    'physics',
    'chemistry',
    'biology',
    'naturalSciences',
    'geographyAndSocialSciences',
    'physicalEducation',
    'visualArts',
    'music',
    'technology',
  ];

  examDataForm = new FormGroup({
    exercises: new FormGroup({
      uniqueSelection: new FormArray<FormGroup<{
        description: FormControl<string>;
        quantity: FormControl<number>;
      }>>([]),
      development: new FormArray<FormGroup<{
        description: FormControl<string>;
        quantity: FormControl<number>;
      }>>([]),
      trueOrFalse: new FormArray<FormGroup<{
        description: FormControl<string>;
        quantity: FormControl<number>;
      }>>([]),
    }),
    subject: new FormControl('', [ Validators.required, Validators.maxLength(100) ]),
    whiteSheets: new FormControl(0, [ Validators.required, Validators.maxLength(100) ]),
    includeGraphs: new FormControl(false, [ Validators.required, Validators.maxLength(100) ]),
    includeAnswers: new FormControl(true, [ Validators.required, Validators.maxLength(100) ])
  }) as FormGroup<{
    exercises: FormGroup<{
        uniqueSelection: FormArray<FormGroup<{
            description: FormControl<string>;
            quantity: FormControl<number>;
        }>>;
        development: FormArray<FormGroup<{
            description: FormControl<string>;
            quantity: FormControl<number>;
        }>>;
        trueOrFalse: FormArray<FormGroup<{
          description: FormControl<string>;
          quantity: FormControl<number>;
        }>>;
    }>;
    subject: FormControl<string>;
    whiteSheets: FormControl<number>;
    includeGraphs: FormControl<boolean>;
    includeAnswers: FormControl<boolean>;
}>;

  readonly sections = ['uniqueSelection', 'development', 'trueOrFalse'] as const;

  isCreatingPdf = false;
  pdfUrl: undefined | SafeResourceUrl = undefined;

  setExample() {
    this.examDataForm.setValue({
      exercises: {
        uniqueSelection: [{ description: 'Multiplicación de matrices', quantity: 3 }],
        development: [{ description: 'Se da una función cuadrática y se pide su gráfica', quantity: 3 }],
        trueOrFalse: [{ description: 'Multiplicación de números negativos', quantity: 3 }]
      },
      subject: 'mathematics',
      whiteSheets: 1,
      includeGraphs: true,
      includeAnswers: true,
    });
  }

  handleDescriptionInput(
    event: Event,
    section: (typeof this.sections)[number],
    index: number
  ) {
    const { value } = event.target as HTMLInputElement;
    const exercise = this.examDataForm.value.exercises?.[section]?.[index];
    if (exercise === undefined) return;
    exercise.description = value;
  }

  updateQuantityWithKeyboard(event: KeyboardEvent) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')
      event.preventDefault();
  }

  updateQuantity(
    event: Event,
    section: (typeof this.sections)[number],
    index: number
  ) {
  
    const exercise = this.examDataForm.value.exercises?.[section]?.[index];
    if (exercise === undefined) return;
    exercise.quantity = Number((event.target as HTMLInputElement).value);
  }

  addRow(section: (typeof this.sections)[number]) {
    this.examDataForm.value.exercises?.[section]?.push({
      description: '',
      quantity: 1,
    })
  }

  deleteRow(section: (typeof this.sections)[number], index: number) {
    this.examDataForm.value.exercises?.[section]?.splice(index, 1);
  }

  getExamCanBeCreated(): boolean {
    const thereIsAtLeastExercise = this.sections.some((section) => Number(this.examDataForm.value.exercises?.[section]?.length) > 0);
    const everyDescriptionIsNotEmpty = this.sections.every((section) => this.examDataForm.value.exercises?.[section]?.every((exercise) => Number(exercise?.description?.length) > 0));
    const subjectIsSelected = this.examDataForm.value.subject !== '';
    return (
      thereIsAtLeastExercise &&
      everyDescriptionIsNotEmpty &&
      subjectIsSelected &&
      !this.isCreatingPdf
    );
  }

  async createTest(event: Event) {
    event.preventDefault();

    this.matSnackBar.open(
      await firstValueFrom(
        this.translateService.get('createExam.initExamCreation')
      ),
      '',
      { horizontalPosition: 'right', duration: 60 * 1000 }
    );

    this.isCreatingPdf = true;
    try {
      const pdfName = await firstValueFrom(
        this.httpClient.post(
          '/api/exam',
          this.examDataForm.value,
          { responseType: 'text' }
        )
      );
      this.matSnackBar.open(
        await firstValueFrom(
          this.translateService.get('createExam.examCreationSucceded')
        ),
        await firstValueFrom(this.translateService.get('createExam.close')),
        { horizontalPosition: 'right' }
      );

      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `/api/pdf/${pdfName}`
      );
      setTimeout(() => this.viewportScroller.scrollToAnchor('exam-pdf'), 100);
    } catch (error) {
      console.error(error);
      this.pdfUrl = undefined;
      this.matSnackBar.open(
        await firstValueFrom(
          this.translateService.get('createExam.examCreationFailed')
        ),
        await firstValueFrom(this.translateService.get('createExam.close')),
        { horizontalPosition: 'right' }
      );
    }
    this.isCreatingPdf = false;
  }
}
