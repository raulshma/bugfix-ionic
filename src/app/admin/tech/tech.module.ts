import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TechPageRoutingModule } from './tech-routing.module';

import { TechPage } from './tech.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TechPageRoutingModule
  ],
  declarations: [TechPage]
})
export class TechPageModule {}
