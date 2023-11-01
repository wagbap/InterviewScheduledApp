import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../services/api-crud.service';
import { Aluno } from '../../services/api-crud.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  selector: 'app-alunos',
  templateUrl: './alunos.component.html',
  styleUrls: ['./alunos.component.css']
})

export class AlunosComponent implements OnInit {
  entrevistaId: string = '';
  alunoId: number = 0;
  selectedAlunoId: number | null = null;
  alunos: Aluno[] = [];
  entrevistas: Entrevista[] = [];
  private intervalSubscription?: Subscription;
  searchText: string = '';

  constructor(public appointmentService: AppointmentService, public toastr: ToastrService, public router: Router) { }


  onSubmit(form: NgForm) {
    if (form.valid) {
      if (!this.appointmentService.formData_Aluno.id || this.appointmentService.formData_Aluno.id == 0) {
        this.createAluno(form);
      } else {
        this.updateAluno(form);
      }
    }
  }

  ngOnInit(): void {
    this.checkToken();
    this.appointmentService.fetchStudents();
    this.appointmentService.refreshListAluno();
    this.startPolling();
  }

  user = {
    fullName: ""
  };


  startPolling(): void {
    this.intervalSubscription = interval(500).subscribe(() => {

      console.log('Current alunoId:', this.appointmentService.formData.alunoId);
    });
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }


  getStudentName(alunoId?: number): string {
    if (!alunoId) return ''; // If alunoId is not provided, return an empty string

    const student = this.appointmentService.students.find(s => s.id === alunoId);
    return student ? student.nome : '';
  }

  getStudentNameById(alunoId?: number): string {
    if (!alunoId) {
      return 'N/A';
    }
    const student = this.appointmentService.students.find(s => s.id === alunoId);
    return student ? student.nome : 'N/A';
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

  populateForm(selectedRecord: Aluno) {
    this.appointmentService.formData_Aluno = Object.assign({}, selectedRecord);
  }

  onDelete(id: number) {
    if (confirm('Are you sure to delete this record?')) {
      this.appointmentService.deleteAluno(id).subscribe({
        next: res => {
          this.appointmentService.getAllAlunos(); // Refresh the list of students
          this.toastr.error('Deleted successfully', 'Aluno Register');


        },
        error: err => {
          console.log(err);
        }
      });
    }
  }


  createAluno(form: NgForm) {
    this.appointmentService.createAluno(this.appointmentService.formData_Aluno).subscribe({
      next: res => {
        this.appointmentService.getAllAlunos(); // Refresh the list of students
        this.appointmentService.formData_Aluno = new Aluno(); // Reset the form data
        form.resetForm();
        this.toastr.success('Created successfully', 'Aluno Register');
      },
      error: err => {
        console.log(err); // Registre o erro no console para diagnóstico
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Error');
        } else {
          this.toastr.error('An error occurred', 'Error');
        }
      }

    });
  }

  updateAluno(form: NgForm) {
    this.appointmentService.updateAluno(this.appointmentService.formData_Aluno.id, this.appointmentService.formData_Aluno).subscribe({
      next: res => {
        this.appointmentService.getAllAlunos(); // Refresh the list of students
        this.appointmentService.formData_Aluno = new Aluno(); // Reset the form data
        form.resetForm();
        this.toastr.info('Updated successfully', 'Aluno Register');
      },
      error: err => {
        console.log(err);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}