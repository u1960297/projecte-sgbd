import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipes } from 'src/app/models/recipes.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  @Input() recipe: Recipes = new Recipes();
  @Input() detail: boolean = false;
  @Output() closeDetail = new EventEmitter<boolean>();

  recipeForm: boolean = false;
  formMode: string = 'edit';

  openForm(): void {
    this.recipeForm = true;
    console.log(this.recipe.id);
  }

  closeForm(): void {
    this.recipeForm = false;
    this.closeDetail.emit(true);
  }
}
