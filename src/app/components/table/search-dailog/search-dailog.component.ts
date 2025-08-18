import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-dailog',
  templateUrl: './search-dailog.component.html',
  styleUrl: './search-dailog.component.scss',
})
export class SearchDailogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SearchDailogComponent>
  ) {
    this.form = this.fb.group({
      id: [''],
      name: [''],
      ip: [''],
    });
  }

  onSearch(): void {
    this.dialogRef.close(this.form.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
