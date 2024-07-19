import type { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { CreateExamComponent } from './components/createExam/createExam.component';

export const routes: Routes = [
  { path: 'exercises', component: ExercisesComponent },
  { path: 'exercise', component: ExerciseComponent },
  { path: 'exercise/:id', component: ExerciseComponent },
  { path: 'create_exam', component: CreateExamComponent },
  { path: '', component: HomeComponent },
];
