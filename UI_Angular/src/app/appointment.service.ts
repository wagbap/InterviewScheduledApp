import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Doctor } from './doctor.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface ChatMessage {
  userId: number;
  message: string;
  appointId: number;
  timeSend: Date;
  user?: {
    fullName: string;
    // ... any other user properties ...
  };
}

interface  DoctorModel {
    userId?: number;
    fullName: string;
    email: string;
    password: string;
    userType?: string;
    creationDate?: Date;
    phoneNumber?: string;
    status?: number;
    // Outros campos relevantes...
}


export interface Aluno {
  id: number;
  nome: string;
  status: string;
  resultado: string;
  entrevistas?: Entrevista[];
}

export interface Entrevista {
  id: number;
  empresa: string;
  dataPrimeiroContacto: Date;
  dataEntrevista: Date;
  vagaDisponivel: number;
  alunoId: number;
}




@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl_Appointment = 'http://localhost:5242/Appointments';
  private apiUrl_Users = 'http://localhost:5242/Users';
  private apiUrl_Aluno = 'http://localhost:5242/api/Aluno';
  private apiUrl_Entrevista = 'http://localhost:5242/api/Entrevista';

  private AppointId = null;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  // Métodos para Aluno
  getAllAlunos(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(`${this.apiUrl_Aluno}`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('All Alunos:', data)),
        catchError(this.handleError)
      );
  }

  getAlunoById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl_Aluno}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Aluno by id:', data)),
        catchError(this.handleError)
      );
  }

  // Métodos para Entrevista
  getAllEntrevistas(): Observable<Entrevista[]> {
    return this.http.get<Entrevista[]>(`${this.apiUrl_Entrevista}`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('All Entrevistas:', data)),
        catchError(this.handleError)
      );
  }

  getEntrevistaById(id: number): Observable<Entrevista> {
    return this.http.get<Entrevista>(`${this.apiUrl_Entrevista}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Entrevista by id:', data)),
        catchError(this.handleError)
      );
  }

  createEntrevista(entrevista: Entrevista, alunoId: number): Observable<Entrevista> {
    const params = new HttpParams().set('alunoId', alunoId.toString());
    return this.http.post<Entrevista>(`${this.apiUrl_Entrevista}`, entrevista, { headers: this.getHeaders(), params: params })
      .pipe(
        tap(data => console.log('Entrevista created:', data)),
        catchError(this.handleError)
      );
  }

  updateEntrevista(entrevista: Entrevista): Observable<Entrevista> {
    return this.http.put<Entrevista>(`${this.apiUrl_Entrevista}/${entrevista.id}`, entrevista, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Entrevista updated:', data)),
        catchError(this.handleError)
      );
  }






  
  
  createAppointment(doctorId: string, PatientMsg: string): Observable<any> {
    const params = new HttpParams()
        .set('doctorId', doctorId)
        .set('patientMessage', PatientMsg);
    
    return this.http.post(`${this.apiUrl_Appointment}/CreateAppointment`, {}, { headers: this.getHeaders(), params: params });
}

   getAppointmentsById(): Observable<any> {
    return this.http.post(`${this.apiUrl_Appointment}/GetAppointById`, { appointmentId: this.AppointId }, { headers: this.getHeaders() });
  }

  addMessage( appointmentId: string, message: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const params = new HttpParams()
    
        .set('appointmentId', appointmentId)
        .set('message', message);

    return this.http.post(`${this.apiUrl_Appointment}/AddMessage`, null, { headers: headers, params: params })
        .pipe(catchError(this.handleError));
}



getCurrentUser(): Observable<any> {
  return this.http.get(`${this.apiUrl_Appointment}/GetAllDoctor`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
}



  private handleError(error: any) {
    // Aqui você pode adicionar qualquer lógica extra para tratamento de erro.
    return throwError(error.message || 'Server Error');
  }

getMessagesByAppointmentId(appointmentId: number): Observable<any> {
  return this.http.get(`${this.apiUrl_Appointment}/GetMessageByAppointId`, { 
      headers: this.getHeaders(),
      params: { appointmentId: appointmentId }
  }).pipe(
      tap(data => console.log('Data from getMessagesByAppointmentId:', data))
  );
}
  
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl_Users}/GetAllDoctor`, { headers: this.getHeaders() })
      .pipe(
        tap(doctors => console.log('Doctors received:', doctors)),
        catchError(error => {
          console.error('Error fetching doctors:', error);
          return throwError(error);
        })
      );
  }
    
  finishAppointment(appointmentId: number): Observable<any> {
    const params = new HttpParams()

      .set('appointmentId', appointmentId.toString());

    return this.http.post(`${this.apiUrl_Appointment}/FinishAppointment`, null, { headers: this.getHeaders(), params: params });
}


registerDoctor(doctor: DoctorModel): Observable<DoctorModel> {
  return this.http.post<DoctorModel>(`${this.apiUrl_Users}/AddDoctor`, doctor);
}


  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(`${this.apiUrl_Appointment}/upload`, formData);
  }
}

