import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.less']
})
export class ItemDialogComponent {
  constructor(public dialogRef: MatDialogRef<ItemDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private datePipe: DatePipe) {}
}