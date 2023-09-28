import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchAddFoodComponent} from './search-add-food.component';

describe('SearchAddFoodComponent', () => {
  let component: SearchAddFoodComponent;
  let fixture: ComponentFixture<SearchAddFoodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAddFoodComponent]
    });
    fixture = TestBed.createComponent(SearchAddFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
