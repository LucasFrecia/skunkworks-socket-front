import * as fromArticles from './reducers/articles.reducer';
import * as fromRoot from '../../../core/store';
import {createFeatureSelector, createSelector} from '@ngrx/store';


export interface ArticlesState {
  articles: fromArticles.State;
}


export interface State extends fromRoot.State {
  'articles': ArticlesState;
}

export const reducers = {
  articles: fromArticles.reducer
};


export const getArticlesRootState = createFeatureSelector<ArticlesState>('articles');
export const getArticlesState = createSelector(getArticlesRootState, (articlesState: ArticlesState) => articlesState.articles);

export const getEntites = createSelector(getArticlesState, fromArticles.getEntites);
export const getIds = createSelector(getArticlesState, fromArticles.getIds);
export const getSelectedId = createSelector(getArticlesState, fromArticles.getSelectedId);
export const getSelected = createSelector(getArticlesState, fromArticles.getSelected);
export const getEntitiesArray = createSelector(getArticlesState, fromArticles.getEntitesArray);
