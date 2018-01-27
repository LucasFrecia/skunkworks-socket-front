import { NgModule } from '@angular/core';
import { ArticleListComponent } from './article-list/article-list.component';
import {ArticlesRoutingModule} from './articles-routing.module';
import {SocketService} from '../../core/services/socket.service';
import {ArticlesService} from './services/articles.service';
import {SharedModule} from '../../core/modules/shared.module';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import * as fromArticlesStore from './store';
import {EffectsModule} from '@ngrx/effects';
import {ArticlesEffects} from './store/effects/articles.effects';

@NgModule({
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    SharedModule,
    StoreModule.forFeature('articles', fromArticlesStore.reducers),
    EffectsModule.forFeature([ArticlesEffects]),
  ],
  declarations: [ArticleListComponent],
  providers: [
      SocketService, ArticlesService
  ]
})
export class ArticlesModule { }
