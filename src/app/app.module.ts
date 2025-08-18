import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { TableComponent } from './components/table/table.component';
import { TableEditComponent } from './components/table/table-edit/table-edit.component';
import { TableAddComponent } from './components/table/table-add/table-add.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { IpPipePipe } from './pipe/ip-pipe.pipe';
import { MatDialogActions } from "@angular/material/dialog";
import { MatDialogModule , MatDialogRef} from '@angular/material/dialog';
import { ChipsModule } from 'primeng/chips';
import { AddDialogComponent } from './components/table/add-dialog/add-dialog.component';
import { EditDailogComponent } from './components/table/edit-dailog/edit-dailog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchDailogComponent } from './components/table/search-dailog/search-dailog.component';
import { MatChip } from "@angular/material/chips";
import { MultiSelectModule } from 'primeng/multiselect';

import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DeleteDialogComponent } from './components/table/delete-dialog/delete-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    TableComponent,
    TableEditComponent,
    TableAddComponent,
    IpPipePipe,
    AddDialogComponent,
    EditDailogComponent,
    SearchDailogComponent,
    DeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogModule,
    ChipsModule,
    MatToolbarModule,
    MatChip,
    MatChipsModule,
    MultiSelectModule,
    MatPaginatorModule,
    MatSortModule,
],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


