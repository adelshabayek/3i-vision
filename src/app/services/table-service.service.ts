import { Injectable } from '@angular/core';
import { Itable } from '../modules/itable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class TableService {

   private ELEMENT_DATA: Itable[] = [
    { position: 1,code: 2, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2,code: 1, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3,code: 2, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4,code: 2, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5,code: 2, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6,code: 1, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  ];

  constructor() { }

   getElements(): Itable[] {
    return this.ELEMENT_DATA;
  }

   exportToExcel(): void {
  // تحويل البيانات إلى ورقة Excel
  const WorkSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ELEMENT_DATA);

  // إنشاء ملف Excel (Workbook)
  const WorkBook: XLSX.WorkBook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(WorkBook, WorkSheet, 'Sheet1');

  // حفظ الملف
  XLSX.writeFile(WorkBook, 'table.xlsx');
}

}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

