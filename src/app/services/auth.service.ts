import {Auth, GoogleAuthProvider, User, UserCredential, createUserWithEmailAndPassword, getAdditionalUserInfo, onAuthStateChanged, signInWithEmailAndPassword,signInWithPopup, signOut} from '@angular/fire/auth';
import { getAuth, signInWithCredential, linkWithCredential, OAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";


import { Injectable } from '@angular/core';
import { LoginData } from 'src/app/models/login.model';
import {UserData} from 'src/app/models/user.model';
import { getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: UserData | null = null;

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.user = await this.fetchUserDataFromFirestore(user.uid);
        this.addUserToFirestoreDefault(user.uid, user);
      } else {
        this.user = null;
      }
    });
  }

  async fetchUserDataFromFirestore(userId: string): Promise<UserData | null> {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      console.log("No such document!");
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
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

  //Funció per afegir usuari a la base de dades de firebase (no autenticació) per defecte
  async addUserToFirestoreDefault(user: string, userInfo: User) {
    if (userInfo.email) {
      const db = getFirestore();
      const userRef = doc(db, "users", user);
      const defaultName = userInfo.email.split('@')[0];
      await setDoc(userRef, {
        email: userInfo.email,
        name: defaultName,
        image: 'https://images.mnstatic.com/60/5d/605d4ec141c246e909886e26c6cf8b6d.jpg'
      }, { merge: true });
    }
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