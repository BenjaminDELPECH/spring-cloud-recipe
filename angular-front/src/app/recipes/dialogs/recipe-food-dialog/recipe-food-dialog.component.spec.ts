import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecipeFoodDialogComponent} from './recipe-food-dialog.component';

describe('RecipeFoodDialogComponent', () => {
  let component: RecipeFoodDialogComponent;
  let fixture: ComponentFixture<RecipeFoodDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeFoodDialogComponent]
    });
    fixture = TestBed.createComponent(RecipeFoodDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
