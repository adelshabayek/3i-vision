import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchDailogComponent } from './search-all-dailog/search-dailog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SearchLocalDailogComponent } from './search-view-dailog/search-local-dailog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  searchValue: string = '';
  allData: any[] = []; // copy data from local storage
  filteredData: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @Input() dataSource: any[] = []; // data
  editIndex: number | null = null; // to select row to edit
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    // });   ........    I used old file here    .........

    const localData = localStorage.getItem('dataSource');
    this.dataSource = localData ? JSON.parse(localData) : [];
    this.filteredData = new MatTableDataSource(this.dataSource);
    this.loadDataFromStorage();
  }

  ngAfterViewInit() {
    this.filteredData.paginator = this.paginator;
  }

  // refresh from local storage
  loadDataFromStorage(): void {
    const data = JSON.parse(localStorage.getItem('dataSource') || '[]');
    this.allData = Array.isArray(data) ? data : [];
    // update datasource
    this.dataSource = [...this.allData];
    this.filteredData.data = [...this.allData];
    if (this.paginator) this.filteredData.paginator = this.paginator;
  }

  // search from local view
  openSearchLocalDialog(): void {
    const dialogRef = this.dialog.open(SearchLocalDailogComponent, {
      width: '380px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const { code = '', name = '', mode = 'OR' } = result; //  default OR
      const No = this.paginator?.pageSize ?? 5;
      const base = this.allData.slice(0, No);

      const norm = (v: any) =>
        String(v ?? '')
          .toLowerCase()
          .trim();
      const qCode = norm(code);
      const qName = norm(name);

      const filtered = base.filter((item: any) => {
        const matchCode = !qCode || norm(item.code).includes(qCode);
        const matchName =
          !qName ||
          norm(item.nameFl).includes(qName) ||
          norm(item.nameSl).includes(qName);

        return mode === 'OR' ? matchCode && matchName : matchCode || matchName;
      });

      this.filteredData.data = filtered;
      if (this.paginator) this.paginator.firstPage();
    });
  }

  // refresh Button
  onRefresh(): void {
    this.loadDataFromStorage();
    if (this.paginator) this.paginator.firstPage();
  }

  // search from all localstorage
  openSearchAllDialog(): void {
    const dialogRef = this.dialog.open(SearchDailogComponent, {
      width: '380px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const { code = '', name = '', ip = '', mode = 'OR' } = result; //  default OR

      const norm = (v: any) =>
        String(v ?? '')
          .toLowerCase()
          .trim();
      const qCode = norm(code);
      const qName = norm(name);
      const qIp = norm(ip);

      const filtered = this.allData.filter((item: any) => {
        const matchCode = !qCode || norm(item.code).includes(qCode);
        const matchName =
          !qName ||
          norm(item.nameFl).includes(qName) ||
          norm(item.nameSl).includes(qName);
        const matchIp = !qIp || norm(item.ip).includes(qIp);

        // 
        return mode === 'OR'
          ? matchCode && matchName && matchIp
          : matchCode || matchName || matchIp;
      });

      this.filteredData.data = filtered;
      if (this.paginator) this.paginator.firstPage();
    });
  }
  // end search

  // start filter search
  applyAdvancedFilter(id: number | null, name: string): void {
    if (!id && !name) {
      this.filteredData = new MatTableDataSource(this.dataSource);
      this.filteredData.paginator = this.paginator;
      return;
    }

    const filtered = this.dataSource.filter(
      (item) =>
        (id ? item.id === id : true) &&
        (name
          ? item.nameFl?.toLowerCase().includes(name.toLowerCase()) ||
            item.nameSl?.toLowerCase().includes(name.toLowerCase())
          : true)
    );
    this.filteredData = new MatTableDataSource(filtered);
    this.filteredData.paginator = this.paginator;
  }
  // end filter search

  // start edit user
  editUser(user: any) {
    // with id
    this.router.navigate(['/edit-table', user.id]);

    // with code
    // this.router.navigate(['/edit-table', user.code]);
  }

  // delete row
  deleteUser(index: number): void {
    const item = this.filteredData.data[index];
    if (!item) return;

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '350px',
      data: { message: `Are you sure to delete "${item.nameFl}" ?` },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const id = item.id;
        const idx = this.allData.findIndex((x) => String(x.id) === String(id));
        if (idx > -1) {
          this.allData.splice(idx, 1);
          localStorage.setItem('dataSource', JSON.stringify(this.allData));
          this.loadDataFromStorage();
        }
      }
    });
  }

  // add row
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
      this.filteredData = new MatTableDataSource(this.dataSource);
      this.filteredData.paginator = this.paginator;

      // reset form
      this.form.reset({
        code: 'USR-' + Math.floor(1000 + Math.random() * 9000),
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
