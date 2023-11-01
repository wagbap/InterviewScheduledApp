import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Doctor } from '../../model/doctor.model';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt'; // Importando o JwtHelperService

export class Users {
  userId: number;
  userType: string;
  email: string;
 
  constructor(userId: number, userType: string, email: string) {
    this.userId = userId;
    this.userType = userType;
    this.email = email;
  }
}

export class EntrevistaDTO {
  id: number = 0;
  empresa: string = "";
  dataPrimeiroContacto: Date = new Date();
  dataEntrevista: Date = new Date();
  numerodeEntrevistaFeitas:number=0;
  vagaDisponivel: number = 0;
  alunoId: number = 0;  
}

export type Entrevista = EntrevistaDTO;

export class Aluno {
  id: number = 0;
  nome: string = "";
  status: string = "";
  resultado: string = "";
  numeroEntrevisPorPessoa: number = 0;
  entrevistas?: Entrevista[];
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl_Appointment = 'http://localhost:5242/Appointments';
  //private apiUrl_Users = 'http://localhost:5242/Users';
  private apiUrl_Aluno = 'http://localhost:5242/api/Aluno';
  private apiUrl_Entrevista = 'http://localhost:5242/api/Entrevista';
  private apiUrl_User = 'http://localhost:5242/Users/GetAllUsers';

  constructor(private http: HttpClient, private router: Router) { }


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
  
  //Verbos e Métodos para Alunos 
  getAllAlunos() {
    return this.http.get<Aluno[]>(this.apiUrl_Aluno).pipe(
      tap((alunos: Aluno[]) => {
        this.list_aluno = alunos;
      })
    );
  }

  fetchStudents() {
    this.http.get<Aluno[]>(this.apiUrl_Aluno)
      .subscribe(data => {
        this.students = data;
      });
    tap(() => this.refreshListAluno())
  }


  getAlunoById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.apiUrl_Aluno}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Aluno by id:', data)),
        catchError(this.handleError)
      );
  }

  createAluno(aluno: Aluno) {
    return this.http.post<Aluno>(this.apiUrl_Aluno, aluno,  { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refreshListAluno()) // Refresh list after creating a aluno
      );
  }

  updateAluno(alunoId: number, aluno: Aluno) {
    return this.http.put<Aluno>(`${this.apiUrl_Aluno}/${alunoId}`, aluno)
      .pipe(
        tap(() => this.refreshListAluno()) // Refresh list after updating a aluno
      );
  }

  deleteAluno(alunoId: number) {
    return this.http.delete<Aluno>(`${this.apiUrl_Aluno}/${alunoId}`)
      .pipe(
        tap(() => this.refreshListAluno()) // Refresh list after deleting a aluno
      );
  }


  //Verbos e Métodos para Entrevista 
  getAllEntrevistas() {
    return this.http.get<EntrevistaDTO[]>(this.apiUrl_Entrevista).pipe(
      tap((entrevistas: EntrevistaDTO[]) => {
        this.list = entrevistas;
      })
    );
  }

  getEntrevistaById(id: number): Observable<Entrevista> {
    return this.http.get<Entrevista>(`${this.apiUrl_Entrevista}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(data => console.log('Entrevista by id:', data)),
        catchError(this.handleError)
      );
  }

  createEntrevista(entrevista: any, alunoId: number) {
    const fullUrl = `${this.apiUrl_Entrevista}?alunoId=${alunoId}`;
    return this.http.post<ApiResponse<Entrevista>>(fullUrl, entrevista, { headers: this.getHeaders() })
        .pipe(
            tap(() => this.refreshListEntrevista()),
            catchError(this.handleError)
        );
}

signOut(){
  localStorage.clear();
  this.router.navigate(['login'])
}

  updateEntrevista(alunoId: number, id: number) {
    if (!id && this.formData.id) {
      id = this.formData.id;
    }
    const fullUrl = `${this.apiUrl_Entrevista}?alunoId=${alunoId}&id=${id}`;
    return this.http.put(fullUrl, this.formData, { headers: this.getHeaders() }).pipe(
      tap(() => this.refreshListEntrevista())
    );
  }

  deleteEntrevista(id: number) {
    return this.http.delete(this.apiUrl_Entrevista + '/' + id, { headers: this.getHeaders() }).pipe(
      tap(() => this.refreshListEntrevista())
    );
  }
  
  // Outras Configurações da pagína
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
    this.http.get(this.apiUrl_Entrevista)
      .subscribe({
        next: res => {
          this.list = res as EntrevistaDTO[];
        },
        error: err => { console.log(err); }
      });
  }

  refreshListAluno() {
    this.http.get(this.apiUrl_Aluno)
      .subscribe({
        next: res => {
          this.list_aluno = res as Aluno[];
        },
        error: err => { console.log(err); }
      });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
        // Erros do lado do cliente ou de rede.
        errorMessage = 'Ocorreu um erro: ' + error.error.message;
    } else {
        // O backend retornou um código de resposta malsucedido.
        errorMessage = `O backend retornou o código ${error.status}, corpo: ${error.error}`;
    }

    return throwError(errorMessage);
}

getToken(): string | null {
  return localStorage.getItem('token');
}

decodedToken() {
  const jwtHelper = new JwtHelperService();
  const token = this.getToken();
  return token ? jwtHelper.decodeToken(token) : null;
}

getLoggedUserId(): number | null {
  const payload = this.decodedToken();
  return payload && payload.UserId ? +payload.UserId : null;
}

getLoggedUserType(): string {
  const payload = this.decodedToken();
  return payload && payload.UserType ? payload.UserType : '';
}
//getUserInfo(): Observable<Users> {
  //const url = `${this.apiUrl_User}`; // Substitua com o endpoint real da sua API

  //return this.http.get<Users>(url);
//}
  resetForm(form: NgForm) {
    form.form.reset();
    this.formData = new EntrevistaDTO();
    this.formSubmitted = false;
  }
}

