import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class FireHelperService {

  constructor(private db: AngularFireDatabase) { }

  getAll(DB_REF, query: any = {}): Promise<FirebaseListObservable<any[]>> {
    return new Promise((resolve, reject) => {
      resolve(this.db.list(DB_REF, {query: query}));
    });
  }

  push(DB_REF, item) {
    this.db.list(DB_REF).push(item);
  }

}
