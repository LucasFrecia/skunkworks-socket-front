import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Article} from '../../models/article';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleItemComponent implements OnChanges {

  @Input() article: Article;
  newArticleBody: string;

  @Output() onArticleUpdated = new EventEmitter<Article>();
  @Output() onArticleDeleted = new EventEmitter<Article>();

  editMode = false;

  constructor() { }

  ngOnChanges() {
    this.newArticleBody = this.article.body;
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // reset new body value on edit cancel
      this.newArticleBody = this.article.body;
    }
  }

  updateArticle() {
    this.article.body = this.newArticleBody;
    this.onArticleUpdated.emit(this.article);
    this.toggleEditMode();
  }

  deleteArticle() {
    this.onArticleDeleted.emit(this.article);
  }


}
