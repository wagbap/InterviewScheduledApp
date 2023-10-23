// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppointmentModule } from './dash-board/Appointment-module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; //
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Componentes adicionados pelo seu colega
import { LandPageComponent } from './land-page/land-page.component';
import { DashLandComponent } from './dash-land/dash-land.component';

@NgModule({
  declarations: [
    AppComponent,
    LandPageComponent,
    DashLandComponent,
    // ... outros componentes ...
  ],
  imports: [
    BrowserModule,
    CommonModule, // Para resolver o problema com o pipe 'date'.
    AppRoutingModule,
    HttpClientModule,
    AppointmentModule,
    BrowserAnimationsModule, // required animations module
    FormsModule,  // Adicione esta linha
    ReactiveFormsModule , // <-- Adição aqui
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-left',
      preventDuplicates: true,
    })
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
