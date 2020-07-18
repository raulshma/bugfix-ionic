import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VersionsPageRoutingModule } from './versions-routing.module';

import { VersionsPage } from './versions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VersionsPageRoutingModule
  ],
  declarations: [VersionsPage]
})
export class VersionsPageModule {}
