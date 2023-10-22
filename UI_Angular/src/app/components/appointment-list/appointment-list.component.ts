import { Component, OnInit } from '@angular/core'; // Removido ChangeDetectorRef
import { AppointmentService } from '../../appointment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';

interface Doctor {
  user: {
    userId: number;
    fullName: string;
  };
  // ... outras propriedades ...
}

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  appointmentId: string = '';
  appointments: any[] = [];
  AppointId: number = 0;
  userType: string = 'Patient';
  currentUserFullName: string = 'Current User';
  selectedDoctorUserId: number | null = null;
  doctors: Doctor[] = [];

  constructor(
    private appointmentService: AppointmentService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkToken();
    setInterval(() => {
      this.fetchAppointments();
    }, 500);

    this.route.params.subscribe(params => {
      this.selectedDoctorUserId = +params['doctorId'];
    });
  }

  setSelectedDoctorId(doctorId: number): void {
    this.selectedDoctorUserId = doctorId;
    this.router.navigate(['/createAppointment', doctorId]);
  }

  checkToken(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      this.router.navigate(['/login']);
    } else {
      this.fetchAppointments();
    }
  }

  onSubmit(): void {
    if (this.appointmentId) {
      const appointmentIdNumber = Number(this.appointmentId);
      if (isNaN(appointmentIdNumber)) {
        alert('Appointment ID must be a valid number.');
        return;
      }
      this.finishAppointment(appointmentIdNumber);
    } else {
      alert('Appointment ID is required.');
    }
  }

  fetchAppointments(): void {
    this.appointmentService.getAppointmentsById().subscribe(
      (appointments: any[]) => {
        this.appointments = appointments;
        if (appointments.length > 0) {
          this.AppointId = appointments[appointments.length - 1].id;
        }
      },
      error => console.error('Error fetching appointments:', error)
    );
  }

  finishAppointment(appointmentId: number): void { 
    this.appointmentService.finishAppointment(appointmentId).subscribe(
      () => {
        alert('Appointment finalizado com sucesso!');
        this.fetchAppointments();
      },
      error => {
        if (error.message.includes('You dont have permition')) {
          alert('Você não tem permissão para finalizar este compromisso. Apenas doutores podem fazer isso.');
        } else {
          alert('Erro ao finalizar o compromisso: ' + error.message);
        }
      }
    );
  } 


  logout(): void {
    localStorage.removeItem('token');
    // Se necessário, redirecione o usuário para a página de login ou qualquer outra página.
      this.router.navigate(['/login']);
   }

}
