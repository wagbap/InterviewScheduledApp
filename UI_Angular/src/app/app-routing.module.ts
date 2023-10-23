import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandPageComponent } from './land-page/land-page.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { DashLandComponent } from './dash-land/dash-land.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { AppointmentEditComponent } from './components/appointment-edit/appointment-edit.component';


const routes: Routes = [
    { path: '', component: LandPageComponent },
    { path: 'dashland', component: DashLandComponent },
    { path: 'login', component: DashBoardComponent },
    { path: 'registarEntrevista', component: AppointmentEditComponent },
    { path: 'registarAluno', component: AppointmentListComponent },
    { path: 'login', loadChildren: () => import('./dash-board/dash-board.module').then(m => m.DashboardModule) },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
