import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  articles: FirebaseListObservable<any[]>;

  constructor( db: AngularFireDatabase) {
    this.articles = db.list('/articles');
  }

  ngOnInit() { }

}
