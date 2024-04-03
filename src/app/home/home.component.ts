import { Component, ChangeDetectorRef, OnInit, ElementRef, ViewChild} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ColumnDialogComponent } from '../column-dialog/column-dialog.component';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  columns: { name: string, items: { value: string, editing: boolean, dateAdded: Date }[], adding: boolean }[] = [];
  newColumnTitle: string = '';
  newItemValue: string = '';
  newItemValues: { [key: string]: string } = {};
  addNewColumn: boolean = false;
  selectedColumnIndex: number | null = null;

  @ViewChild('addColumnBtn') addColumnBtn!: ElementRef;

  constructor(private cdr: ChangeDetectorRef, 
    private dialog: MatDialog, 
    private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadDataFromLocalStorage();
  }

  initializeColumns() {
    const columnsFromLocalStorage = localStorage.getItem('columns');
    
    if (!columnsFromLocalStorage) {
      this.columns = [
        { name: 'To do', items: [], adding: false },
        { name: 'In Progress', items: [], adding: false },
        { name: 'Done', items: [], adding: false }
      ];
      this.saveChangesToLocalStorage();
    } else {
      this.columns = JSON.parse(columnsFromLocalStorage);
    }
  }

  drop(event: CdkDragDrop<{ value: string; editing: boolean; dateAdded: Date }[]>, columnIndex: number) {
    if (event.container.data) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );

        this.saveChangesToLocalStorage();
      }
    }
  }

  openDialog(buttonRef: HTMLElement, columnIndex: number): void {
    const rect = buttonRef.getBoundingClientRect();
    this.selectedColumnIndex = columnIndex;

    const dialogPosition = {
      top: `${rect.bottom}px`,
      left: `${rect.left}px`
    };

    const dialogRef = this.dialog.open(ColumnDialogComponent, {
      width: '300px',
      height: '500px',
      position: dialogPosition,
      panelClass: 'column-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case "add-card":
          this.openAddCard(columnIndex);
        break;
        case "order-items":
          this.orderItems(columnIndex);
        break;
      }
    });
  }

  openCard(columnIndex: number, item: any, columnName: string): void {
    this.selectedColumnIndex = columnIndex;

    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '800px',
      height: '850px',
      panelClass: 'item-dialog',
      data: { item: item, columnName: columnName}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  openAddCard(columnIndex: number): void {
    this.columns[columnIndex].adding = true;
    this.dialog.closeAll;
  }

  orderItems(columnIndex: number): void {
    const columnItems = this.columns[columnIndex].items;

    columnItems.sort((a, b) => {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });

    this.columns[columnIndex].items = columnItems;
  }

  addNewItem(columnIndex: number) {
    const newItemValue = this.newItemValues[this.columns[columnIndex].name];
    if (newItemValue && newItemValue.trim() !== '') {
      this.columns[columnIndex].items.push({ value: newItemValue, editing: false, dateAdded: new Date() });
      this.saveChangesToLocalStorage();
      this.newItemValues[this.columns[columnIndex].name] = '';

      this.columns[columnIndex].adding = false;
    }
  }

  updateItem(columnIndex: number, itemIndex: number) {
    this.columns[columnIndex].items[itemIndex].editing = false;
    this.saveChangesToLocalStorage();
  }

  startEditing(columnIndex: number, itemIndex: number) {
    this.columns[columnIndex].items[itemIndex].editing = true;
  }

  startAdding(columnIndex: number) {
    this.columns[columnIndex].adding = true;
  }

  closeNewItemDiv(columnType: string) {
    const columnIndex = this.columns.findIndex(column => column.name === columnType);
    if (columnIndex !== -1) {
        this.columns[columnIndex].adding = false;
        this.newItemValues[columnType] = '';
    }
  }

  closeColumnInput() {
    this.addNewColumn = false;
    this.newColumnTitle = '';
  }

  getColumnIndex(columnType: string): number {
    return this.columns.findIndex(column => column.name === columnType);
  }

  createNewColumn() {
    if (this.newColumnTitle.trim() !== '') {
      this.columns.push({
        name: this.newColumnTitle,
        items: [],
        adding: false
      });
      this.newColumnTitle = '';
      this.saveChangesToLocalStorage();
    }
    this.addNewColumn = false;
  }

  openColumnInput() {
    this.addNewColumn = true;
  }

  saveChanges(index: number, listIndex: number) {
    this.columns[index].items[listIndex].editing = false;
    this.saveChangesToLocalStorage();
  }

  saveChangesToLocalStorage() {
    const columnOrder = this.columns.map(column => column.name);

    localStorage.setItem('columns', JSON.stringify(this.columns));
    localStorage.setItem('columnOrder', JSON.stringify(columnOrder));
  }

  loadDataFromLocalStorage() {
    const columnsData = localStorage.getItem('columns');
    const columnOrder = localStorage.getItem('columnOrder');

    if (columnsData) {
        this.columns = JSON.parse(columnsData);
    }

    if (columnOrder) {
        const orderedColumnNames: string[] = JSON.parse(columnOrder);
        this.columns = orderedColumnNames.map(columnName =>
            this.columns.find(column => column.name === columnName)
        ).filter(column => column) as { name: string, items: { value: string, editing: boolean, dateAdded: Date }[], adding: boolean }[];
    }
  }
}
