# TalentFlow — Registro de hojas de vida

Aplicación móvil de práctica para organizar postulantes de una empresa. Permite registrar perfiles profesionales, guardarlos en Cloud Firestore y consultar sus fichas completas. Desarrollada con Ionic, Angular Standalone y Firebase; empaquetada para Android con Capacitor.

**Repositorio:** https://github.com/jossuer1/registroTrabajadores
**Integrantes** Josue Patiño - Ariana Villota

**Responsable del repositorio:** [jossuer1](https://github.com/jossuer1). Completar los nombres completos de los integrantes antes de la entrega académica.

## Cómo funciona

### Registro (icono de libro)

El formulario se organiza en tres acordeones que se pueden abrir y cerrar sin perder información:

1. **Datos personales:** nombres, correo, teléfono y fecha de nacimiento.
2. **Perfil profesional:** cargo, nivel académico, experiencia, modalidad y habilidades.
3. **Disponibilidad y presentación:** fecha de inicio, aspiración salarial, resumen y consentimiento para datos ficticios.

El botón **Guardar candidato** revisa todos los bloques. Si hay errores, abre los acordeones correspondientes y muestra los mensajes junto a los campos. Durante el envío se muestra un indicador y se bloquea el botón para evitar envíos simultáneos.

Al confirmar Firestore el guardado, aparece una notificación `ion-toast` y se limpia el formulario. Si ocurre un error, aparece un aviso y se conserva la información para reintentar. Los nombres se muestran y almacenan en mayúsculas; el resto conserva su formato.

### Candidatos (icono de usuario)

Al entrar se consultan los documentos de Firestore, ordenados por fecha de registro, del más reciente al más antiguo. Cada tarjeta muestra nombre, cargo, modalidad y experiencia. **Ver ficha completa** abre un modal centrado con toda la información y desplazamiento vertical. Puede cerrarse con **Cerrar**. **Actualizar** vuelve a consultar la base de datos.

La barra inferior mantiene ambos iconos visibles y resalta la sección activa. Cambiar de sección conserva el formulario sin enviar.

## Validaciones

| Campo | Regla |
|---|---|
| Nombres y apellidos | Obligatorios, al menos 3 caracteres después de quitar espacios extremos |
| Correo | Formato válido |
| Teléfono | Entre 7 y 15 dígitos; admite prefijo `+`, espacios, guiones y paréntesis |
| Fecha de nacimiento | Fecha válida, obligatoria y no futura |
| Cargo | Una de las cuatro opciones disponibles |
| Nivel académico | Una de las opciones disponibles |
| Experiencia | Entero entre 0 y 50; cero es válido |
| Modalidad | Presencial, Híbrida o Remota |
| Habilidades | Al menos una de las opciones disponibles |
| Disponibilidad | Fecha válida igual o posterior al día local actual |
| Aspiración salarial | Número finito mayor que cero |
| Resumen | Al menos 30 caracteres después de quitar espacios extremos |
| Consentimiento | Debe estar marcado |

El teléfono se guarda como texto para conservar los ceros iniciales. Las fechas del formulario se guardan como `AAAA-MM-DD`, sin conversión a UTC. La fecha de creación utiliza el reloj de Firestore mediante `serverTimestamp()`.

## Tecnologías y componentes

- Angular 20 con componentes Standalone y TypeScript.
- Ionic 8 y formularios con `FormsModule` / `ngModel`.
- Firebase JavaScript SDK 12: Cloud Firestore.
- Capacitor 7 para Android, Java 21 y SDK Android 35.
- Ionicons para los iconos.

Componentes utilizados: `ion-input`, `ion-datetime`, `ion-select`, `ion-select-option`, `ion-radio-group`, `ion-radio`, `ion-checkbox`, `ion-textarea`, `ion-button`, `ion-list`, `ion-item`, `ion-card`, `ion-icon`, `ion-spinner`, `ion-accordion-group`, `ion-accordion`, `ion-toast` e `ion-modal`, además de los componentes de estructura.

## Arquitectura

```text
src/
  app/
    home/
      home.page.*                  # Contenedor y navegación inferior
      fichas.scss                  # Estilos compartidos
      registro/registro.component.* # Formulario, validaciones y avisos
      candidatos/candidatos.component.* # Consulta, tarjetas y modal
    models/candidato.ts            # Tipos de los datos
    services/candidatos.service.ts # addDoc, getDocs y serverTimestamp
    services/firebase.service.ts   # Servicio del ejemplo original de estudiantes
  environments/
    environment.example.ts         # Plantilla pública de configuración
    environment.ts                 # Configuración local, excluida de Git
  theme/variables.scss              # Paleta y variables de Ionic
android/                            # Proyecto Android y Gradle Wrapper
capacitor.config.json               # Identificador, nombre y carpeta web
firestore.rules                     # Reglas temporales de práctica
```

La página de registro valida y prepara un objeto `Candidato`; el servicio encapsula las operaciones de Firestore. El componente de candidatos solicita los documentos al servicio y gestiona su presentación. No hay un servidor propio.

## Modelo de datos

Colección: **`candidatos`**. Cada guardado crea un documento nuevo con identificador automático. Los campos son atributos independientes, no un JSON guardado como una cadena.

```json
{
  "nombres": "ANA PÉREZ",
  "correo": "ana@correo.test",
  "telefono": "0990000000",
  "fechaNacimiento": "2000-04-15",
  "cargo": "Desarrollador móvil",
  "nivelAcademico": "Tercer nivel",
  "experienciaAnios": 3,
  "modalidad": "Híbrida",
  "habilidades": ["Angular", "Ionic", "Git"],
  "fechaDisponibilidad": "2026-12-01",
  "aspiracionSalarial": 1200,
  "resumen": "Desarrolladora de aplicaciones móviles con experiencia en interfaces y servicios web.",
  "consentimiento": true
}
```

Además, **`creadoEn`** es un `Timestamp` de Firestore; el ejemplo JSON lo omite porque ese tipo no se representa directamente en JSON. Al consultar, se incorpora el `id` del documento. Los campos numéricos son `number`, las habilidades son `string[]`, el consentimiento es `boolean` y los demás campos del formulario son `string`.

## Instalación y ejecución web

Requisitos: Node.js compatible con Angular 20 (por ejemplo 22.12 o superior en la rama 22 LTS), npm y un proyecto de Firebase con una aplicación Web y Firestore habilitado.

```bash
git clone https://github.com/jossuer1/registroTrabajadores.git
cd registroTrabajadores
npm ci
```

En PowerShell, copia la plantilla:

```powershell
Copy-Item src/environments/environment.example.ts src/environments/environment.ts
```

En macOS/Linux, usa `cp` en lugar de `Copy-Item`.

Completa `environment.ts` con los valores de Firebase Console → Configuración del proyecto → Tus apps → aplicación Web. Crea Firestore en ese mismo proyecto y publica las reglas temporales de `firestore.rules` únicamente para la práctica con datos ficticios.

```bash
npm run ionic:serve
```

Abre `http://localhost:8100`. También existe `npm start` para el servidor Angular con su puerto predeterminado.

Para compilar los recursos web:

```bash
npm run build
```

La salida para Capacitor es **`www/browser`**. No necesitas instalar Ionic CLI globalmente.

## Descargar el APK

[Descargar TalentFlow para Android (APK debug)](https://github.com/jossuer1/registroTrabajadores/raw/refs/heads/main/apk/TalentFlow-debug.apk)

También está en [`apk/TalentFlow-debug.apk`](apk/TalentFlow-debug.apk). Compilación de prueba generada con `assembleDebug`; firma verificada con `apksigner`. Compatible desde Android 6 (API 23). No se ha probado todavía su instalación y navegación en un teléfono físico.

## Generar el APK de Android

Requisitos adicionales: Android Studio, JDK 21, Android SDK Platform 35, Build Tools 35, licencias aceptadas y acceso a Internet para descargar dependencias Gradle. El SDK debe estar configurado mediante `ANDROID_HOME` o `android/local.properties`.

Ejemplo de `android/local.properties` en Windows (ajusta la ruta):

```properties
sdk.dir=C:/Android/Sdk
```

Ese archivo es local y no se versiona. Configura `JAVA_HOME` con la carpeta de tu JDK 21. El proyecto ya incluye la plataforma Android; no es necesario ejecutar `cap add android` otra vez.

Desde PowerShell en la raíz:

```powershell
npm run android:apk
```

Este comando compila la web, sincroniza Capacitor y ejecuta `assembleDebug`. El APK resultante está en:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

En macOS/Linux:

```bash
npm run android:sync
cd android
chmod +x gradlew
./gradlew assembleDebug
```

Para abrir el proyecto Android desde la raíz:

```bash
npm run android:open
```

El identificador de la aplicación es `com.jossuer.talentflow`. Es un APK **debug**, firmado con una clave de desarrollo, para instalación de prueba; no es un paquete de publicación en Google Play. Cada cambio web requiere volver a compilar y sincronizar antes de generar otro APK.

### Instalar en un teléfono

Transfiere el APK al teléfono, ábrelo y autoriza la instalación desde esa fuente cuando Android lo solicite. También puedes conectar un dispositivo con depuración USB y ejecutar:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

La consulta y el guardado requieren conexión a Internet y reglas de Firestore que permitan esas operaciones. Si las reglas de práctica se han cerrado, se mostrará un error de permisos hasta configurar un acceso autorizado.

## Pruebas y evidencias

La compilación web se verificó durante la preparación del proyecto. El usuario confirmó en el desarrollo el guardado y la consulta sin errores. No se ha documentado todavía una ejecución completa de los siguientes casos en un dispositivo físico: completar la columna de resultados con lo observado, sin dar pruebas pendientes por realizadas.

| Caso | Procedimiento | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| 1 | Registrar un candidato ficticio completo | Documento en `candidatos`, toast de éxito y formulario limpio | Pendiente de documentar |
| 2 | Ingresar correo sin formato válido y guardar | Error junto al correo, sin guardar | Pendiente de documentar |
| 3 | Ingresar experiencia 51 o 2.5 y guardar | Error de entero entre 0 y 50, sin guardar | Pendiente de documentar |
| 4 | Dejar habilidades vacías o consentimiento desmarcado | Se abre el bloque con errores y se impide guardar | Pendiente de documentar |
| 5 | Recargar, entrar en Candidatos y abrir una ficha | Persistencia y modal con todos los datos | Pendiente de documentar |
| 6 | Intentar una fecha de nacimiento futura o disponibilidad anterior a hoy | Selección restringida y validación rechazada | Pendiente de documentar |
| 7 | Conservar datos al cambiar entre secciones | El formulario mantiene la información ingresada | Pendiente de documentar |

Antes de entregar, registrar al menos **cinco candidatos ficticios** con distintos cargos, niveles, modalidades y habilidades. Añadir capturas reales del formulario, validaciones, listado, modal de detalle y documentos en Firestore. No se incluyen capturas simuladas ni se afirma que existan cinco candidatos sin comprobarlo.

## Seguridad y limitaciones

`firestore.rules` permite `read` y `create` sin autenticación **solo en `candidatos`**, y bloquea `update` y `delete`. Las demás colecciones quedan bloqueadas. Estas reglas permiten que cualquier cliente consulte y cree documentos en esa colección: no son aptas para producción y las validaciones del cliente no impiden escrituras directas desde otro cliente.

Usa únicamente datos ficticios. El consentimiento es parte del ejercicio de interfaz. Al terminar las pruebas, reemplaza las reglas públicas por reglas cerradas y publícalas:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Para un sistema empresarial se necesitarían Firebase Authentication, autorización por roles, validación de campos en las reglas, límites de consulta/paginación y una política de privacidad apropiada. No se implementaron edición, eliminación, subida de PDF, autenticación ni notificaciones push; los toast son avisos dentro de la aplicación.

La configuración Web de Firebase identifica el proyecto y se distribuye dentro de la aplicación compilada; no sustituye las reglas de acceso. `environment.ts` se excluye del repositorio para que cada clon configure su propio proyecto. No publicar cuentas de servicio, claves privadas, contraseñas ni claves de firma Android.

## Referencias

- Ejemplo base: [Registro de estudiantes](https://github.com/jzaldumbide/registro-estudiantes-ejemplo/tree/main).
- [Documentación de Capacitor](https://capacitorjs.com/docs/v7/getting-started).
- [Ionic Framework](https://ionicframework.com/docs).
- [Cloud Firestore](https://firebase.google.com/docs/firestore).

