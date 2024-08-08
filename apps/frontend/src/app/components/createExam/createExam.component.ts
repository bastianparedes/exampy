import { Component, inject, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormGroup, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-exam',
  templateUrl: './createExam.component.html',
  styleUrl: './createExam.component.scss',
  standalone: true,
  providers: [MessageService],
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    InputNumberModule,
    ToastModule,
    RippleModule,
    MessagesModule,
    SkeletonModule
  ]
})
export class CreateExamComponent implements OnInit {
  sanitizer = inject(DomSanitizer);
  httpClient = inject(HttpClient);
  translateService = inject(TranslateService);
  viewportScroller = inject(ViewportScroller);
  messageService = inject(MessageService);

  async ngOnInit() {
    for (const subject of this.subjects) {
      this.subjectsTranslated.push({
        value: subject,
        label: this.translateService.instant('createExam.' + subject)
      });
    }
  }

  subjects = ['languageAndCommunication', 'mathematics', 'physics', 'chemistry', 'biology', 'naturalSciences', 'geographyAndSocialSciences', 'physicalEducation', 'visualArts', 'music', 'technology'];
  subjectsTranslated = [] as { label: string; value: string }[];

  examDataForm = new FormGroup({
    exercises: new FormGroup({
      uniqueSelection: new FormArray(
        [] as FormGroup<{
          description: FormControl<string | null>;
          quantity: FormControl<number | null>;
        }>[]
      ),
      development: new FormArray(
        [] as FormGroup<{
          description: FormControl<string | null>;
          quantity: FormControl<number | null>;
        }>[]
      ),
      trueOrFalse: new FormArray(
        [] as FormGroup<{
          description: FormControl<string | null>;
          quantity: FormControl<number | null>;
        }>[]
      )
    }),
    subject: new FormControl('', [Validators.required, Validators.minLength(1)]),
    includeAnswers: new FormControl(true, [Validators.required])
  });

  readonly sections = ['uniqueSelection', 'development', 'trueOrFalse'] as const;
  getSectionArray(section: (typeof this.sections)[number]) {
    return this.examDataForm.get('exercises.' + section) as FormArray;
  }

  isCreatingPdf = false;
  pdfUrl: undefined | SafeResourceUrl = undefined;

  setExample() {
    this.examDataForm = new FormGroup({
      exercises: new FormGroup({
        uniqueSelection: new FormArray([
          new FormGroup({
            description: new FormControl('Multiplicación de matrices', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)])
          }),
          new FormGroup({
            description: new FormControl('Suma de fracciones', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)])
          })
        ]),
        development: new FormArray([
          new FormGroup({
            description: new FormControl('Se da una función cuadrática y se pide su gráfica', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)])
          })
        ]),
        trueOrFalse: new FormArray([
          new FormGroup({
            description: new FormControl('Multiplicación de números negativos', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)])
          })
        ])
      }),
      subject: new FormControl('mathematics', [Validators.required, Validators.maxLength(200)]),
      includeAnswers: new FormControl(true, [Validators.required])
    });
  }

  addRow(section: (typeof this.sections)[number]) {
    const exerciseSection = this.examDataForm.get('exercises.' + section) as FormArray;
    exerciseSection.push(
      new FormGroup({
        description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
        quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)])
      })
    );
  }

  deleteRow(section: (typeof this.sections)[number], index: number) {
    const exerciseSection = this.examDataForm.get('exercises.' + section) as FormArray;
    exerciseSection.removeAt(index);
  }

  getExamCanBeCreated(): boolean {
    const thereIsAtLeastExercise = this.sections.some((section) => Number(this.examDataForm.value.exercises?.[section]?.length) > 0);
    return thereIsAtLeastExercise && this.examDataForm.valid && !this.isCreatingPdf;
  }

  async createTest(event: Event) {
    event.preventDefault();

    this.messageService.add({
      severity: 'info',
      summary: this.translateService.instant('createExam.initExamCreation'),
      sticky: true
    });

    this.isCreatingPdf = true;
    try {
      const pdfName = await firstValueFrom(
        this.httpClient.post('/api/exam', this.examDataForm.value, {
          responseType: 'text'
        })
      );
      this.messageService.clear();
      this.messageService.add({
        severity: 'success',
        summary: this.translateService.instant('createExam.examCreationSucceded')
      });

      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`/api/pdf/${pdfName}`);
      setTimeout(() => this.viewportScroller.scrollToAnchor('exam-pdf'), 100);
    } catch (error) {
      this.messageService.clear();
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant('createExam.examCreationFailed'),
        sticky: true
      });
      console.error(error);
      this.pdfUrl = undefined;
    }
    this.isCreatingPdf = false;
  }
}
