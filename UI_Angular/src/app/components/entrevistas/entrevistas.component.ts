import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../services/api-crud.service';
import { UserModel } from '../../../model/user.model';
import { EntrevistaDTO } from '../../services/api-crud.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { Doctor } from 'src/model/doctor.model';


@Component({
  selector: 'app-entrevistas',
  templateUrl: './entrevistas.component.html',
  styleUrls: ['./entrevistas.component.css']
})
export class EntrevistasComponent implements OnInit {
    doctor: UserModel = new UserModel();
    private intervalSubscription?: Subscription;
    errorMessage: string = '';
    selectedDoctorUserId: number | null = null;
    doctors: Doctor[] = [];
    selectedDoctorFullName: string = '';

    constructor(public appointmentService: AppointmentService, public toastr: ToastrService,  private router: Router) { }

    onSubmit(form: NgForm) {
      this.appointmentService.formSubmitted = true;
      this.errorMessage = ''; // Reset the error message at the beginning of submission
      if (form.valid) {
          if (!this.appointmentService.formData.id || this.appointmentService.formData.id == 0) {
              this.insertRecord(form);
          } else {
              this.updateRecord(form);
          }
      }
  }
  
 ngOnInit(): void {
    this.checkToken();
    this.appointmentService.fetchStudents();
    this.appointmentService.refreshListEntrevista();
    this.startPolling();
  }

  


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
    
    insertRecord(form: NgForm) {
      const alunoId = form.value.alunoId; // Assuming 'alunoId' is a field in the form.
      this.appointmentService.createEntrevista(form.value, alunoId).subscribe(
          (response) => {
              if (response && response.error) {
                  // Check specific error message or just show the error returned
                  this.toastr.error(response.error, 'Error');
              } else {
                  this.toastr.success('Inserted successfully', 'Entrevista Registration');
              }
          },
          (error) => {
              if (error && error.error && error.error.message) {
                  this.errorMessage = error.error.message;
              } else {
                this.errorMessage = 'Não tem permissões para agendar entrevistas em nome de outro aluno.';

              }
             
          }
      );
  }
  
       
      updateRecord(form: NgForm) {
        const alunoId = form.value.alunoId; 
        const id = form.value.id;
    
        console.log(`id da entrevista não encontrado: ${form.value.id}`);
    
        this.appointmentService.updateEntrevista(alunoId, id)
          .subscribe({
            next: res => {
              this.appointmentService.list = res as EntrevistaDTO[];
              this.appointmentService.resetForm(form);
              this.toastr.info('Updated successfully', 'Payment Detail Register');
            },
            error: err => {
              console.log(err);
            }
          });
    }


    populateForm(selectedRecord: EntrevistaDTO) {
      this.appointmentService.formData = JSON.parse(JSON.stringify(selectedRecord));
      }
    
      onDelete(id: number) {
        if (confirm('Are you sure to delete this record?'))
          this.appointmentService.deleteEntrevista(id)
            .subscribe({
              next: res => {
                this.appointmentService.list = res as EntrevistaDTO[]
                this.toastr.error('Deleted successfully', 'Payment Detail Register')
              },
              error: err => { console.log(err) }
            })
      }
    
      
      checkToken(): void {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found!');
          this.router.navigate(['/login']);
        } else {
        
        }
      }


    

      logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }

}
