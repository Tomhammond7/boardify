import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDialogComponent } from './column-dialog.component';

describe('ColumnDialogComponent', () => {
  let component: ColumnDialogComponent;
  let fixture: ComponentFixture<ColumnDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnDialogComponent]
    });
    fixture = TestBed.createComponent(ColumnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});