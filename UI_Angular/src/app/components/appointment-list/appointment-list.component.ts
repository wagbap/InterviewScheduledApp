import { Component, OnInit } from '@angular/core'; // Removido ChangeDetectorRef
import { Aluno, AppointmentService } from '../../appointment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';

export interface Entrevista {
  id: number;
  empresa: string;
  dataPrimeiroContacto: Date;
  dataEntrevista: Date;
  vagaDisponivel: number;
  alunoId: number;
}

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})


export class AppointmentListComponent implements OnInit {
  entrevistaId: string = '';
  alunoId: number = 0;
  selectedAlunoId: number | null = null;
  alunos: Aluno[] = [];
  entrevistas: Entrevista[] = [];

  constructor(
    private appointmentService: AppointmentService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkToken();
    interval(500).subscribe(() => {
      this.fetchAlunos();
    });

    this.route.params.subscribe(params => {
      this.selectedAlunoId = +params['alunoId'];
    });
  }

  setSelectedAlunoId(alunoId: number): void {
    this.selectedAlunoId = alunoId;
    this.router.navigate(['/createEntrevista', alunoId]);
  }

  checkToken(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      this.router.navigate(['/login']);
    } else {
      this.fetchAlunos();
    }
  }

  fetchAlunos(): void {
    this.appointmentService.getAllAlunos().subscribe(
      (alunos: Aluno[]) => {
        this.alunos = alunos;
        if (alunos.length > 0) {
          this.alunoId = alunos[alunos.length - 1].id;
        }
      },
      error => console.error('Error fetching alunos:', error)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}