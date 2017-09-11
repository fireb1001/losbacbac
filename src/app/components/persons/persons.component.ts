import { Component, OnInit } from '@angular/core';
import { PersonsService } from 'app/services/persons.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { ListItemAttrPipe } from 'app/pipes/list-item-attr.pipe';
import { MdSnackBar } from '@angular/material';
import { LandingsService } from 'app/services/landings.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css']
})
export class PersonsComponent implements OnInit {

  persons: FirebaseListObservable<any> ;

  curr_tag;
  sub_tag= 'page';
  sub_tag_value ;
  tags_list= ['main', 'lamadoq', 'apps', 'newdoq', 'fireb'];
  pages_mode ;
  new_person_id;
  new_person_email;

  constructor( private personsService: PersonsService,
    private landingsService: LandingsService,
    private route: ActivatedRoute,
    public snackBar: MdSnackBar ) { }

  ngOnInit() {
    this.curr_tag = this.personsService.curr_tag;
    this.pages_mode = this.route.snapshot.data.pages_mode;
    if (this.pages_mode) {
      this.personsService.getAll({equalTo: 'page', orderByChild: 'objectType'}).then(data => {
        this.persons = data;
      });
    } else {
      this.personsService.getAll({equalTo: 'person', orderByChild: 'objectType'}).then(data => {
        this.persons = data;
      });
    }
  }

  new_person(person_id, tag, email) {
    this.new_person_id = '';
    this.new_person_email = '';
    this.personsService.new_person(person_id, tag, email);
  }

  onSetTag(tag) {
    this.curr_tag = tag;
    this.personsService.curr_tag = tag;
  }

  refresh(person: any) {
    this.personsService.refresh(person);
  }

  delete(person: any) {
    if (confirm('Are You sure you want to delete ' + person.displayName + ' ?') ) {
      this.persons.remove(person.$key);
    }
  }

  add_to_selenuim(person: any) {
    this.personsService.add_to_selenuim(person);
    this.snackBar.open(person.displayName + ' just has been added To Selenuim Queue !')._dismissAfter(1500);
  }

  _prompt(what, person: any) {
    const newtext = prompt(person[what]);
    person[what] = newtext;
    this.persons.update(person.$key, person);
  }

  refresh_assign(person: any) {

    if ( person.pages ) {
      // TODO loop
      const key = Object.keys(person.pages)[0];
      this.personsService.last_posts(key)
      .subscribe(data => {
        if ( data['items'] && data['items'][0]) {
          const last_post = data['items'][0];
          console.log(last_post);
        }
      });
    }

    this.personsService.last_posts(person.id)
    .subscribe(data => {
      if ( data['items'] && data['items'][0]) {

        const last_post = data['items'][0];
        console.log(last_post);
        let type = '';
        // Check if video landing
        if ( last_post.object.attachments && last_post.object.attachments[0].url) {
          type = last_post.object.attachments[0].objectType;
          const ld = last_post.object.attachments[0].url.split('/')[4];
          if (type === 'video') {
            // Add person to landing
            this.landingsService.addPersonToLanding(ld, person);
          }
        }
        const date = new Date(last_post.published);
        // Update Person last_updated obj
        person.last_updated = {updated_ts: date.getTime(), type: type};
        this.persons.update(person.$key, person);
        // Update Person Posts

        // "Persons Posts Updated !"
        this.snackBar.open(person.displayName + ' Posts Updated !')._dismissAfter(1500);
      }
    });
  }

}
