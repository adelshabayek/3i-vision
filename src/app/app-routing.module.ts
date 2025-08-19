import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { TableAddComponent } from './components/table/table-add-edit/table-add.component';

const routes: Routes = [
  { path: '', component: TableComponent },
  { path: 'add-table', component: TableAddComponent },
  { path: 'edit-table/:id', component: TableAddComponent }, // تعديل

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
