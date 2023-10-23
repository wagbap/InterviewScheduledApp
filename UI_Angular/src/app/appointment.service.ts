import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Doctor } from './doctor.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgForm } from "@angular/forms";


export class EntrevistaDTO {
  // Apenas um exemplo. Preencha os campos corretos.
  id: number = 0
  empresa: string = ""
  dataPrimeiroContacto: string = ""
  dataEntrevista: string = ""
  vagaDisponivel: number = 0
  alunoId?: number = 0
}

export class Aluno {
  id: number = 0
  nome: string = ""
  status: string = ""
  resultado: string = ""
  entrevistas?: EntrevistaDTO[];
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
  //private apiUrl_Users = 'http://localhost:5242/Users';
  private apiUrl_Aluno = 'http://localhost:5242/api/Aluno';
  private apiUrl_Entrevista = 'http://localhost:5242/api/Entrevista';


  constructor(private http: HttpClient) { }


  url_entrevista: string = 'http://localhost:5242/api/Entrevista';
  url_aluno: string = 'http://localhost:5242/api/Aluno';
  list: EntrevistaDTO[] = [];
  list_aluno: Aluno[] = [];
  students: Aluno[] = [];
  formData: EntrevistaDTO = new EntrevistaDTO();
  formData_Aluno: Aluno = new Aluno();
  formSubmitted: boolean = false;


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Inside the AppointmentService
  getAllAlunos() {
    return this.http.get<Aluno[]>(this.url_aluno).pipe(
      tap((alunos: Aluno[]) => {
        this.list_aluno = alunos;
      })
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

  updateEntrevista(entrevista: Entrevista): Observable<Entrevista> {
    return this.http.put<Entrevista>(`${this.apiUrl_Entrevista}/${entrevista.id}`, entrevista, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Entrevista updated:', data)),
        catchError(this.handleError)
      );
  }

  fetchStudents() {
    this.http.get<Aluno[]>(this.url_aluno)
      .subscribe(data => {
        this.students = data;
      });
    tap(() => this.refreshListAluno())
  }

  getAllAlunos2() {
    return this.http.get<Aluno[]>(this.url_aluno)
      .pipe(tap(data => this.students = data));
  }

  getAlunoById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl_Aluno}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Aluno by id:', data)),
        catchError(this.handleError)
      );
  }

  createAluno(aluno: Aluno) {
    return this.http.post<Aluno>(this.url_aluno, aluno)
      .pipe(
        tap(() => this.refreshListAluno()) // Refresh list after creating a aluno
      );
  }

  updateAluno(alunoId: number, aluno: Aluno) {
    return this.http.put<Aluno>(`${this.url_aluno}/${alunoId}`, aluno)
      .pipe(
        tap(() => this.refreshListAluno()) // Refresh list after updating a aluno
      );
  }

  deleteAluno(alunoId: number) {
    return this.http.delete<Aluno>(`${this.url_aluno}/${alunoId}`)
      .pipe(
        tap(() => this.refreshListAluno()) // Refresh list after deleting a aluno
      );
  }

  postPaymentDetail(alunoId: number) {
    const fullUrl = `${this.url_entrevista}?alunoId=${alunoId}`;
    return this.http.post(fullUrl, this.formData).pipe(
      tap(() => this.refreshListEntrevista())
    );
  }

  putPaymentDetail(alunoId: number, id: number) {
    if (!id && this.formData.id) {
      id = this.formData.id;
    }

    const fullUrl = `${this.url_entrevista}?alunoId=${alunoId}&id=${id}`;

    return this.http.put(fullUrl, this.formData).pipe(
      tap(() => this.refreshListEntrevista())
    );
  }

  deletePaymentDetail(id: number) {
    return this.http.delete(this.url_entrevista + '/' + id).pipe(
      tap(() => this.refreshListEntrevista())
    );
  }

  

  private handleError(error: any) {
    // Aqui você pode adicionar qualquer lógica extra para tratamento de erro.
    return throwError(error.message || 'Server Error');
  }


  finishAppointment(appointmentId: number): Observable<any> {
    const params = new HttpParams()

      .set('appointmentId', appointmentId.toString());

    return this.http.post(`${this.apiUrl_Appointment}/FinishAppointment`, null, { headers: this.getHeaders(), params: params });
  }


  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(`${this.apiUrl_Appointment}/upload`, formData);
  }

  refreshListEntrevista() {
    this.http.get(this.url_entrevista)
      .subscribe({
        next: res => {
          this.list = res as EntrevistaDTO[];
        },
        error: err => { console.log(err); }
      });
  }

  refreshListAluno() {
    this.http.get(this.url_aluno)
      .subscribe({
        next: res => {
          this.list_aluno = res as Aluno[];
        },
        error: err => { console.log(err); }
      });
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.formData = new EntrevistaDTO();
    this.formSubmitted = false;
  }
}

