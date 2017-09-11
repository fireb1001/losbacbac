import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ConfigsService } from 'app/services/configs.service';
import { Observable } from "rxjs/Observable";

@Injectable()
export class GoogleApiService {

  api_key = 'AIzaSyBqfAGr0bdH6W5qK4aXZjhsvGNZMStHu6E';

  constructor( private http: HttpClient,
     private configsService: ConfigsService ) { }

  shorten(url: string) {

    return this.http.post('https://www.googleapis.com/urlshortener/v1/url?key=' + this.api_key
    , JSON.stringify({longUrl: url}), {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  gcount(landing: any) {
    let params = new HttpParams();
    // 4 multi line you should re assign
    params = params.append('key', this.api_key);
    params = params.append('projection', 'ANALYTICS_CLICKS');
    params = params.append('shortUrl', 'http://goo.gl/' + landing.ld);
    return this.http.get('https://www.googleapis.com/urlshortener/v1/url', {params: params} );
  }

  forEachPromise(items, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item);
        });
    }, Promise.resolve());
  };

  selenium_request(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.configsService.getConfigsObj().then(configs => {
        this.http.post( configs['selenium_serv'] + data.todo ,  data )
        .subscribe(resp => {
          console.log('========= resp ===========\n' , resp);
          resolve(resp);
        });

      });
    });
  }

  get_person(plus_id: string) {
    const params = new HttpParams().set('key', this.api_key);
    return this.http.get('https://www.googleapis.com/plus/v1/people/' + plus_id , {params: params} );
  }
}
