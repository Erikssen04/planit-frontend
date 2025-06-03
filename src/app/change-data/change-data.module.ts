import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { ChangeDataPageRoutingModule } from './change-data-routing.module';

import { ChangeDataPage } from './change-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ChangeDataPageRoutingModule
  ],
  declarations: [ChangeDataPage]
})
export class ChangeDataPageModule {}
