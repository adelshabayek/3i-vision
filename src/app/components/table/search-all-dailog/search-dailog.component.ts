// src/app/components/table/search-dailog/search-dailog.component.ts
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-dailog',
  templateUrl: './search-dailog.component.html',
  styleUrls: ['./search-dailog.component.scss'],
})
export class SearchDailogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SearchDailogComponent>
  ) {
    this.form = this.fb.group({
      code: [''],
      name: [''],
      ip: [''],
      mode: ['OR'], // نستخدم mode هنا أيضاً
    });
  }

  onSearch(): void {
    this.dialogRef.close(this.form.value); // يرجع { code, name, ip, mode }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
