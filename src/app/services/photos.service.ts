import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  constructor() { }

  uploadImage(filePath: string, file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const storageRef = ref(storage, filePath);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload failed', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  }
}