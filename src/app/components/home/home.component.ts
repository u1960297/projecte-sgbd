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

  async ngOnInit(): Promise<void> {
    this.receipts = await this.getReceptes(); // Crida a la firebase per obtenir receptes.
  }

  goToLogin(): void { // Metode per anar al login.
    this.router.navigate(['/login']);
  }

  logout(): void { // Metode per fer logout.
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  async getReceptes(): Promise<Receipts[]> { // Ara tenim receptes de prova
    const receptes = await this.authService.getReceptes();
    return receptes as Receipts[];
  }

  goToProfile(): void { // Metode per anar al perfil.
    this.router.navigate(['/profile']);
  }

  goToReceipt(receipt: Receipts): void { // Metode per anar al perfil.
    this.showRecipe = true;
    this.currentReceipt = receipt;
  }
}
