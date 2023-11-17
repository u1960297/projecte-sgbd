import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Receipts } from '../../models/receipts.model';
import { Ingredients } from '../../models/ingredients.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public showRecipe: boolean = false;
  public currentReceipt: Receipts = new Receipts;
  receipts: Receipts[] = [];

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    
    this.receipts = this.getReceptes(); // Crida a la firebase per obtenir receptes.
  }

  goToLogin(): void { // Metode per anar al login.
    this.router.navigate(['/login']);
  }

  logout(): void { // Metode per fer logout.
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getReceptes(): Receipts[] { // Ara tenim receptes de prova

    const ingredients1: Ingredients[] = [
      { id: 1, name: "Farina" },
      { id: 2, name: "Ous" },
      { id: 3, name: "Llevat" },
    ];
    
    const ingredients2: Ingredients[] = [
      { id: 4, name: "Carn de pollastre" },
      { id: 5, name: "Ceba" },
      { id: 6, name: "Espècies" },
    ];
    
    const ingredients3: Ingredients[] = [
      { id: 7, name: "Arros" },
      { id: 8, name: "Tomàquet" },
      { id: 9, name: "Oli d'oliva" },
    ];

    const testReceipt: Receipts[] = [ // Receptes de prova
      { id: 1, name: "Pa de casa", ingredients: ingredients1, description:"Aquesta recepta es el pa de casa", difficulty: "Mitjana", time: "2 hores", image: 'assets/images/pa.png' },
      { id: 2, name: "Pollastre al forn", ingredients: ingredients2, description:"Aquesta recepta es el pollastre al forn", difficulty: "Fàcil", time: "1 hora", image: 'assets/images/pollastre.png' },
      { id: 3, name: "Paella", ingredients: ingredients3, description:"Aquesta recepta es la paella", difficulty: "Mitjana", time: "45 minuts", image: 'assets/images/paella.png' },
      { id: 4, name: "Tiramisú", ingredients: ingredients1, description:"Aquesta recepta es el tiramisu", difficulty: "Fàcil", time: "4 hores", image: 'assets/images/tiramisu.png' },
    ];

    return testReceipt;
  }

  goToProfile(): void { // Metode per anar al perfil.
    this.router.navigate(['/profile']);
  }

  goToReceipt(receipt: Receipts): void { // Metode per anar al perfil.
    this.showRecipe = true;
    this.currentReceipt = receipt;
  }
}
