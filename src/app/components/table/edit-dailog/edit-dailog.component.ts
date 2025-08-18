import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dailog',
  templateUrl: './edit-dailog.component.html',
  styleUrl: './edit-dailog.component.scss'
})
export class EditDailogComponent {
  form: FormGroup;

   constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
        id: [{ value: null, disabled: true }], // id 

     code: [
        {
          value: 'USR-' + Math.floor(1000 + Math.random() * 9000),
          disabled: true,
        },
      ],
      nameFl: ['', [Validators.required, Validators.minLength(3)]],
      nameSl: ['', [Validators.required, Validators.minLength(3)]],
      country: [''],
      city: [''],
      description: [''],
      ip: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/
          ),
        ],
      ], 
      tags: [[], Validators.required],
    });
    // data from form 
    if (data) {
      this.form.patchValue(data);
    }
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
