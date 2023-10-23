import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../api-crud.service';
import { UserModel } from '../../user.model';
import { EntrevistaDTO } from '../../api-crud.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';

@Component({
    selector: 'app-appointment-edit',
    templateUrl: './appointment-edit.component.html',
    styleUrls: ['./appointment-edit.component.css']
})
export class AppointmentEditComponent implements OnInit {
    doctor: UserModel = new UserModel();
    private intervalSubscription?: Subscription;

    constructor(public appointmentService: AppointmentService, public toastr: ToastrService,  private router: Router) { }

    onSubmit(form: NgForm) {
        this.appointmentService.formSubmitted = true;
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
        
        this.appointmentService.createEntrevista(alunoId).subscribe({
          next: res => {
            this.appointmentService.list = res as EntrevistaDTO[];
            this.appointmentService.resetForm(form);
            this.toastr.success('Inserted successfully', 'Payment Detail Register');
          },
          error: err => {
            console.log(err);
          }
        });
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
        this.appointmentService.formData = Object.assign({}, selectedRecord);
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
