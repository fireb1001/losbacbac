import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Injectable()
export class ImgursService {

  readonly DB_REF= '/nimgurs';

  constructor(private db: AngularFireDatabase) { }

  getAll(): Promise<FirebaseListObservable<any[]>> {
    return new Promise((resolve, reject) => {
        resolve( this.db.list(this.DB_REF) );
    });
  }

  addImgur(data: any) {
    return this.db.list(this.DB_REF).push(data);
  }

  update(imgur: any) {
    this.db.list(this.DB_REF).update(imgur.$key, imgur);
  }

  // reverseit(data: any[]): any[] {
  //   return data.reverse();
  // }
}
