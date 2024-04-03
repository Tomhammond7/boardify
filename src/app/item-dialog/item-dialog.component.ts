import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.less']
})
export class ItemDialogComponent {
  constructor(public dialogRef: MatDialogRef<ItemDialogComponent>) {}

  addCard() {
    this.dialogRef.close('add-card');
  }
}
