import { Injectable } from '@angular/core';
import {SocketService} from '../../../core/services/socket.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ArticlesService {

  articlesListed$: Observable<any>;
  articleAdded$: Observable<any>;
  articleUpdated$: Observable<any>;
  articleDeleted$: Observable<any>;

  constructor(private socket: SocketService) {

    this.socket.join('articles');
    // Every socket ARTICLES event has it's own observable, will be used by ngrx effects
    this.articlesListed$ = this.socket.listen('[Articles] Listed');
    this.articleAdded$ = this.socket.listen('[Articles] Added');
    this.articleUpdated$ = this.socket.listen('[Articles] Updated');
    this.articleDeleted$ = this.socket.listen('[Articles] Deleted');

  }

  // These methods will be called by ngrx effects (do not use directly in the components)
  listArticles() {
    this.socket.emit('[Articles] List');
  }

  addArticle(article) {
    this.socket.emit('[Articles] Add', article);
  }

  updateArticle(article) {
    this.socket.emit('[Articles] Update', article);
  }

  deleteArticle(article) {
    this.socket.emit('[Articles] Delete', article);
  }

}
