import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import type { PageEvent } from '@angular/material/paginator';
import { DateComponent } from '../../components/common/date/date.component'; 
import { LoaderComponent } from '../../components/common/loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { PyodideService } from '../../services/pyodide.service';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';


interface Exercise {
  id: number;
  name: string;
  description: string;
  last_modified_date: string;
}

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, MatIconModule, MatPaginatorModule, LoaderComponent, MatInputModule, DateComponent, MatButtonModule, TranslateModule],
})
export class ExercisesComponent implements OnInit {
  pyodide = inject(PyodideService);
  isLoading = true;
  displayedColumns = [
    'id',
    'name',
    'description',
    'last_modified_date',
    'code',
  ];
  exercises: Exercise[] | undefined = undefined;
  filters = {
    query: '',
    itemsPerPage: 25,
    itemsPerOptions: [10, 25, 50, 100],
    page: 0,
    totalPages: 1,
    totalExercises: 0,
  };
  queryTimeout = NaN;

  ngOnInit() {
    this.updateExercises(this.filters.query, this.filters.page, this.filters.itemsPerPage);
  }

  async updateExercises(query: string, page: number, pageSize: number) {
    this.isLoading = true;

    const json = await this.pyodide.fetchExercisesByPage(['id', 'name', 'description', 'last_modified_date'], query, page, pageSize);
    this.exercises = json.exercises;

    this.filters.page = page;
    this.filters.itemsPerPage = pageSize;
    this.filters.totalExercises = json.total;
    this.isLoading = false;
  }

  handlePageEvent(event: PageEvent) {
    this.updateExercises(this.filters.query, event.pageIndex, event.pageSize);
  }

  handleQueryInput(event: Event) {
    this.filters.query = (event.target as HTMLInputElement).value;
    clearTimeout(this.queryTimeout);
    this.queryTimeout = Number(setTimeout(() => {
      this.updateExercises(this.filters.query, 0, this.filters.itemsPerPage);
    }, 1000));
  }
}
