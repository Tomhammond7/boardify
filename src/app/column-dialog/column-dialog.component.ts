import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './column-dialog.component.html',
  styleUrls: ['./column-dialog.component.less']
})
export class ColumnDialogComponent {
  constructor(public dialogRef: MatDialogRef<ColumnDialogComponent>) {}

  addCard() {
    this.dialogRef.close('add-card');
  }

  orderItems() {
    this.dialogRef.close('order-items');
  }
}
