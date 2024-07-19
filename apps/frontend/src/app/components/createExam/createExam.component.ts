import { Component, OnInit, inject/*, ElementRef, ViewChild*/ } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PyodideService } from '../../services/pyodide.service';
import { LatexService } from '../../services/latex.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderComponent } from '../../components/common/loader/loader.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import type { PageEvent } from '@angular/material/paginator';
import { ProgressComponent } from '../../components/common/progress/progress.component';
import { ExerciseService } from '../../services/exercise.service';

interface Exercises {
  id: number;
  name: string;
  description: string;
  quantity: number;
}

@Component({
  selector: 'app-create-exam',
  templateUrl: './createExam.component.html',
  styleUrl: './createExam.component.css',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    LoaderComponent,
    MatPaginatorModule,
    ProgressComponent
  ],
})
export class CreateExamComponent implements OnInit {
  /* @ViewChild('iframeRef', { static: false }) iframeRef!: ElementRef;
  iframeWindow!: Window; */
  latex = inject(LatexService);
  pyodide = inject(PyodideService);
  exerciseService = inject(ExerciseService);
  
  showLoader = false;
  filters = {
    query: '',
    itemsPerPage: 25,
    itemsPerOptions: [10, 25, 50, 100],
    page: 0,
    totalPages: 1,
    totalExercises: 0,
  };
  queryTimeout = NaN;
  isAtLeastOneExerciseSelectedWithQuantityNotZero = false;
  exercises = {
    unselected: [] as Exercises[],
    selected: [] as Exercises[],
  };
  headerPythonCode: string | undefined = undefined;
  pdfUrl: undefined | SafeResourceUrl = undefined;
  sanitizer = inject(DomSanitizer)

  async updateExercises(query: string, page: number, pageSize: number) {
    this.showLoader = true;

    const json = await this.pyodide.fetchExercisesByPage(['id', 'name', 'description'], query, page, pageSize);

    const exercises = json.exercises.map((exercise) => {
      return {
        ...exercise,
        quantity: 0,
      };
    });
    this.filters.totalExercises = json.total;

    const usedIds = this.exercises.selected.map((exercise) => exercise.id);
    this.exercises.unselected = exercises.filter((exercise) => !usedIds.includes(exercise.id));

    this.filters.page = page;
    this.filters.itemsPerPage = pageSize;
    this.filters.totalExercises = json.total;
    this.showLoader = false;
  }

  async ngOnInit() {
    this.updateExercises(this.filters.query, this.filters.page, this.filters.itemsPerPage);

    // this.iframeWindow = (this.iframeRef.nativeElement as HTMLIFrameElement).contentWindow as Window;
  }

  handleQueryInput(event: Event) {
    this.filters.query = (event.target as HTMLInputElement).value;
    clearTimeout(this.queryTimeout);
    this.queryTimeout = Number(setTimeout(() => {
      this.updateExercises(this.filters.query, 0, this.filters.itemsPerPage);
    }, 1000));
  }

  handlePageEvent(event: PageEvent) {
    this.updateExercises(this.filters.query, event.pageIndex, event.pageSize);
  }

  updateQuantityWithKeyboard(event: KeyboardEvent) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') event.preventDefault();
  }

  updateQuantity(event: Event, id: number) {
    const exercise = this.exercises.selected.find(
      (exerciseInList) => exerciseInList.id === id
    );
    if (exercise === undefined) return;
    exercise.quantity = Number((event.target as HTMLInputElement).value);
    this.isAtLeastOneExerciseSelectedWithQuantityNotZero =
      this.exercises.selected.some((exercise) => exercise.quantity > 0);
  }

  drop(event: CdkDragDrop<Exercises[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.isAtLeastOneExerciseSelectedWithQuantityNotZero =
      this.exercises.selected.some((exercise) => exercise.quantity > 0);
  }

  async createTest() {
    this.showLoader = true

    const idsSelected = this.exercises.selected.filter((exercise) => exercise.quantity > 0).map((exercise) => exercise.id);
    const exercisesPythonCodeData = await this.pyodide.fetchExercisesByIds(['id', 'code'], idsSelected)
      .then(({ exercises }) => {
        const exercisesCompletedUnfiltered = exercises
          .map((exerciseFetched) => {
            const exerciseSelected = this.exercises.selected.find((exerciseSelected) => exerciseSelected.id === exerciseFetched.id);
            if (exerciseSelected === undefined) return;
            return {
              ...exerciseFetched,
              quantity: exerciseSelected.quantity
            };
          });

        const exercisesCompletedFiltered = exercisesCompletedUnfiltered.filter((exercise) => exercise !== undefined) as {
          id: number;
          code: string;
          quantity: number;
        }[];
        return exercisesCompletedFiltered;
      });

    const exercises = exercisesPythonCodeData.map((exercise) => ({
      fnCode: exercise.code,
      quantity: exercise.quantity
    }));

    const pdfUrlData = await this.exerciseService.createExam(exercises, true, Infinity, Infinity);
    if (pdfUrlData.isValid) this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrlData.url);

    this.showLoader = false
  }
}
