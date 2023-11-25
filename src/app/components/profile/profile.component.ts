import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { onAuthStateChanged } from 'firebase/auth';
import {UserData} from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { PhotosService } from 'src/app/services/photos.service'; // adjust the path as needed
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { Auth, getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userData: UserData | null = null;

  constructor(private auth: Auth, private authService: AuthService, private router: Router, private PhotosService: PhotosService) {
    // Escoltem els canvis d'estat d'autenticació de l'usuari
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Si l'usuari està autenticat, obtenim les seves dades d'autenticació
        const userAuth = this.authService.getCurrentUser();
        if (userAuth) {
          // Si tenim les dades d'autenticació de l'usuari, obtenim les seves dades de Firestore
          this.userData = await this.authService.fetchUserDataFromFirestore(user.uid);
        }
      } else {
        // Si l'usuari no està autenticat, el redirigim a la pàgina de login
        this.router.navigate(['/login']);
      }
    });
  }

  async uploadProfileImage(event: Event) {
    // Obtenim l'usuari actual de Firebase
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
  
    // Comprovem que l'usuari està autenticat i que tenim les seves dades
    if(this.userData && firebaseUser){
      const inputElement = event.target as HTMLInputElement;
      if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        const uid = firebaseUser.uid;
        const filePath = `/profile/${uid}`;
  
        // Pugem la imatge al servidor
        this.PhotosService.uploadImage(filePath, file).then((url: string) => {
          // Actualitzem la imatge de l'usuari a la nostra aplicació
          if (this.userData) {
            this.userData.image = url;
          }
  
          // Actualitzem la imatge de l'usuari a Firestore
          const db = getFirestore();
          const userRef = doc(db, "users", uid);
          updateDoc(userRef, {
            image: url
          }).then(() => {
            console.log('Imatge de l\'usuari actualitzada correctament');
          }).catch((error) => {
            console.error('Error actualitzant la imatge de l\'usuari: ', error);
          });
        }).catch((error) => {
          console.error('Error pujant la imatge: ', error);
        });
      }
    }
  }
  
  async updateUserName(newName: string) {
    // Obtenim l'ID de l'usuari actual
    const uid = this.authService.getCurrentUserUID();
    if (uid) {
      const db = getFirestore();
      const userRef = doc(db, "users", uid);
  
      // Actualitzem el nom de l'usuari a Firestore
      await updateDoc(userRef, {
        name: newName
      });
      console.log('Nom de l\'usuari actualitzat correctament');
  
      // Actualitzem el nom de l'usuari a la nostra aplicació
      if (this.userData) {
        this.userData.name = newName;
      }
    } else {
      console.error('Error actualitzant el nom de l\'usuari: L\'usuari no està autenticat');
    }
  }
}