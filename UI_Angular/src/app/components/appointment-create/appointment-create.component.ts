import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { ActivatedRoute } from '@angular/router';

interface Aluno {
  id: number;
  nome: string;
  status: string;
  resultado: string;
}

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-create.component.html',
  styleUrls: ['./appointment-create.component.css']
})

export class AppointmentCreateComponent implements OnInit {
  mensagemAluno: string = '';
  selectedAlunoId: number | null = null;
  alunos: Aluno[] = [];
  selectedAlunoNome: string = '';

  constructor(private appointmentService: AppointmentService, private cdr: ChangeDetectorRef, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadAlunos();

    // Obtendo o ID do aluno do parâmetro da rota
    this.route.params.subscribe(params => {
      this.selectedAlunoId = +params['alunoId'];
    });
  }

  onAlunoSelected() {
    const selectedAluno = this.alunos.find(alu => alu.id === this.selectedAlunoId);
    if (selectedAluno) {
      this.selectedAlunoNome = selectedAluno.nome;
      console.log("Aluno selected:", this.selectedAlunoNome);
    } else {
      console.log("No aluno found with the given ID.");
    }
  }

  loadAlunos(): void {
    this.appointmentService.getAllAlunos().subscribe(
      (alunos: Aluno[]) => {
        this.alunos = alunos;
      },
      error => console.error('Error fetching alunos:', error)
    );
  }

  onSubmit(): void {
    if (this.selectedAlunoId && this.mensagemAluno) {
      this.createEntrevista();
    } else {
      alert('Ambos aluno e mensagemAluno são necessários.');
    }
  }

  createEntrevista(): void {
    let entrevista = {
      alunoId: this.selectedAlunoId
      // ... outras propriedades da entrevista se necessário ...
    };

    this.appointmentService.createEntrevista(entrevista, this.selectedAlunoId!)
      .subscribe(
        () => {
          alert('Entrevista criada com sucesso!');
        },
        (error) => alert('Erro ao criar entrevista: ' + error.message)
      );
  }
}
