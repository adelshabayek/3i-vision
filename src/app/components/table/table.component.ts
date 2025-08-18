import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditDailogComponent } from './edit-dailog/edit-dailog.component';
import { SearchDailogComponent } from './search-dailog/search-dailog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  form!: FormGroup;
  searchValue: string = '';
  filteredData: any[] = [];
  @Input() dataSource: any[] = []; // data
  editIndex: number | null = null; // to select row to edit

  displayedColumns: string[] = [
    'No.',
    'code',
    'nameFl',
    'nameSl',
    'tags',
    'country',
    'city',
    'description',
    'actions',
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.http.get<any[]>('assets/data/data.json').subscribe(data => {
    //   this.dataSource = data;
    // });
    const localData = localStorage.getItem('dataSource');
    this.dataSource = localData ? JSON.parse(localData) : [];
    this.filteredData = [...this.dataSource]; // complete table in first
    this.loadDataFromStorage();
  }

  // refresh from local storage
  loadDataFromStorage(): void {
    const data = JSON.parse(localStorage.getItem('dataSource') || '[]');
    this.dataSource = Array.isArray(data) ? data : [];
    this.filteredData = [...this.dataSource];
  }

  // refresh Button
  onRefresh(): void {
    this.loadDataFromStorage();
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(SearchDailogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { id, name, ip } = result;

        this.filteredData = this.dataSource.filter((item) => {
          return (
            (!id || item.id === +id) &&
            (!name ||
              item.nameFl?.toLowerCase().includes(name.toLowerCase())) &&
            (!ip || item.ip?.includes(ip))
          );
        });
      }
    });
  }
  // end search

  // start filter search
  applyAdvancedFilter(id: number | null, name: string): void {
    if (!id && !name) {
      this.filteredData = [...this.dataSource];
      return;
    }

    this.filteredData = this.dataSource.filter(
      (item) =>
        (id ? item.id === id : true) &&
        (name
          ? item.nameFl?.toLowerCase().includes(name.toLowerCase()) ||
            item.nameSl?.toLowerCase().includes(name.toLowerCase())
          : true)
    );
  }
  // end filter search

  // start edit user
  editUser(user: any, index: number) {
    const dialogRef = this.dialog.open(EditDailogComponent, {
      width: '500px',
      data: { ...user },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.dataSource[index] = updated;
        localStorage.setItem('dataSource', JSON.stringify(this.dataSource));

        // update
        this.filteredData = [...this.dataSource];
      }
    });
  }

  // delete
  deleteUser(index: number): void {
    this.dataSource.splice(index, 1);
    localStorage.setItem('dataSource', JSON.stringify(this.dataSource));

    // update
    this.filteredData = [...this.dataSource];
  }

  // add data
  submitForm() {
    if (this.form.valid) {
      const newData = this.form.getRawValue();

      if (this.editIndex !== null) {
        // edit
        this.dataSource[this.editIndex] = newData;
        this.editIndex = null;
      } else {
        // add in top
        this.dataSource.unshift(newData);
      }

      localStorage.setItem('dataSource', JSON.stringify(this.dataSource));
      this.dataSource = [...this.dataSource]; // refresh table

      // reset form
      this.form.reset({
        code: 'Id-' + Math.floor(1000 + Math.random() * 9000),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  // excel
  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Document');
    XLSX.writeFile(workbook, `Document.xlsx`);
  }
}
