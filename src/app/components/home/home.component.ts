import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Recipes } from '../../models/recipes.model';
import { Ingredients } from '../../models/ingredients.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { getFirestore, doc, setDoc, updateDoc, where, DocumentData, Query, query } from "firebase/firestore";
import { collection, getDoc, getDocs } from '@angular/fire/firestore';
import { Auth, getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public isLoggedIn: boolean = false;
  private db = getFirestore();
  logo: string = '/assets/images/easychef.png';
  showRecipe: boolean = false;
  currentRecipe: Recipes = new Recipes;
  showFilters: boolean = false;
  showRemoveFilters: boolean = false;

  recipeForm: boolean = false;
  formMode: string = ''; // formMode = 'new' per crear recepta i 'edit' per editarla

  filterName: string = '';
  filterDuration: number = 0;
  selectedDifficulty: string = '';
  selectedTime: string = '';
  receipts: Recipes[] = [];
  filteredReceipts: Recipes[] = [];

  times = [
    {name: 'minuts', value: 'minuts'},
    {name: 'hores', value: 'hores'}
  ];


  constructor(private router: Router, public authService: AuthService, private afAuth: Auth) {
    this.afAuth.onAuthStateChanged(user => {
      this.isLoggedIn = !!user;
    });
  }

  async ngOnInit(): Promise<void> {
    this.receipts = await this.getReceptes(); // Crida a la firebase per obtenir receptes.
    this.filteredReceipts = this.receipts;
  }

  goToLogin(): void { // Metode per anar al login.
    this.router.navigate(['/login']);
  }

  logout(): void { // Metode per fer logout.
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async getReceptes(): Promise<Recipes[]> {
    const recipesRef = collection(this.db, "recipes");
    let firebaseQuery: Query<DocumentData> = recipesRef; // Canviem el nom de la variable a 'firebaseQuery'
  
    // Aplica els filtres a la consulta
    if (this.filterName) {
      firebaseQuery = query(firebaseQuery, where('name', '>=', this.filterName), where('name', '<=', this.filterName + '\uf8ff'));
    }
    if (this.filterDuration) {
      console.log(this.filterDuration + " " + this.selectedTime);
      firebaseQuery = query(firebaseQuery, where('time', '==', this.filterDuration + " " + this.selectedTime));
    }
    if (this.selectedDifficulty) {
      firebaseQuery = query(firebaseQuery, where('difficulty', '==', this.selectedDifficulty));
    }
  
    const querySnapshot = await getDocs(firebaseQuery);
    const receptes: Recipes[] = [];
  
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      const recepta = { id: doc.id, ...doc.data() } as Recipes;
      receptes.push(recepta);
    });
  
    return receptes as Recipes[];
  }
  

  goToProfile(): void { // Metode per anar al perfil.
    this.router.navigate(['/profile']);
  }

  goToReceipt(receipt: Recipes): void {
    this.recipeForm = false;
    this.showRecipe = true;
    this.currentRecipe = receipt;
  }

  newRecipe() { // Metode per obrir el formulari de recepta
    this.recipeForm = true;
    this.formMode = 'new'; 
  }

  closeDetail() {
    this.showRecipe = false;
    this.getReceptes().then((receptes) => {
      this.receipts = receptes;
      this.filteredReceipts = receptes;
    });
  }

  closeForm() { 
    this.recipeForm = false;
    this.getReceptes().then((receptes) => {
      this.receipts = receptes;
      this.filteredReceipts = receptes;
    });
  }

  goToFilters(): void{
    this.showFilters = true;
  }

  filterDifficulty(difficulty: string): void{
    this.selectedDifficulty = difficulty;
  }

  applyFilters(): void{
    this.getReceptes().then(async (receptes) => {
      this.filteredReceipts = await this.getReceptes();
      this.showFilters = false;
      if(this.filteredReceipts !== this.receipts)
        this.showRemoveFilters = true;
    });
  }

  removeFilters(): void{
    this.filteredReceipts = this.receipts;
    this.showRemoveFilters = false;
    this.showFilters = false;
    this.filterName = '';
    this.selectedDifficulty = '';
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
