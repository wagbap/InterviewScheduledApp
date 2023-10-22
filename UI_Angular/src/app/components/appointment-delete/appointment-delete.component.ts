import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { UserModel } from '../../user.model';

interface ChatMessage {
  userId: number;
  fullName: string; // Add this line
  message: string;
  appointId: number;
  timeSend: Date;
}


@Component({
  selector: 'app-appointment-delete',
  templateUrl: './appointment-delete.component.html',
  styleUrls: ['./appointment-delete.component.css']
})
export class AppointmentDeleteComponent implements OnInit {
  doctor: UserModel = new UserModel();
  messages: ChatMessage[] = [];
  newMessageContent: string = '';
  appointmentId: string = '';
  message: string = '';
  token: string = '';  // Você vai precisar pegar o token do usuário logado de alguma forma
  userId: number=0;
  private polling: any;
  
  constructor(private appointmentService: AppointmentService) {}



  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    if (this.token) {
        this.getCurrentUser();
        this.loadMessages();
    }
    this.appointmentId='14';
    this.userId;
    
    this.polling = setInterval(() => {
        this.loadMessages();
    }, 50); // 5 segundos
}

getCurrentUser(): void {
    this.appointmentService.getCurrentUser().subscribe(
        user => {
            this.userId = user.id; // Assumindo que a resposta tem um campo 'id' para o userId
        },
        error => {
            console.error('Error fetching user details:', error);
        }
    );
}
getAppointmentDetails(): void {
  this.appointmentService.getMessagesByAppointmentId(14)
      .subscribe(
          appointment => {
              this.appointmentId = appointment.appointmentId;
              this.loadMessages();
          },
          error => {
              console.error('Error fetching appointment details:', error);
          }
      );
}

ngOnDestroy(): void {
  if (this.polling) {
      clearInterval(this.polling); // Isso garantirá que o intervalo seja limpo quando o componente for destruído.
  }
}


loadMessages(): void {
  if (this.appointmentId) { 
      this.appointmentService.getMessagesByAppointmentId(+this.appointmentId)
      .subscribe(
          messages => {
              if (messages.length > 0) {
                  // Definindo userId com base na primeira mensagem
                  this.userId = messages[0].userId;
              }
              this.messages = messages;
          },
          error => {
              console.error('Error fetching messages:', error);
          }
      );
  } else {
      console.warn('Appointment ID not set. Cannot load messages.');
  }
}

onSubmit(): void {
  if (this.message.trim()) { // check if the message is not empty
      this.appointmentService.addMessage( this.appointmentId, this.message, this.token)
      .subscribe(
          response => {
             // alert('Mensagem adicionada com sucesso!');
              this.message = ''; // reset the message after sending
          },
          error => {
              console.error('Erro ao adicionar mensagem:', error);
          }
      );
  }
}

}


  