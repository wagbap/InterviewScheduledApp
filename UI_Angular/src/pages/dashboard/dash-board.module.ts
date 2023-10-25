// src/app/dash-board/dash-board.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashBoardComponent } from './dash-board.component';

// Adicione isto ao topo de dash-board.module.ts
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [DashBoardComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule
  ]
})
export class DashboardModule { }


