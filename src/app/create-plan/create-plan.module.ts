import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { CreatePlanPageRoutingModule } from './create-plan-routing.module';

import { CreatePlanPage } from './create-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreatePlanPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreatePlanPage]
})
export class CreatePlanPageModule {}
