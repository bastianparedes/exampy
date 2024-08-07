import type { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CreateExamComponent } from './components/createExam/createExam.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { LogInComponent } from './components/logIn/logIn.component';

export const routes: Routes = [
  { path: 'create_exam', component: CreateExamComponent },
  { path: 'sign_up', component: SignUpComponent },
  { path: 'log_in', component: LogInComponent },
  { path: '', component: HomeComponent }
];
