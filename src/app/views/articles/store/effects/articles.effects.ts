


import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {ArticlesService} from '../../services/articles.service';
import * as articlesActions from '../actions/articles.actions';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';


@Injectable()

export class ArticlesEffects {

  @Effect({dispatch: false}) // effect will not dispatch any actions
  listArticles$ = this.actions$
      .ofType(articlesActions.LIST_ARTICLES) // requesting the socket server to list the articles for us
      .startWith(new articlesActions.ArticlesListed()) // List articles automatically when applications starts
      .do(() => this.articlesService.listArticles());

  @Effect()
  articlesListed$: Observable<Action> =
      this.articlesService.articlesListed$ // listen to the socket for ARTICLES LIST event
      .switchMap(articles =>
          Observable.of(new articlesActions.ArticlesListed(articles)) // ask the the store to populate the articles
      );

  @Effect({dispatch: false})
  addArticle$ = this.actions$
      .ofType(articlesActions.ADD_ARTICLE)
      .map((action: articlesActions.AddArticle) => action.payload)
      .do((article) => this.articlesService.addArticle(article));

  @Effect()
  articleAdded$: Observable<Action> =
      this.articlesService.articleAdded$
      .switchMap(article =>
          Observable.of(new articlesActions.ArticleAdded(article))
      );

  @Effect({dispatch: false})
  updateArticle$ = this.actions$
      .ofType(articlesActions.UPDATE_ARTICLE)
      .map((action: articlesActions.UpdateArticle) => action.payload)
      .do((article) => this.articlesService.updateArticle(article));

  @Effect()
  articleUpdated$: Observable<Action> =
      this.articlesService.articleUpdated$
      .switchMap(article =>
          Observable.of(new articlesActions.ArticleUpdated(article))
      );

  @Effect({dispatch: false})
  deleteArticle$ = this.actions$
      .ofType(articlesActions.DELETE_ARTICLE)
      .map((action: articlesActions.UpdateArticle) => action.payload)
      .do((article) => this.articlesService.deleteArticle(article));

  @Effect()
  articleDeleted$: Observable<Action> =
      this.articlesService.articleDeleted$
      .switchMap(article =>
          Observable.of(new articlesActions.ArticleDeleted(article))
      );

  constructor(private actions$: Actions, private articlesService: ArticlesService) {}
}
