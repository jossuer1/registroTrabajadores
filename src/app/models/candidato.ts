import type { Timestamp } from 'firebase/firestore';

// Datos que captura el formulario de hoja de vida.
export interface Candidato {
  nombres: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  cargo: string;
  nivelAcademico: string;
  experienciaAnios: number;
  modalidad: 'Presencial' | 'Híbrida' | 'Remota';
  habilidades: string[];
  fechaDisponibilidad: string;
  aspiracionSalarial: number;
  resumen: string;
  consentimiento: boolean;
}

// Datos adicionales que recibimos al consultar un documento de Firestore.
export interface CandidatoRegistrado extends Candidato {
  id: string;
  creadoEn: Timestamp | null;
}
