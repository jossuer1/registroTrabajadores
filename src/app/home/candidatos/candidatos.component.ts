import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonList, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent } from '@ionic/angular/standalone';
import { CandidatoRegistrado } from '../../models/candidato';
import { CandidatosService } from '../../services/candidatos.service';

@Component({
  selector: 'app-candidatos',
  standalone: true,
  templateUrl: './candidatos.component.html',
  styleUrls: ['../fichas.scss', './candidatos.component.scss'],
  imports: [CommonModule, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner, IonList, IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent]
})
export class CandidatosComponent implements OnInit {
  private readonly candidatosService = inject(CandidatosService);
  candidatos: CandidatoRegistrado[] = [];
  cargandoCandidatos = false;
  errorConsulta = '';
  candidatoSeleccionado: CandidatoRegistrado | null = null;

  ngOnInit() { void this.cargarCandidatos(); }
  async cargarCandidatos() {
    if (this.cargandoCandidatos) return;
    this.cargandoCandidatos = true;
    this.errorConsulta = '';
    try {
      this.candidatos = await this.candidatosService.obtenerCandidatos();
    } catch (error) {
      console.error('Error al consultar candidatos:', error);
      this.errorConsulta = 'No se pudieron consultar los candidatos. Revise su conexión y los permisos de Firestore.';
    } finally {
      this.cargandoCandidatos = false;
    }
  }

  abrirFicha(candidato: CandidatoRegistrado) {
    this.candidatoSeleccionado = candidato;
  }

  cerrarFicha() {
    this.candidatoSeleccionado = null;
  }

  identificarCandidato(_indice: number, candidato: CandidatoRegistrado) {
    return candidato.id;
  }


}


