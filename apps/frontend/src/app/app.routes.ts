import type { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateExamComponent } from './components/createExam/createExam.component';

export const routes: Routes = [
  { path: 'create_exam', component: CreateExamComponent },
  { path: '', component: HomeComponent },
];
