import { Injectable } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore, getDocs, serverTimestamp } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Candidato, CandidatoRegistrado } from '../models/candidato';

@Injectable({ providedIn: 'root' })
export class CandidatosService {
  private readonly app = getApps().length ? getApp() : initializeApp(environment.firebase);
  private readonly db = getFirestore(this.app);

  guardarCandidato(candidato: Candidato) {
    // Firestore genera el identificador y la fecha usando el reloj del servidor.
    return addDoc(collection(this.db, 'candidatos'), {
      ...candidato,
      nombres: candidato.nombres.trim().toLocaleUpperCase('es'),
      resumen: candidato.resumen.trim(),
      creadoEn: serverTimestamp()
    });
  }
  async obtenerCandidatos(): Promise<CandidatoRegistrado[]> {
    const resultado = await getDocs(collection(this.db, 'candidatos'));
    return resultado.docs
      .map(documento => ({ ...documento.data(), id: documento.id } as CandidatoRegistrado))
      .sort((a, b) => (b.creadoEn?.toMillis() ?? 0) - (a.creadoEn?.toMillis() ?? 0));
  }}


