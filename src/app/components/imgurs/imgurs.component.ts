import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { ImgursService } from 'app/services/imgurs.service';
import { URLSearchParams } from '@angular/http';
import { ConfigsService } from "app/services/configs.service";
import { GoogleApiService } from "app/services/google-api.service";
import { LandingsService } from "app/services/landings.service";

@Component({
  selector: 'app-imgurs',
  templateUrl: './imgurs.component.html',
  styleUrls: ['./imgurs.component.css']
})
export class ImgursComponent implements OnInit {

  imgurs: FirebaseListObservable<any> ;
  imgur_val;
  operator = '!';
  operator_togg: boolean;
  configs: any;

  constructor( private imgursService: ImgursService,
  private configsService: ConfigsService,
  private landingsService: LandingsService,
  private googleAPI: GoogleApiService ) { }

  ngOnInit() {
    this.imgursService.getAll().then(data => this.imgurs = data );
    this.configsService.getConfigsObj().then( configs => this.configs = configs);
  }

  new_imgur(val: string) {

    this.imgur_val = '';
    const data: any = { type: 'zircon' };
    if (val.includes('yout')) {
      const params = new URLSearchParams(val.split('?')[1]);
      console.log(params);
      data.id = params.get('v');
      data.type  = 'youtube';
    } else {
      // data.id = getFileName(entry).trim();
    }
    this.imgursService.addImgur(data);
  }

  hide(imgur: any, hide= true) {
    if (hide) {
      imgur.active = 'off';
    } else {
      imgur.active = '';
    }

    this.imgursService.update(imgur);
    // this.imgurs.update(imgur.$key, imgur);
  }

  create_landing(imgur: any) {
    const url = this.configs.ads_site + '?ts=' + Date.now() + '&gur=' + imgur.id;
    this.googleAPI.shorten(url).subscribe( data => {
      const ld = data['id'].substring(data['id'].lastIndexOf('/') + 1);
      const thumb = 'https://img.youtube.com/vi/' + imgur.id + '/default.jpg';
      const landing = {ld: ld ,thumb: thumb, gcount: '0', imgur: imgur.id, type: imgur.type, created_ts: Date.now()};
      this.landingsService.addLanding(landing);
    });
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

}
