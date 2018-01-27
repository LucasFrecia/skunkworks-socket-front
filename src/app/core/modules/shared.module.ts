import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NoteItemComponent} from '../components/note-item/note-item.component';
import {ArticleItemComponent} from '../components/article-item/article-item.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [
    NoteItemComponent,
    ArticleItemComponent
  ],
  exports: [
    NoteItemComponent,
    ArticleItemComponent,
    FormsModule,
  ]
})
export class SharedModule { }
