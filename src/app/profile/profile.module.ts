import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LazyLoadImageModule,
    IonicSelectableModule,
    ProfilePageRoutingModule,
  ],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
