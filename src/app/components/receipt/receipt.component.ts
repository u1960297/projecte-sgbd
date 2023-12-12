import { Component, Input } from '@angular/core';
import { Receipts } from 'src/app/models/receipts.model';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent {
  @Input() receipt: Receipts = new Receipts();
  @Input() detail: boolean = true;
}
