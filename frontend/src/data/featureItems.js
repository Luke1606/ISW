import {
	roles,
	request,
	tribunal,
	evidence,
	security,
	akademos,
	defense_act,
	notification,
	administration,
	info_persistance
} from '@/assets'

/**
 * @description Arreglo de elementos a mostrar en el `CardCarousel` del `HomeComponent`
 */
const featureItems = [
	{
	  icon: { alt: 'Gran cantidad de carpetas', src: evidence },
	  title: 'Gestión eficiente de evidencias',
	  brief:
		'Permite a los estudiantes una simple recopilación y organización todas las evidencias académicas y extensionistas necesarias para el ECE de manera eficiente y organizada.',
	  description:
		'',
	},
	{
	  icon: { alt: 'Celular con mensaje aproval en pantalla', src: request },
	  title: 'Evaluación de solicitudes de ECE',
	  brief:
		'Facilita la evaluación de solicitudes de ejercicios de culminación de estudios con nuestro sistema, que agiliza el proceso y asegura una revisión justa y transparente para cada estudiante.',
	  description:
		'',
	},
	{
	  icon: {
		alt: 'Varias personas reunidas escuchando la exposición de una específica',
		src: tribunal,
	  },
	  title: 'Asignación y aprobación de tribunales simplificada',
	  brief:
		'Agiliza la asignación y aprobación de tribunales con nuestra plataforma, que garantiza un proceso eficiente y transparente para la defensa de proyectos.',
	  description:
		'',
	},
	{
	  icon: { alt: 'Numerosas carpetas', src: defense_act },
	  title: 'Gestión segura de actas de defensa',
	  brief:
		'Simplifica la gestión de las actas de defensa con nuestra solución, que permite un registro despejado, seguro y accesible de cada defensa realizada.',
	  description:
		'La gestión de las actas de defensa es fundamental para documentar el proceso de ejercicios de culminación de estudios. Nuestra herramienta te permite registrar, almacenar y acceder a las actas de manera sencilla y organizada. Con las funciones que facilitan la edición y el seguimiento de cada documento, podrás asegurarte de tener una visión clara del desempeño académico de los estudiantes.',
	},
	{
	  icon: {
		alt: 'Conjunto de personas sentadas usando dispositivos electrónicos',
		src: roles,
	  },
	  title: 'Gestión de permisos por roles',
	  brief:
		'Controla el acceso y los permisos de los usuarios con nuestra herramienta de gestión por funciones, una administración segura y eficiente.',
	  description:
		'',
	},
	{
	  icon: { alt: 'Celular al recibir una notificación', src: notification },
	  title: 'Envío de notificaciones en tiempo real',
	  brief:
		'Mantén a los otros usuarios informados con nuestra funcionalidad de envío de notificaciones en tiempo real, que aseguran una comunicación fluida y oportuna entre estudiantes y administrativos.',
	  description:
		'',
	},
	{
	  icon: {
		alt: 'Captura de pantalla del panel de administración de usuarios del sistema',
		src: administration,
	  },
	  title: 'Panel de administración de usuarios',
	  brief:
		'Gestiona de manera eficiente a todos los usuarios de tu sistema con nuestro panel de administración, que ofrece un control total sobre roles y accesos.',
	  description:
		'',
	},
	{
	  icon: {
		alt: 'Mapa del mundo con ícono de candado simulando seguridad',
		src: security,
	  },
	  title: 'Robusta seguridad y privacidad para documentos sensibles',
	  brief:
		'Garantiza un gran nivel de seguridad y confianza para el trabajo con todo tipo de documentos y adjuntos implicados en el proceso.',
	  description: ''
	},
	{
	  icon: {
		alt: 'Varias carpetas etiquetadas con los años correspondientes',
		src: info_persistance,
	  },
	  title:
		'Persistencia de la información incluso años después de la graduación',
	  brief:
		'Permite a los profesores visualizar y organizar fácilmente los datos sobre el proceso de años anteriores incluso cuando el individuo ya se graduó.',
	  description: ''
	},
	{
	  icon: { alt: 'Captura de pantalla del logo de AKADEMOS', src: akademos },
	  title: 'Integración con AKADEMOS',
	  brief:
		'Desarrollado por la Universidad de las Ciencias Informáticas (UCI) y concebido como un módulo integrado en el sistema de gestión universitaria Akademos.',
	  description: ''
	},
]

export default featureItems