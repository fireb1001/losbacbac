import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { GoogleApiService } from 'app/services/google-api.service';

@Injectable()
export class PersonsService {

    persons: FirebaseListObservable<any>;
    readonly DB_REF= '/persons';
    curr_tag = 'main';
    api_key = 'AIzaSyBqfAGr0bdH6W5qK4aXZjhsvGNZMStHu6E';

    constructor(private db: AngularFireDatabase,
        private http: HttpClient,
        private googleApi: GoogleApiService ) {}

    getAll( query: any = {}): Promise<FirebaseListObservable<any[]>> {
        return new Promise((resolve, reject) => {
            resolve( this.db.list(this.DB_REF, {query: query}) );
        });
    }

    getByKey(key: string): Promise<FirebaseObjectObservable<any>> {
        return new Promise((resolve, reject) => {
            resolve( this.db.object(this.DB_REF + '/' + key , { preserveSnapshot: true }) );
        });
    }

    refresh(person: any) {
        this.googleApi.get_person(person.id).subscribe(data => {
            Object.assign(person, data);
            delete person.cover;
            delete person.person_updates;
            delete person.fire;
            this.update(person);
        });
    }

    new_person(person_id, person_tag , email: string) {
        this.googleApi.get_person(person_id).subscribe(data => {
            const person = <any>data;
            console.log(person);
            delete(person.cover);
            person.tags = {};
            person.tags[person_tag] = 1;
            person.email = email.trim();
            this.push(person);
        });
    }

    new_page(page_id, person: any , person_key) {
        this.googleApi.get_person(page_id).subscribe(data => {
            const page = <any>data;
            delete(page.cover);
            page.parent = {};
            page.parent.key = person_key;
            page.parent.img = person.image.url;
            page.parent.id = person.id;
            page.parent.name = person.displayName;
            page.tags = person.tags;
            this.push(page);
        });
    }

    last_posts(plus_id: string) {
        let params = new HttpParams();
        // 4 multi line you should re assign
        params = params.append('key', this.api_key);
        params = params.append('maxResults', '1');
        return this.http.get('https://www.googleapis.com/plus/v1/people/' + plus_id + '/activities/public' , { params: params} );
    }

    add_to_selenuim( person: any) {
        const pass = (person.pass) ? person.pass : 'g9' ;
        this.db.list('/selenium_queue').push({key: person.$key,
            email: person.email,
            pass: '4261179' + pass,
            name: person.displayName,
            todo: 'plus',
            device: localStorage.getItem('device')
        });
    }

    push(person: any) {
        this.db.list(this.DB_REF).push(person);
    }

    update(person: any) {
        this.db.list(this.DB_REF).update(person.$key, person);
    }
}
