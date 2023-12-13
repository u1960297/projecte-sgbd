import { Component, EventEmitter, Input, Output } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getFirestore } from 'firebase/firestore';
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
     }
  }

  isOwnRecipe(): boolean {
    console.log("id de la recepta " + this.recipe.id);
    return this.authService.getCurrentUser()?.uid === this.recipe.authorid;
  }

  closeForm(): void {
    this.recipeForm = false;
    this.closeDetail.emit(true);
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    const db = getFirestore();
    
    // Delete the recipe from the recipes collection
    await deleteDoc(doc(db, 'recipes', recipeId));
    
    // Delete the recipe from the user's recipes collection
    const userId = this.authService.getCurrentUser()?.uid;
    if (userId) {
      await deleteDoc(doc(db, `users/${userId}/recipes`, recipeId));
    }
    this.closeForm();
  }

}
