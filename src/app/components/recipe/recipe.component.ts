import { Component, EventEmitter, Input, Output } from '@angular/core';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { Recipes } from 'src/app/models/recipes.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent {
  @Input() recipe: Recipes = new Recipes();
  @Input() detail: boolean = false;
  @Input() authService: AuthService;
  @Output() closeDetail = new EventEmitter<boolean>();

  recipeForm: boolean = false;
  formMode: string = 'edit';

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  openForm(): void {
    if(this.authService.getCurrentUser()?.uid === this.recipe.authorid) {
      this.recipeForm = true;
      console.log(this.recipe.id);
    }
  }

  closeForm(): void {
    this.recipeForm = false;
    this.closeDetail.emit(true);
  }
}
