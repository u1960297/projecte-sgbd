import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRecipeComponent } from './form-recipe.component';

describe('FormRecipeComponent', () => {
  let component: FormRecipeComponent;
  let fixture: ComponentFixture<FormRecipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormRecipeComponent]
    });
    fixture = TestBed.createComponent(FormRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
