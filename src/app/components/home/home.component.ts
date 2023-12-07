import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Receipts } from '../../models/receipts.model';
import { Ingredients } from '../../models/ingredients.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { collection, getDoc, getDocs } from '@angular/fire/firestore';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, public authService: AuthService) {}

  private db = getFirestore();
  showRecipe: boolean = false;
  currentReceipt: Receipts = new Receipts;
  showFilters: boolean = false;
  showRemoveFilters: boolean = false;

  recipeForm: boolean = false;
  formMode: string = ''; // formMode = 'new' per crear recepta i 'edit' per editarla

  filterName: string = '';
  filterDuration: number = 0;
  selectedDifficulty: string = '';
  receipts: Receipts[] = [];
  filteredReceipts: Receipts[] = [];

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

  async getReceptes(): Promise<Receipts[]> { // Ara tenim receptes de prova
    const recipesRef = collection(this.db, "recipes");
    const receptes: Receipts[] = [];
    const querySnapshot = await getDocs(recipesRef);

    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      const recepta = doc.data() as Receipts;
      //Part de filtratge
      if (recepta.name && recepta.name.toLowerCase().indexOf(this.filterName.toLowerCase()) !== -1) {
        if (this.filterDuration === 0 || (recepta.time && (recepta.time.includes('minuts') && +parseInt(recepta.time)/60 <= this.filterDuration || recepta.time.includes('hores') && +parseInt(recepta.time) <= this.filterDuration))) {
          if (this.selectedDifficulty === '' || recepta.difficulty === this.selectedDifficulty) {
            receptes.push(recepta);
          }
        }
      }
    });
    return receptes as Receipts[];
  }

  goToProfile(): void { // Metode per anar al perfil.
    this.router.navigate(['/profile']);
  }

  goToReceipt(receipt: Receipts): void { // Metode per anar al perfil.
    this.showRecipe = true;
    this.currentReceipt = receipt;
  }

  newRecipe() { // Metode per obrir el formulari de recepta
    this.recipeForm = true;
    this.formMode = 'new'; 
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
}
