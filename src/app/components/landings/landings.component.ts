import { Component, OnInit } from '@angular/core';
import { LandingsService } from 'app/services/landings.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { ConfigsService } from "app/services/configs.service";
import { GoogleApiService } from "app/services/google-api.service";

@Component({
  selector: 'app-landings',
  templateUrl: './landings.component.html',
  styleUrls: ['./landings.component.css']
})
export class LandingsComponent implements OnInit {

  landings: FirebaseListObservable<any> ;
  operator = '!';
  operator_togg: boolean;
  configs: any;
  random_url;

  constructor(private landingsService: LandingsService,
    private configsService: ConfigsService,
    private googleAPI: GoogleApiService
  ) { }

  ngOnInit() {
    this.landingsService.getAll().then(data => this.landings = data );
    this.configsService.getConfigsObj().then( configs => {
      this.configs = configs;
      this.randomize();
    });
  }

  hide(landing: any, hide= true) {
    if (hide) {
      landing.active = 'off';
    } else {
      landing.active = '';
    }
    this.landingsService.update(landing);
  }

  operator_togg_change(ev) {
    if (ev) {
      this.operator_togg = true;
      this.operator = '=';
    } else {
      this.operator_togg = false;
      this.operator = '!';
    }
  }

  randomize() {
    const random_sub = Math.random().toString(32).substring(10) ; // + Math.floor((Math.random() * 100) + 1);
    this.random_url = '___' + random_sub + this.configs.redir_site ;
  }

  gcount(landing: any) {
    this.googleAPI.gcount(landing).subscribe( resp => {
      landing.gcount = resp['analytics'].allTime.shortUrlClicks ;
      this.landingsService.update(landing);
    });
  }

}
