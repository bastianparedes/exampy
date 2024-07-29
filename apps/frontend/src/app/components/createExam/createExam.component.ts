import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ViewportScroller } from "@angular/common";

interface Exercise {
  description: string;
  quantity: number;
}

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
    SkeletonComponent
  ],
})
export class CreateExamComponent {
  sanitizer = inject(DomSanitizer);
  httpClient = inject(HttpClient);
  matSnackBar = inject(MatSnackBar);
  translateService = inject(TranslateService);
  viewportScroller = inject(ViewportScroller);
  

  exercises: {
    uniqueSelection: Exercise[];
    development: Exercise[];
    trueOrFalse: Exercise[];
  } = {
    uniqueSelection: [],
    development: [],
    trueOrFalse: []
  };
  readonly sections = Object.keys(this.exercises) as (keyof typeof this.exercises)[];

  isCreatingPdf = false;
  pdfUrl: undefined | SafeResourceUrl = undefined;

  setExample() {
    this.exercises = {
      uniqueSelection:     [
        { description: 'Multiplicación de matrices', quantity: 3},
      ],
      development: [
        { description: 'Se da una función cuadrática y se pide su gráfica', quantity: 3}
      ],
      trueOrFalse: [
        { description: 'Multiplicación de números negativos', quantity: 3}
      ]
    }
  }

  handleDescriptionInput(event: Event, section: keyof typeof this.exercises, index: number) {
    const { value } = event.target as HTMLInputElement;
    this.exercises[section][index].description = value;
  }

  updateQuantityWithKeyboard(event: KeyboardEvent) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') event.preventDefault();
  }

  updateQuantity(event: Event, section: keyof typeof this.exercises, index: number) {
    const exercise = this.exercises[section][index];
    exercise.quantity = Number((event.target as HTMLInputElement).value);
  }

  addRow(section: keyof typeof this.exercises) {
    this.exercises[section].push({
      description: '',
      quantity: 1
    });
  }

  deleteRow(section: keyof typeof this.exercises, index: number) {
    this.exercises[section].splice(index, 1);
  }

  getExamCanBeCreated(): boolean {
    const sections = Object.keys(this.exercises) as (keyof typeof this.exercises)[];
    const sumOfExercisesIsGreaterThanZero = sections.reduce((totalSum, section) => totalSum + this.exercises[section].reduce((sum, exercise) => sum + exercise.quantity, 0), 0) > 0;
    const everyDescriptionIsNotEmpty = sections.reduce((totalSum, section) => totalSum && this.exercises[section].reduce((sum, exercise) => sum && exercise.description.length > 0, true), true);
    return sumOfExercisesIsGreaterThanZero && everyDescriptionIsNotEmpty && !this.isCreatingPdf;
  }

  async createTest() {
    this.matSnackBar.open(
      await firstValueFrom(this.translateService.get('createExam.initExamCreation')),
      '',
      { horizontalPosition: 'right', duration: 60 * 1000 }
    );
    
    this.isCreatingPdf = true;
    const exercises: Partial<typeof this.exercises> = {};
    (Object.keys(this.exercises) as (keyof typeof this.exercises)[]).forEach((section) => {
      if (this.exercises[section].length > 0) exercises[section] = this.exercises[section];
    });
    try {
      const pdfName = await firstValueFrom(this.httpClient.post('/api/exam', { exercises }, { responseType: 'text' }));
      this.matSnackBar.open(
        await firstValueFrom(this.translateService.get('createExam.examCreationSucceded')),
        await firstValueFrom(this.translateService.get('createExam.close')),
        { horizontalPosition: 'right' }
      );

      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`/api/pdf/${pdfName}`);
      setTimeout(() => this.viewportScroller.scrollToAnchor('exam-pdf'), 100);
    } catch (error) {
      console.error(error);
      this.pdfUrl = undefined;
      this.matSnackBar.open(
        await firstValueFrom(this.translateService.get('createExam.examCreationFailed')),
        await firstValueFrom(this.translateService.get('createExam.close')),
        { horizontalPosition: 'right' }
      );
    }
    this.isCreatingPdf = false;
  }
}
