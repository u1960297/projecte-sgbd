import { Component, Input } from '@angular/core';
import { Recipes } from 'src/app/models/recipes.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  @Input() recipe: Recipes = new Recipes();
}
