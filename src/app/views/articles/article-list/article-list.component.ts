import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Article} from '../../../core/models/article';
import {Store} from '@ngrx/store';
import * as fromArticlesStore from '../store';
import * as articlesActions from '../store/actions/articles.actions';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],

  // The state reducers return new references of state slices, so we can relax the change detection strategy
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleListComponent implements OnInit {

  articles$: Observable<Article[]>;

  constructor(
      private store: Store<fromArticlesStore.State>,
  ) {}

  ngOnInit() {
    // subscribe to the store and select articles array
    this.articles$ = this.store.select(fromArticlesStore.getEntitiesArray);
  }

  addArticle(article: Article) {
    this.store.dispatch(new articlesActions.AddArticle(article));
  }


  updateArticle(article: Article) {
    this.store.dispatch(new articlesActions.UpdateArticle(article));
  }

  deleteArticle(article: Article) {
    const r = confirm('Are you sure?');
    if (r) {
      this.store.dispatch(new articlesActions.DeleteArticle(article));
    }

  }

}
