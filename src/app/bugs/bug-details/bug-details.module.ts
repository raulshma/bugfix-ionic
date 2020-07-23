import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { BugDetailsPageRoutingModule } from './bug-details-routing.module';

import { BugDetailsPage } from './bug-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LazyLoadImageModule,
    BugDetailsPageRoutingModule
  ],
  declarations: [BugDetailsPage]
})
export class BugDetailsPageModule {}
