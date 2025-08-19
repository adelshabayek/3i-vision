import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-local-dailog',
  templateUrl: './search-local-dailog.component.html',
})
export class SearchLocalDailogComponent {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SearchLocalDailogComponent>
  ) {
    this.form = this.fb.group({
      code: [''],
      name: [''],
      mode: ['OR'], // AND | OR
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSearch() {
    this.dialogRef.close(this.form.value);
  }
}
