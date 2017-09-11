import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class LandingsService {

  readonly DB_REF= '/nlandings';

  constructor(private db: AngularFireDatabase) { }

  getAll(): Promise<FirebaseListObservable<any[]>> {
    return new Promise((resolve, reject) => {
        resolve( this.db.list(this.DB_REF, {query: { orderByKey: false , limitToLast: 30}}) );
    });
  }

  getKeyByLd(ld: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.db.list( this.DB_REF, { preserveSnapshot: true , query: {orderByChild: 'ld', equalTo: ld}} )
      .subscribe(snaps => {
        snaps.forEach(item => {
          resolve(item.key);
        });
      });
    });
  }

  addLanding(landing: any) {
    return this.db.list(this.DB_REF).push(landing);
  }

  addPersonToLanding(ld: string , person: any) {

    const name = (person.name) ? person.name.givenName : person.displayName ;
    const email = (person.email) ? person.email : '';

    const person_data = {
      id: person.id,
      name: name,
      type: person.objectType,
      email: email,
      img: person.image.url
    };

    this.getKeyByLd(ld).then( key => {
      this.db.list(this.DB_REF + '/' + key + '/persons').set( person.id , person_data);
    });

    /*
    .forEach(items => {
      if (items[0].$key) {
        const key = items[0].$key;
        console.log(key, person_data);
        // this.db.list(this.DB_REF + '/' + key + '/persons').push(person_data);
      }
    });
    */
  }

  update(landing: any) {
    this.db.list(this.DB_REF).update(landing.$key, landing);
  }

}
