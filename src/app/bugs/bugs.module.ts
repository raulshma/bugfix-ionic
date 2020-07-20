import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BugsPageRoutingModule } from './bugs-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';

import { BugsPage } from './bugs.page';
import { AddEditBugsComponent } from './add-edit/add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonicSelectableModule,
    BugsPageRoutingModule,
  ],
  declarations: [BugsPage, AddEditBugsComponent],
})
export class BugsPageModule {}
