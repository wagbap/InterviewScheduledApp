// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; //
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EntrevistasComponent } from './components/entrevistas/entrevistas.component';
import { AlunosComponent } from './components/alunos/alunos.component';

// Componentes adicionados pelo seu colega
import { LandPageComponent } from '../pages/landpage/land-page.component';
import { DashLandComponent } from '../pages/dashland/dash-land.component';


import { HeaderComponent } from '../layouts/header/header.component';
import { SidenavComponent } from '../layouts/sidenav/sidenav.component';
import { FooterComponent } from '../layouts/footer/footer.component';

import { FilterPipe } from './services/filter.pipe'; // ajuste o caminho conforme necessário




@NgModule({
  declarations: [
    FilterPipe,
    AppComponent,
    LandPageComponent,
    DashLandComponent,
    AlunosComponent,
    EntrevistasComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule, // Para resolver o problema com o pipe 'date'.
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    FormsModule,  // Adicione esta linha
    ReactiveFormsModule , // <-- Adição aqui
    ToastrModule.forRoot({})
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
