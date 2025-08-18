import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss'
})
export class AddDialogComponent {

    constructor(private dialogRef: MatDialogRef<AddDialogComponent>) {}

    close() {
    this.dialogRef.close();
  }
}
