import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarkdownModule } from 'ngx-markdown';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BugDetailsPageRoutingModule } from './bug-details-routing.module';

import { BugDetailsPage } from './bug-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule,
    MarkdownModule.forChild(),
    BugDetailsPageRoutingModule
  ],
  declarations: [BugDetailsPage]
})
export class BugDetailsPageModule {}
