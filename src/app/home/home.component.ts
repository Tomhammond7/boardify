// import { Component, ChangeDetectorRef, OnInit, ElementRef, ViewChild} from '@angular/core';
// import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
// import { MatDialog } from '@angular/material/dialog';
// import { ItemDialogComponent } from '../item-dialog/item-dialog.component';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.less']
// })
// export class HomeComponent implements OnInit {
//   todoItems: { value: string, editing: boolean }[] = [
//     { value: 'Item 1', editing: false },
//     { value: 'Item 2', editing: false },
//     { value: 'Item 3', editing: false }
//   ];
//   inProgressItems: { value: string; editing: boolean; }[] = [];
//   doneItems: { value: string; editing: boolean; }[] = [];
//   newTodoItem: string = '';
//   newInProgressItem: string = '';
//   newDoneItem: string = '';
//   todoAdding: boolean = false;
//   inProgressAdding: boolean = false;
//   doneAdding: boolean = false;
//   @ViewChild('todoBtn') todoBtn!: ElementRef;
//   @ViewChild('inProgressBtn') inProgressBtn!: ElementRef;
//   @ViewChild('doneBtn') doneBtn!: ElementRef;

//   constructor(private cdr: ChangeDetectorRef, 
//     private dialog: MatDialog, 
//     private elementRef: ElementRef) {}

//   ngOnInit(): void {
//     this.loadDataFromLocalStorage();
//   }

//   drop(event: CdkDragDrop<{ value: string; editing: boolean; }[]>) {
//     if (event.container.data) {
//       if (event.previousContainer === event.container) {
//         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//       } else {
//         transferArrayItem(
//           event.previousContainer.data,
//           event.container.data,
//           event.previousIndex,
//           event.currentIndex
//         );

//         this.saveChangesToLocalStorage();
//       }
//     }
//   }

//   openTodoDialog(): void {
//     this.openDialog(this.todoBtn.nativeElement as HTMLElement);
//   }

//   openInProgressDialog(): void {
//     this.openDialog(this.inProgressBtn.nativeElement as HTMLElement);
//   }

//   openDoneDialog(): void {
//     this.openDialog(this.doneBtn.nativeElement as HTMLElement);
//   }

//   private openDialog(buttonRef: HTMLElement): void {
//     const rect = buttonRef.getBoundingClientRect();

//     const dialogPosition = {
//       top: `${rect.bottom}px`,
//       left: `${rect.left}px`
//     };

//     const dialogRef = this.dialog.open(ItemDialogComponent, {
//       width: '300px',
//       height: '500px',
//       position: dialogPosition,
//       panelClass: 'item-dialog'
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('Dialog closed with result:', result);
//     });
//   }

//   addNewItem(list: any[], newItemValue: string, type: string) {
//     if (newItemValue.trim() !== '') {
//       list.push({ value: newItemValue, editing: false });

//       if (type === 'todo') {
//         this.newTodoItem = '';
//       } else if (type === 'inProgress') {
//         this.newInProgressItem = '';
//       } else if (type === 'done') {
//         this.newDoneItem = '';
//       }
//       this.saveChangesToLocalStorage();
//     }
//     this.closeNewItemDiv(type);
//   }

//   updateItem(list: any[], index: number) {
//     list[index].editing = false;
//     this.saveChangesToLocalStorage();
//   }

//   startEditing(item: { value: string, editing: boolean }) {
//     item.editing = true;
//   }

//   startAdding(type: string) {
//     if (type === 'todo') {
//       this.todoAdding = true;
//     } else if (type === 'inProgress') {
//       this.inProgressAdding = true;
//     } else if (type === 'done') {
//       this.doneAdding = true;
//     }
//   }

//   closeNewItemDiv(type: string) {
//     if (type === 'todo') {
//       this.todoAdding = !this.todoAdding;
//     } else if (type === 'inProgress') {
//       this.inProgressAdding = !this.inProgressAdding;
//     } else if (type === 'done') {
//       this.doneAdding = !this.doneAdding;
//     }
//   }

//   saveChanges(index: number, list: any[]) {
//     list[index].editing = false;
//     this.saveChangesToLocalStorage();
//   }

//   saveChangesToLocalStorage() {
//     localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
//     localStorage.setItem('inProgressItems', JSON.stringify(this.inProgressItems));
//     localStorage.setItem('doneItems', JSON.stringify(this.doneItems));
//   }

//   loadDataFromLocalStorage() {
//     const todoItems = localStorage.getItem('todoItems');
//     const inProgressItems = localStorage.getItem('inProgressItems');
//     const doneItems = localStorage.getItem('doneItems');

//     if (todoItems) {
//       this.todoItems = JSON.parse(todoItems);
//     }

//     if (inProgressItems) {
//       this.inProgressItems = JSON.parse(inProgressItems);
//     }

//     if (doneItems) {
//       this.doneItems = JSON.parse(doneItems);
//     }
//   }
// }

import { Component, ChangeDetectorRef, OnInit, ElementRef, ViewChild} from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  columns: { name: string, items: { value: string, editing: boolean }[], adding: boolean }[] = [];

  newColumnTitle: string = '';
  newItemValue: string = '';
  newItemValues: { [key: string]: string } = {};
  addNewColumn: boolean = false;

  @ViewChild('addColumnBtn') addColumnBtn!: ElementRef;

  constructor(private cdr: ChangeDetectorRef, 
    private dialog: MatDialog, 
    private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.loadDataFromLocalStorage();
  }

  initializeColumns() {
    if (!localStorage.getItem('columns')) {
      this.columns = [
        { name: 'To do', items: [], adding: false },
        { name: 'In Progress', items: [], adding: false },
        { name: 'Done', items: [], adding: false }
      ];
      this.saveChangesToLocalStorage();
    }
  }

  drop(event: CdkDragDrop<{ value: string; editing: boolean; }[]>, columnIndex: number) {
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

  dropColumn(event: CdkDragDrop<string[]>) {
    console.log(event.container.data);
    console.log('here');
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }  

  openDialog(buttonRef: HTMLElement): void {
    const rect = buttonRef.getBoundingClientRect();

    const dialogPosition = {
      top: `${rect.bottom}px`,
      left: `${rect.left}px`
    };

    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '300px',
      height: '500px',
      position: dialogPosition,
      panelClass: 'item-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  addNewItem(columnIndex: number) {
    const newItemValue = this.newItemValues[this.columns[columnIndex].name];
    if (newItemValue && newItemValue.trim() !== '') {
      this.columns[columnIndex].items.push({ value: newItemValue, editing: false });
      this.saveChangesToLocalStorage();
      this.newItemValues[this.columns[columnIndex].name] = '';
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
      const orderedColumns = this.columns;
    
      orderedColumnNames.forEach(columnName => {
        const foundColumn = this.columns.find(column => column.name === columnName);
        if (foundColumn) {
          orderedColumns.push(foundColumn);
        }
      });
    
      this.columns = orderedColumns;
    }
    
  }
}
