import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { AddEditVersionsComponent } from './versions/add-edit/add-edit.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, AdminPageRoutingModule],
  declarations: [AdminPage, AddEditVersionsComponent],
})
export class AdminPageModule {}
