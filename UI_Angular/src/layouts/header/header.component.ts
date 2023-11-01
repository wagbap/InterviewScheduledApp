import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/services/api-crud.service';
import { BehaviorSubject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  Alunos: any[] = [];
  alunoName: string = '';
  private fullName$ = new BehaviorSubject<string>('');
  selectedDUserId: number | null = null;  // Defina isso com base no usuário logado assim que os alunos forem carregados

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router, 
    private appointmentService: AppointmentService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const loggedUserId = this.appointmentService.getLoggedUserId();

    if (loggedUserId !== null) {
        this.selectedDUserId = loggedUserId;
        console.log('Logged User ID:', this.selectedDUserId);
    } else {
        console.error('Unable to retrieve logged user ID.');
    }

    this.loadAlunos();
    this.subscribeToFullName();
}


  ngOnDestroy(): void {}

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  loadAlunos(): void {
    this.appointmentService.getAllAlunos().subscribe((alunos: any[]) => {
      this.Alunos = alunos;
      console.log('Carregando alunos...', this.Alunos);
      this.getFullNameFromStore();
    });
  }

  getFullNameFromStore(): void {
    if (!this.Alunos || this.Alunos.length === 0) {
      console.warn('Array Alunos está vazio!');
      return;
    }

    console.log("Attempting to find aluno with ID:", this.selectedDUserId);
    console.log("Current list of Alunos:", this.Alunos);

    const selectedAluno = this.Alunos.find(alu => alu.id === this.selectedDUserId);
    if (selectedAluno) {
      const selectedAlunoFullName = selectedAluno.nome;
      console.log("Aluno selected:", selectedAlunoFullName);
      this.fullName$.next(selectedAlunoFullName);
    } else {
      console.log("No aluno found with the given ID.");
    }
  }

  subscribeToFullName() {
    this.getFullNameObservable().subscribe((name: string) => {
      this.cdr.detectChanges();
      this.alunoName = name;
    });
  }




  public getFullNameObservable() {
    return this.fullName$.asObservable();
  }

  logout() {
    this.appointmentService.signOut();
  }
}
