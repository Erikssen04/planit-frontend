import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';

import { PlansPageRoutingModule } from './plans-routing.module';

import { PlansPage } from './plans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PlansPageRoutingModule
  ],
  declarations: [PlansPage]
})
export class PlansPageModule {}
