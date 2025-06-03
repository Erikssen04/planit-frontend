import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateTaskPageRoutingModule } from './create-task-routing.module';
import { SharedModule } from '../shared/shared.module'; 
import { CreateTaskPage } from './create-task.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreateTaskPageRoutingModule
  ],
  declarations: [CreateTaskPage]
})
export class CreateTaskPageModule {}
