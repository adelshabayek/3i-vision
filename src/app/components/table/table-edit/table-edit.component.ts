import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-table-edit',
  templateUrl: './table-edit.component.html',
  styleUrl: './table-edit.component.scss',
})
export class TableEditComponent {
  form = this.fb.group({
    code: [{ value: '', disabled: true }],
    nameFl: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-Za-z\s]+$/), // English and space
      ],
    ],
    nameSl: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[\u0621-\u064A\s]+$/), // Arabic and space
      ],
    ],
    country: [''],
    city: [''],
    description: [''],
    tags: [[], Validators.required], //  tags required
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TableEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form.patchValue(data); // upload user's data from form
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue()); // back update
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
