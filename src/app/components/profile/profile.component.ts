import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {UserData} from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: UserData | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }else {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.user = await this.authService.fetchUserDataFromFirestore(user.uid);
      }
    }
  }

}
