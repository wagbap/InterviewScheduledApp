import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../app/services/api-auth.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {
  
  title = 'eClinic';
  user = {
    email: null,
    password: null
  };
  userPayload: any = null; // Definido aqui

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.goToDashland();
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToDashland(): void {
    this.router.navigate(['/registarEntrevista']);
  }

  async onSubmit(user: any) {
    try {
      const response = await this.apiService.login(user);
      if (response) {
        this.goToDashland();
      }
    } catch (error) {
      console.error('Ocorreu um erro:', error);
    }
  }
}
