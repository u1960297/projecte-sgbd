import {Auth, GoogleAuthProvider, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword,signInWithPopup, signOut, updateProfile} from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Injectable } from '@angular/core';
import { LoginData } from 'src/app/models/login.model';
import {UserData} from 'src/app/models/user.model';
import { collection, getDoc, getDocs } from '@angular/fire/firestore';
import { Receipts } from '../models/receipts.model';
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
      } else { //usuari no autenticat
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

  login({ email, password }: LoginData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register({ email, password }: LoginData) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  async getReceptes(): Promise<Receipts[]> {
    const db = getFirestore();
    const recipesRef = collection(db, "recipes");
    const receptes: Receipts[] = [];
    const querySnapshot = await getDocs(recipesRef);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      const recepta = doc.data() as Receipts;
      receptes.push(recepta);
    });
    return receptes;
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // loginWithGoogle() {

  //   // The implementation of how you store your user data depends on your application
  //   const repo = new MyUserDataRepo();

  //   // Get reference to the currently signed-in user
  //   const auth = getAuth();
  //   const prevUser = auth.currentUser;

  //   // Get the data which you will want to merge. This should be done now
  //   // while the app is still signed in as this user.
  //   const prevUserData = repo.get(prevUser);

  //   // Delete the user's data now, we will restore it if the merge fails
  //   repo.delete(prevUser);

  //   // Sign in user with the account you want to link to
  //   signInWithCredential(auth, newCredential).then((result) => {
  //     console.log("Sign In Success", result);
  //     const currentUser = result.user;
  //     const currentUserData = repo.get(currentUser);

  //     // Merge prevUser and currentUser data stored in Firebase.
  //     // Note: How you handle this is specific to your application
  //     const mergedData = repo.merge(prevUserData, currentUserData);

  //     const credential = OAuthProvider.credentialFromResult(result);
  //     return linkWithCredential(prevUser, credential)
  //       .then((linkResult) => {
  //         // Sign in with the newly linked credential
  //         const linkCredential = OAuthProvider.credentialFromResult(linkResult);
  //         return signInWithCredential(auth, linkCredential);
  //       })
  //       .then((signInResult) => {
  //         // Save the merged data to the new user
  //         repo.set(signInResult.user, mergedData);
  //       });
  //     }).catch((error) => {
  //       // If there are errors we want to undo the data merge/deletion
  //       console.log("Sign In Error", error);
  //       repo.set(prevUser, prevUserData);
  //     });
  //   }
}