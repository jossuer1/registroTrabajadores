import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonItem, IonInput, IonButton, IonDatetime, IonSelect, IonSelectOption, IonRadioGroup, IonRadio, IonCheckbox, IonTextarea, IonSpinner, IonIcon, IonAccordion, IonAccordionGroup, IonToast, IonLabel } from '@ionic/angular/standalone';
import { Candidato } from '../../models/candidato';
import { CandidatosService } from '../../services/candidatos.service';
type DatosPersonales = Pick<Candidato, 'nombres' | 'correo' | 'telefono' | 'fechaNacimiento'>;
type DatosFinales = Pick<Candidato, 'fechaDisponibilidad' | 'aspiracionSalarial' | 'resumen' | 'consentimiento'>;
type PerfilProfesional = Pick<Candidato, 'cargo' | 'nivelAcademico' | 'experienciaAnios' | 'modalidad' | 'habilidades'>;

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrls: ['../fichas.scss', './registro.component.scss'],
  imports: [CommonModule, FormsModule, IonItem, IonInput, IonButton, IonDatetime, IonSelect, IonSelectOption, IonRadioGroup, IonRadio, IonCheckbox, IonTextarea, IonSpinner, IonIcon, IonAccordion, IonAccordionGroup, IonToast, IonLabel]
})
export class RegistroComponent {
  private readonly candidatosService = inject(CandidatosService);
  @Output() guardandoChange = new EventEmitter<boolean>();
  guardando = false;
  bloquesAbiertos: string[] = ['personales'];
  toastAbierto = false;
  toastMensaje = '';
  toastColor = 'primary';
  readonly botonesToast = [{ text: 'Cerrar', role: 'cancel' }];

  cambiarBloques(evento: CustomEvent) {
    // Los controles internos también emiten ionChange: solo atendemos al grupo.
    if ((evento.target as HTMLElement).tagName !== 'ION-ACCORDION-GROUP') return;
    this.bloquesAbiertos = evento.detail.value ?? [];
  }

  private notificar(mensaje: string, color: string) {
    this.toastMensaje = mensaje;
    this.toastColor = color;
    this.toastAbierto = true;
  }
  // Usamos la fecha local para que el límite del calendario coincida con hoy.
  readonly hoy = this.fechaLocal();
  datosPersonales: DatosPersonales = {
    nombres: '', correo: '', telefono: '', fechaNacimiento: ''
  };
  errores: Partial<Record<keyof DatosPersonales, string>> = {};
  mensaje = '';
  readonly cargos = ['Desarrollador móvil', 'Analista de datos', 'Diseñador UX/UI', 'Soporte TI'];
  readonly niveles = ['Bachillerato', 'Tecnología', 'Tercer nivel', 'Posgrado'];
  readonly modalidades: Candidato['modalidad'][] = ['Presencial', 'Híbrida', 'Remota'];
  readonly habilidadesDisponibles = ['Angular', 'Ionic', 'JavaScript', 'Python', 'SQL', 'Git', 'Firebase'];
  perfilProfesional: Omit<PerfilProfesional, 'experienciaAnios' | 'modalidad'> & {
    experienciaAnios: number | null;
    modalidad: Candidato['modalidad'] | '';
  } = {
    cargo: '', nivelAcademico: '', experienciaAnios: null, modalidad: '', habilidades: []
  };
  erroresPerfil: Partial<Record<keyof PerfilProfesional, string>> = {};
  mensajePerfil = '';

  cambiarHabilidad(habilidad: string, seleccionada: boolean) {
    const habilidades = this.perfilProfesional.habilidades;
    this.perfilProfesional.habilidades = seleccionada
      ? [...new Set([...habilidades, habilidad])]
      : habilidades.filter(item => item !== habilidad);
    this.mensajePerfil = '';
  }

  validarPerfilProfesional() {
    this.erroresPerfil = {};
    this.mensajePerfil = '';
    const perfil = this.perfilProfesional;
    if (!this.cargos.includes(perfil.cargo)) {
      this.erroresPerfil.cargo = 'Seleccione el cargo al que postula.';
    }
    if (!this.niveles.includes(perfil.nivelAcademico)) {
      this.erroresPerfil.nivelAcademico = 'Seleccione su nivel académico.';
    }
    const experiencia = Number(perfil.experienciaAnios);
    if (perfil.experienciaAnios === null || String(perfil.experienciaAnios).trim() === '' || !Number.isInteger(experiencia) || experiencia < 0 || experiencia > 50) {
      this.erroresPerfil.experienciaAnios = 'Ingrese un número entero entre 0 y 50.';
    }
    if (!perfil.modalidad || !this.modalidades.includes(perfil.modalidad)) {
      this.erroresPerfil.modalidad = 'Seleccione una modalidad de trabajo.';
    }
    if (perfil.habilidades.length === 0 || perfil.habilidades.some(item => !this.habilidadesDisponibles.includes(item))) {
      this.erroresPerfil.habilidades = 'Seleccione al menos una habilidad técnica.';
    }
    if (Object.keys(this.erroresPerfil).length === 0) {
      perfil.experienciaAnios = experiencia;
      this.mensajePerfil = 'Perfil profesional válido.';
    }
  }

  validarDatosPersonales() {
    this.errores = {};
    this.mensaje = '';
    const datos = this.datosPersonales;
    if (datos.nombres.trim().length < 3) {
      this.errores.nombres = 'Ingrese nombres y apellidos con al menos 3 caracteres.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
      this.errores.correo = 'Ingrese un correo electrónico válido.';
    }
    // Admite un prefijo + y separadores habituales, conservando los ceros.
    const telefono = datos.telefono.trim();
    if (!/^\+?[\d\s()-]+$/.test(telefono) || !/^\d{7,15}$/.test(telefono.replace(/\D/g, ''))) {
      this.errores.telefono = 'Ingrese un teléfono de 7 a 15 dígitos.';
    }
    const fecha = datos.fechaNacimiento.slice(0, 10);
    const fechaInterpretada = new Date(fecha + 'T00:00:00');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isFinite(fechaInterpretada.getTime()) || this.fechaLocal(fechaInterpretada) !== fecha || fecha > this.hoy) {
      this.errores.fechaNacimiento = 'Seleccione una fecha de nacimiento válida que no sea futura.';
    }
    if (Object.keys(this.errores).length === 0) {
      datos.fechaNacimiento = fecha;
      this.mensaje = 'Datos personales válidos.';
    }
  }

  datosFinales: Omit<DatosFinales, 'aspiracionSalarial'> & { aspiracionSalarial: number | null } = {
    fechaDisponibilidad: '', aspiracionSalarial: null, resumen: '', consentimiento: false
  };
  erroresFinales: Partial<Record<keyof DatosFinales, string>> = {};
  mensajeFormulario = '';

  validarHojaDeVida() {
    // Reutilizamos las validaciones anteriores para revisar todos los bloques.
    this.validarDatosPersonales();
    this.validarPerfilProfesional();
    this.erroresFinales = {};
    this.mensajeFormulario = '';
    const datos = this.datosFinales;
    const fecha = datos.fechaDisponibilidad.slice(0, 10);
    const fechaInterpretada = new Date(fecha + 'T00:00:00');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isFinite(fechaInterpretada.getTime()) || this.fechaLocal(fechaInterpretada) !== fecha || fecha < this.fechaLocal()) {
      this.erroresFinales.fechaDisponibilidad = 'Seleccione una fecha válida igual o posterior a hoy.';
    }
    const salario = Number(datos.aspiracionSalarial);
    if (datos.aspiracionSalarial === null || !Number.isFinite(salario) || salario <= 0) {
      this.erroresFinales.aspiracionSalarial = 'Ingrese una aspiración salarial mayor que cero.';
    }
    if (datos.resumen.trim().length < 30) {
      this.erroresFinales.resumen = 'Escriba un resumen de al menos 30 caracteres.';
    }
    if (datos.consentimiento !== true) {
      this.erroresFinales.consentimiento = 'Debe aceptar el tratamiento de los datos ficticios de prueba.';
    }
    const hayErrores = [this.errores, this.erroresPerfil, this.erroresFinales]
      .some(errores => Object.keys(errores).length > 0);
    if (hayErrores) {
      this.mensajeFormulario = 'Revise los errores indicados en los bloques del formulario.';
      return;
    }
    datos.fechaDisponibilidad = fecha;
    datos.aspiracionSalarial = salario;
    this.mensajeFormulario = 'Hoja de vida válida.';
    return true;
  }
  async guardarCandidato() {
    if (this.guardando) return;
    if (!this.validarHojaDeVida()) {
      this.bloquesAbiertos = [
        ...(Object.keys(this.errores).length ? ['personales'] : []),
        ...(Object.keys(this.erroresPerfil).length ? ['perfil'] : []),
        ...(Object.keys(this.erroresFinales).length ? ['disponibilidad'] : [])
      ];
      this.notificar('Revise los campos marcados antes de guardar.', 'warning');
      return;
    }
    const perfil = this.perfilProfesional;
    if (!perfil.modalidad) return;
    const candidato: Candidato = {
      ...this.datosPersonales,
      ...perfil,
      ...this.datosFinales,
      nombres: this.datosPersonales.nombres.trim(),
      correo: this.datosPersonales.correo.trim(),
      telefono: this.datosPersonales.telefono.trim(),
      experienciaAnios: Number(perfil.experienciaAnios),
      modalidad: perfil.modalidad,
      habilidades: [...perfil.habilidades],
      aspiracionSalarial: Number(this.datosFinales.aspiracionSalarial),
      resumen: this.datosFinales.resumen.trim()
    };
    this.guardando = true;
    this.guardandoChange.emit(true);
    this.mensajeFormulario = '';
    try {
      await this.candidatosService.guardarCandidato(candidato);
      this.limpiarFormulario();
      this.mensajeFormulario = 'Candidato guardado correctamente en Firebase.';
      this.bloquesAbiertos = ['personales'];
      this.notificar('Candidato guardado correctamente.', 'success');
    } catch (error) {
      console.error('Error al guardar candidato:', error);
      this.notificar('No se pudo guardar el candidato. Sus datos se conservan para reintentar.', 'danger');
      this.mensajeFormulario = 'No se pudo guardar. Revise su conexión y los permisos de la colección candidatos. Sus datos se conservan para reintentar.';
    } finally {
      this.guardando = false;
      this.guardandoChange.emit(false);
    }
  }

  private limpiarFormulario() {
    this.datosPersonales = { nombres: '', correo: '', telefono: '', fechaNacimiento: '' };
    this.perfilProfesional = { cargo: '', nivelAcademico: '', experienciaAnios: null, modalidad: '', habilidades: [] };
    this.datosFinales = { fechaDisponibilidad: '', aspiracionSalarial: null, resumen: '', consentimiento: false };
    this.errores = {};
    this.erroresPerfil = {};
    this.erroresFinales = {};
    this.mensaje = '';
    this.mensajePerfil = '';
  }
  private fechaLocal(fecha = new Date()): string {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  }
}


