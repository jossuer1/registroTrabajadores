import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookOutline, personOutline, briefcaseOutline, calendarOutline, mailOutline, callOutline, schoolOutline, timeOutline, laptopOutline, codeSlashOutline, cashOutline, documentTextOutline, shieldCheckmarkOutline, refreshOutline } from 'ionicons/icons';
import { RegistroComponent } from './registro/registro.component';
import { CandidatosComponent } from './candidatos/candidatos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonFooter, RegistroComponent, CandidatosComponent]
})
export class HomePage {
  seccion: 'registro' | 'candidatos' = 'registro';
  guardando = false;

  constructor() {
    addIcons({ bookOutline, personOutline, briefcaseOutline, calendarOutline, mailOutline, callOutline, schoolOutline, timeOutline, laptopOutline, codeSlashOutline, cashOutline, documentTextOutline, shieldCheckmarkOutline, refreshOutline });
  }

  cambiarSeccion(valor: 'registro' | 'candidatos') {
    if (!this.guardando) this.seccion = valor;
  }
}
