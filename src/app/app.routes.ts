import { Routes } from '@angular/router';
import {TodosPageComponent} from './features/todo/todos-page/todos-page.component';

export const routes: Routes = [
  { path: '', component: TodosPageComponent },
  { path: '**', redirectTo: '' },
];
