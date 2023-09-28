import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NutritionalValuesComponent} from './nutritional-values.component';

describe('NutritionalValuesComponent', () => {
  let component: NutritionalValuesComponent;
  let fixture: ComponentFixture<NutritionalValuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NutritionalValuesComponent]
    });
    fixture = TestBed.createComponent(NutritionalValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
