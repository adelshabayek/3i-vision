import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TableComponent } from './componante/table/table.component';
import { TableAddComponent } from './componante/table/table-add/table-add.component';

const routes: Routes = [
  { path: '', component: TableComponent  },
  { path: 'add-table', component: TableAddComponent },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
