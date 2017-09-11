import { Component, OnInit } from '@angular/core';
import { ConfigsService } from 'app/services/configs.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { FireHelperService } from 'app/services/fire-helper.service';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.css']
})
export class ConfigsComponent implements OnInit {

  configs: FirebaseListObservable<any[]>;
  enable_congif;
  config_name;
  randtext;
  randtext_copy;
  rand_textincr= 0;

  constructor(private cnfgServ: ConfigsService,
    private fireServ: FireHelperService) { }

  ngOnInit() {
    this.cnfgServ.getAll().then(data => this.configs = data);
    this.fireServ.getAll('randtexts', {orderByKey: true, limitToLast: 1})
    .then(data => {
      data.subscribe(last => {
        if ( last[0] ) {
          this.rand_textincr = last[0].incr;
          this.cnfgServ.set({name: 'rand_textincr', value: this.rand_textincr });
          this.new_randtext_copy();
          /*
          const rando = Math.floor(Math.random() * this.rand_textincr );
          this.fireServ.getAll('randtexts', {orderByChild: 'incr', startAt: rando, limitToFirst: 1})
          .then(_ => {
            _.subscribe(val => console.log(val));
          });
          */
        }
      });
    });
  }

  onEditConfig(config) {
    this.enable_congif = config.$key;
  }

  onSaveConfig(config) {
    this.enable_congif = '';
    this.configs.update(config.$key, config);
  }

  new_config(name) {
    this.cnfgServ.set({name: name});
  }

  new_randtext_copy() {
    const rando = Math.floor(Math.random() * this.rand_textincr );
    this.fireServ.getAll('randtexts', {orderByChild: 'incr', startAt: rando, limitToFirst: 1})
    .then( text => {
      text.subscribe(vals => {
        this.randtext_copy = vals[0].text;
      });
    });
  }

  new_randtext(text) {
    if ( text ) {
      this.fireServ.push('randtexts', {text: text, incr: ++this.rand_textincr });
    }
    this.randtext = '';
  }
}
