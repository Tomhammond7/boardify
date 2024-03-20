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
  todoItems: { value: string, editing: boolean }[] = [
    { value: 'Item 1', editing: false },
    { value: 'Item 2', editing: false },
    { value: 'Item 3', editing: false }
  ];
  inProgressItems: { value: string; editing: boolean; }[] = [];
  doneItems: { value: string; editing: boolean; }[] = [];
  newTodoItem: string = '';
  newInProgressItem: string = '';
  newDoneItem: string = '';
  todoAdding: boolean = false;
  inProgressAdding: boolean = false;
  doneAdding: boolean = false;
  @ViewChild('todoBtn') todoBtn!: ElementRef;
  @ViewChild('inProgressBtn') inProgressBtn!: ElementRef;
  @ViewChild('doneBtn') doneBtn!: ElementRef;

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.loadDataFromLocalStorage();
  }

  drop(event: CdkDragDrop<{ value: string; editing: boolean; }[]>) {
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

  openTodoDialog(): void {
    this.openDialog(this.todoBtn.nativeElement as HTMLElement);
  }

  openInProgressDialog(): void {
    this.openDialog(this.inProgressBtn.nativeElement as HTMLElement);
  }

  openDoneDialog(): void {
    this.openDialog(this.doneBtn.nativeElement as HTMLElement);
  }

  private openDialog(buttonRef: HTMLElement): void {
    const rect = buttonRef.getBoundingClientRect();

    const dialogPosition = {
      top: `${rect.bottom}px`,
      left: `${rect.left}px`
    };

    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '250px',
      height: '500px',
      position: dialogPosition,
      panelClass: 'item-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  addNewItem(list: any[], newItemValue: string, type: string) {
    if (newItemValue.trim() !== '') {
      list.push({ value: newItemValue, editing: false });

      if (type === 'todo') {
        this.newTodoItem = '';
      } else if (type === 'inProgress') {
        this.newInProgressItem = '';
      } else if (type === 'done') {
        this.newDoneItem = '';
      }
      this.saveChangesToLocalStorage();
    }
    this.closeNewItemDiv();
  }

  updateItem(list: any[], index: number) {
    list[index].editing = false;
    this.saveChangesToLocalStorage();
  }

  startEditing(item: { value: string, editing: boolean }) {
    item.editing = true;
  }

  startAdding(type: string) {
    if (type === 'todo') {
      this.todoAdding = true;
    } else if (type === 'inProgress') {
      this.inProgressAdding = true;
    } else if (type === 'done') {
      this.doneAdding = true;
    }
  }

  closeNewItemDiv() {
    this.todoAdding = false;
    this.inProgressAdding = false;
    this.doneAdding = false;
  }

  saveChanges(index: number, list: any[]) {
    list[index].editing = false;
    this.saveChangesToLocalStorage();
  }

  saveChangesToLocalStorage() {
    localStorage.setItem('todoItems', JSON.stringify(this.todoItems));
    localStorage.setItem('inProgressItems', JSON.stringify(this.inProgressItems));
    localStorage.setItem('doneItems', JSON.stringify(this.doneItems));
  }

  loadDataFromLocalStorage() {
    const todoItems = localStorage.getItem('todoItems');
    const inProgressItems = localStorage.getItem('inProgressItems');
    const doneItems = localStorage.getItem('doneItems');

    if (todoItems) {
      this.todoItems = JSON.parse(todoItems);
    }

    if (inProgressItems) {
      this.inProgressItems = JSON.parse(inProgressItems);
    }

    if (doneItems) {
      this.doneItems = JSON.parse(doneItems);
    }
  }
}
