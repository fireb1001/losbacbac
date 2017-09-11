import { Component, OnInit } from '@angular/core';
import { FireHelperService } from 'app/services/fire-helper.service';
import { GoogleApiService } from 'app/services/google-api.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { ConfigsService } from 'app/services/configs.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-selenium-queue',
  templateUrl: './selenium-queue.component.html',
  styleUrls: ['./selenium-queue.component.css']
})
export class SeleniumQueueComponent implements OnInit {

  queue: FirebaseListObservable<any>;
  rand_textincr;
  respo;
  device;

  constructor(private fireServ: FireHelperService,
    private configsService: ConfigsService,
    private googleAPI: GoogleApiService,
    private titleServ: Title ) { }

  ngOnInit() {
    this.titleServ.setTitle('Queue');
    let query = {};

    if (localStorage.getItem('device')) {
      query = {'orderByChild': 'device', 'equalTo': localStorage.getItem('device')};
    }

    this.fireServ.getAll('selenium_queue', query).then(data => this.queue = data);
    this.configsService.getConfigsObj().then( configs => {
      this.rand_textincr = configs['rand_textincr'];
    });
    this.device = localStorage.getItem('device');
    console.log(this.device);
  }

  selenium_request( item: any ) {

    if ( item.todo === 'ready' && item.todo_list ) {
      const all = [];
      Object.keys(item.todo_list).forEach(function(key){
          all.push(item.todo_list[key]);
      });
      this.googleAPI.forEachPromise(all, this.googleAPI.selenium_request.bind(this.googleAPI))
      .then(_ => {
        item.todo = 'quit';
      });
    } else {
      // Login First
      this.googleAPI.selenium_request(item).then(respo => {
        this.respo = respo;
        // Then Loop promises !!
        if ( item.todo === 'plus') {
          // Some plus logic !!!
          item.todo = 'ready';
          this.queue.update(item.$key, item);
        } else if (item.todo === 'quit') {
          // Do some quit proc
        }
      });
    }
  }

  remove(item) {
    if (confirm('Are You sure you want to remove ' + item.name + ' ?') ) {
      this.queue.remove(item.$key);
    }
  }

  _prompt(what) {

    if (what === 'device') {
      const device = prompt('What\'s your device name?');
      localStorage.setItem('device', device);
    }

  }

  loglog() {
    console.log('loglog');
  }

  add_todo(item, todo) {
    const textico = '';
    const rando = Math.floor(Math.random() * this.rand_textincr );
    this.fireServ.getAll('randtexts', {orderByChild: 'incr', startAt: rando, limitToFirst: 1})
    .then( text => {
      text.subscribe(vals => {
        this.fireServ.push('selenium_queue/' + item.$key + '/todo_list',
          { todo: todo, data : {text: vals[0].text}
        });
      });
    });
  }
}
