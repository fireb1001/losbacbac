import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PersonsService } from 'app/services/persons.service';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.css']
})
export class PersonDetailsComponent implements OnInit {

  person: any ;
  person_key;
  personObserv: FirebaseObjectObservable<any>;
  new_page_id;
  pages: FirebaseListObservable<any> ;

  constructor( private route: ActivatedRoute,
    private personsService: PersonsService,
    private location: Location) { }

  ngOnInit() {

    const key = this.route.snapshot.paramMap.get('id');
    this.personsService.getByKey(key)
    .then( observ => {
      this.personObserv = observ;
      observ.subscribe(snap => {
        this.person = snap.val();
        this.person_key = snap.key;

        // let d = new Date(this.person.last_updated.updated_ts);
        // Get User Pages
        const query = {orderByChild: 'parent/id' , equalTo: this.person.id};
        this.personsService.getAll(query).then( data => {
          console.log(data);
          this.pages = data ;
        });
      });
    });
  }

  save_pages(page_id) {
    let pages = <any>this.person.pages ;
    const new_page = {};
    new_page[page_id] = page_id;

    if ( pages ) {
      pages = Object.assign(pages, new_page);
    } else {
      pages = new_page;
    }
    console.log(pages);
    this.personObserv.update({pages: pages});
  }

  new_page(page_id) {
    this.personsService.new_page(page_id, this.person , this.person_key);
    this.new_page_id = '';
  }

  onSetData() {
    this.personObserv.update({notes: '----'});
  }

  onGoBack() {
    this.location.back();
  }

}
