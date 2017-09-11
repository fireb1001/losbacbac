import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ConfigsService {

  readonly DB_REF= '/nconfigs';
  configs_obj: any = {};

  constructor(private db: AngularFireDatabase) { }

  getAll(query: any = {}): Promise<FirebaseListObservable<any[]>> {
    return new Promise((resolve, reject) => {
      resolve(this.db.list(this.DB_REF, {query: query}));
    });
  }

  set(data: any) {
    this.getAll({orderByChild: 'name' , equalTo: data.name}).then(_ => {
      _.subscribe(items => {
        if (items[0]) { // Found
          this.db.object(this.DB_REF + '/' + items[0].$key).update(data);
        } else {
          this.db.list(this.DB_REF).push(data);
        }
      });
    });
  }

  private initConfigsObj(): Promise<FirebaseListObservable<any[]>> {
    const all_configs = this.db.list(this.DB_REF, { preserveSnapshot: true });
    return new Promise((resolve, reject) => {
      all_configs.subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            const item = snapshot.val();
            this.configs_obj[item.name] = item.value;
          });
          resolve( all_configs );
      });
    });
  }

  getConfigsObj(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Check if empty
      if (Object.keys(this.configs_obj).length) {
        resolve(  this.configs_obj );
      } else {
        this.initConfigsObj().then(data => { resolve(  this.configs_obj ); });
      }
    });
  }

}
