import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandPageComponent } from '../pages/landpage/land-page.component';
import { DashBoardComponent } from '../pages/dashboard/dash-board.component';
import { DashLandComponent } from '../pages/dashland/dash-land.component';
import { EntrevistasComponent } from './components/entrevistas/entrevistas.component';
import { AlunosComponent } from './components/alunos/alunos.component';


const routes: Routes = [
    { path: '', component: LandPageComponent },
    { path: 'dashland', component: DashLandComponent },
    { path: 'login', component: DashBoardComponent },
    { path: 'registarEntrevista', component: EntrevistasComponent },
    { path: 'registarAluno', component: AlunosComponent },
    { path: 'login', loadChildren: () => import('../pages/dashboard/dash-board.module').then(m => m.DashboardModule) },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
