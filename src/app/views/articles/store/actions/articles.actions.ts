
import {Action} from '@ngrx/store';
import {Article} from '../../../../core/models/article';

export const LIST_ARTICLES    = '[Articles] List'; // client -> socket server (side effect)
export const ARTICLES_LISTED   = '[Articles] Listed';         // client -> store

export const ADD_ARTICLE      = '[Articles] Add';  // client -> socket server (side effect)
export const ARTICLE_ADDED    = '[Articles] Added';          // client -> store

export const UPDATE_ARTICLE   = '[Articles] Update'; // same for the rest ...
export const ARTICLE_UPDATED  = '[Articles] Updated';

export const DELETE_ARTICLE   = '[Articles] Delete';
export const ARTICLE_DELETED  = '[Articles] Deleted';


export class ListArticles implements Action {
  readonly type = LIST_ARTICLES;
}

export class ArticlesListed implements Action {
  readonly type = ARTICLES_LISTED;
  constructor(public payload?: {[id: string]: Article}) {}
}

export class AddArticle implements Action {
  readonly type = ADD_ARTICLE;
  constructor(public payload?: Article) {}
}

export class ArticleAdded implements Action {
  readonly type = ARTICLE_ADDED;
  constructor(public payload?: Article) {}
}

export class UpdateArticle implements Action {
  readonly type = UPDATE_ARTICLE;
  constructor(public payload?: Article) {}
}

export class ArticleUpdated implements Action {
  readonly type = ARTICLE_UPDATED;
  constructor(public payload?: Article) {}
}

export class DeleteArticle implements Action {
  readonly type = DELETE_ARTICLE;
  constructor(public payload?: Article) {}
}

export class ArticleDeleted implements Action {
  readonly type = ARTICLE_DELETED;
  constructor(public payload?: Article) {}
}

export type All =
    ListArticles
    | ArticlesListed
    | AddArticle
    | ArticleAdded
    | UpdateArticle
    | ArticleUpdated
    | DeleteArticle
    | ArticleDeleted;
