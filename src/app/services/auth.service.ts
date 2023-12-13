import {Auth, GoogleAuthProvider, User, fetchSignInMethodsForEmail, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword,signInWithPopup, signOut, updateProfile} from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Injectable } from '@angular/core';
import { LoginData } from 'src/app/models/login.model';
import {UserData} from 'src/app/models/user.model';
import { collection, getDoc, getDocs } from '@angular/fire/firestore';
import { Recipes } from '../models/recipes.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: UserData | null = null;
  private db = getFirestore();

  constructor(private auth: Auth) {
    onAuthStateChanged(auth, (user) => {
      if (user) { //usuari autenticat
        const uid = user.uid;
        if (user.email) {
          this.updateUserData(uid, user.email);
        }
      }
    });
  }

  async fetchUserDataFromFirestore(userId: string): Promise<UserData | null> {
    // Obtenim una instància de Firestore
    const db = getFirestore();

    // Creem una referència al document de l'usuari a Firestore
    const userRef = doc(db, "users", userId);

    // Obtenim el document de l'usuari
    const userDoc = await getDoc(userRef);

    // Si el document existeix, el retornem com a objecte UserData
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      // Si el document no existeix, mostrem un missatge a la consola i retornem null
      console.log("No such document!");
      return null;
    }
  }

  private async updateUserData(uid: string, email: string) {
    // Creem una referència al document de l'usuari a Firestore
    const userRef = doc(this.db, 'users', uid);

    // Obtenim el document de l'usuari
    const docSnap = await getDoc(userRef);

    // Si el document no existeix, creem un nou document per a l'usuari
    if (!docSnap.exists()) {
      // Creem un nou nom d'usuari a partir de l'email
      const newName = email.split('@')[0];

      // Creem un objecte UserData amb l'email, el nom i la imatge de l'usuari
      const userData: UserData = {
        email: email,
        name: newName,
        image: 'https://www.somoscomarca.es/wp-content/uploads/2020/05/somoscomarca_arua_empresa_barpaco_cristina_somoscomaercio_2020_05_30-1.jpg',
      };

      // Afegim l'objecte UserData al document de l'usuari a Firestore
      await setDoc(userRef, userData, { merge: true });
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getCurrentUserUID(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  async isLoggedIn(): Promise<boolean> {
    return this.auth.currentUser !== null;
  }

  async login({ email, password }: LoginData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async getUserByEmail(email: string): Promise<boolean> {
    const methods = await fetchSignInMethodsForEmail(this.auth, email);
    
    if (methods.length === 0) { // No existeix l'usuari
      return false;
    } else { // Existeix l'usuari
      return true;
    }
  }

  register({ email, password }: LoginData) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }


  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
}