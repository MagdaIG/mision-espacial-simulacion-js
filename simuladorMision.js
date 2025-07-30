const nave = {
  nombre: "Odisea Galactica",              // Nombre de la nave
  modelo: "XJ-900",                         // Modelo de la nave
  distancia: 0,                             // Distancia recorrida desde el inicio
  distanciaObjetivo: 150000,               // Meta de distancia para completar la misión (en km)
  estado: true,                            // Estado de la misión: true = activa, false = finalizada
  dia: 1,                                  // Día actual de la misión

  recursos: {
    // Los recursos se inicializan aleatoriamente entre 50 y 149
    agua: Math.floor(Math.random() * 100 + 50),
    comida: Math.floor(Math.random() * 100 + 50),
    energia: Math.floor(Math.random() * 100 + 50),
  },

  tripulacion: [
    // Array de objetos que representan a cada tripulante con nombre, rol y salud inicial
    { nombre: "Alice", rol: "Capitan", salud: 100 },
    { nombre: "Bob", rol: "Ingeniero", salud: 90 },
    { nombre: "Clara", rol: "Medico", salud: 85 }
  ],

  eventos: [
    // Lista de posibles eventos que pueden ocurrir durante una exploración
    "Descubierto un nuevo planeta",
    "Tormenta de asteroides evitada",
    "Falla en el sistema de navegacion",
    "Contacto con senal desconocida",
    "Recursos encontrados en asteroide",
    "Sistema estelar desconocido explorado",
    "Anomalia gravitacional detectada"
  ]
};
// Función para registrar mensajes en consola con marca de tiempo
function log(mensaje) {
  const fecha = new Date().toLocaleTimeString(); // Hora actual
  console.log(`[Dia ${nave.dia} - ${fecha}] ${mensaje}`);
}

// Función auxiliar para mostrar barras de progreso con caracteres
function getBarra(porcentaje) {
  const lleno = '█';   // Caracter para parte llena
  const vacio = '░';   // Caracter para parte vacía

  const porcentajeSeguro = Math.max(0, Math.min(100, porcentaje)); // Se asegura que esté entre 0 y 100
  const cantidad = Math.round(porcentajeSeguro / 10); // Cuántos bloques de 10% usar

  return lleno.repeat(cantidad) + vacio.repeat(10 - cantidad);
}
// Muestra el estado actual de la misión
function mostrarDatos() {
  console.clear(); // Limpia la consola antes de mostrar el estado actualizado
  console.log('========================================');
  console.log('      SIMULADOR DE MISION GALACTICA     ');
  console.log('========================================\n');

  // Información general de la nave
  console.log('=== ESTADO DE LA MISION ===');
  console.log(`Nave: ${nave.nombre} (${nave.modelo})`);
  console.log(`Distancia: ${nave.distancia.toLocaleString()} / ${nave.distanciaObjetivo.toLocaleString()} km (${Math.min(100, (nave.distancia / nave.distanciaObjetivo * 100)).toFixed(1)}%)`);
  console.log(`Estado: ${nave.estado ? 'ACTIVA' : 'FINALIZADA'}`);
  console.log(`Dia: ${nave.dia}`);

  // Recursos disponibles
  console.log('\n=== RECURSOS ===');
  console.log(`Agua:    ${nave.recursos.agua}% ${getBarra(nave.recursos.agua)}`);
  console.log(`Comida:  ${nave.recursos.comida}% ${getBarra(nave.recursos.comida)}`);
  console.log(`Energia: ${nave.recursos.energia}% ${getBarra(nave.recursos.energia)}`);

  // Estado de la tripulación con niveles de alerta
  console.log('\n=== TRIPULACION ===');
  nave.tripulacion.forEach(t => {
    const estadoSalud = t.salud < 30 ? 'CRITICO' : t.salud < 70 ? 'ALERTA' : 'OPTIMO';
    console.log(`${t.nombre.padEnd(10)} (${t.rol.padEnd(10)}) - Salud: ${t.salud.toString().padStart(3)}% [${estadoSalud}] ${getBarra(t.salud)}`);
  });

  // Estadísticas finales
  const promedio = nave.tripulacion.reduce((acc, t) => acc + t.salud, 0) / nave.tripulacion.length;
  const criticos = nave.tripulacion.filter(t => t.salud < 50).length;

  console.log('\n=== ESTADISTICAS ===');
  console.log(`Salud promedio: ${promedio.toFixed(1)}%`);
  console.log(`Tripulantes críticos: ${criticos}`);
  console.log('========================================\n');
}
// Función auxiliar para mostrar barras de progreso en texto
function getBarra(porcentaje) {
  const lleno = '█';   // Caracter para barra llena
  const vacio = '░';   // Caracter para barra vacía
  const porcentajeSeguro = Math.max(0, Math.min(100, porcentaje)); // Se asegura que esté entre 0 y 100
  const cantidad = Math.round(porcentajeSeguro / 10); // 10 bloques en total
  return lleno.repeat(cantidad) + vacio.repeat(10 - cantidad);
}
function explorar() {
  if (!nave.estado) {
    log("La misión está finalizada. No se pueden realizar más acciones.");
    return false;
  }

  // Verifica que haya suficiente energía para explorar
  if (nave.recursos.energia < 15) {
    log("No hay suficiente energía para explorar (se necesitan 15%).");
    return false;
  }

  // Al explorar se consumen recursos
  nave.recursos.agua = Math.max(0, nave.recursos.agua - 10);
  nave.recursos.energia = Math.max(0, nave.recursos.energia - 15);

  // Cada tripulante pierde algo de salud aleatoriamente
  nave.tripulacion.forEach(t => {
    t.salud = Math.max(0, t.salud - Math.floor(Math.random() * 10 + 1));
  });

  // La nave avanza una distancia aleatoria
  const avance = Math.floor(Math.random() * 5000 + 1000);
  nave.distancia += avance;

  // Se elige un evento aleatorio de exploración
  const evento = nave.eventos[Math.floor(Math.random() * nave.eventos.length)];

  // Registro en consola
  log(`Exploración exitosa: "${evento}"`);
  log(`Avanzados ${avance} km`);
  return true;
}

function comer() {
  if (!nave.estado) {
    log("La misión está finalizada. No se pueden realizar más acciones.");
    return false;
  }

  // Se necesita 5% de comida por cada tripulante
  const comidaNecesaria = nave.tripulacion.length * 5;
  if (nave.recursos.comida < comidaNecesaria) {
    log(`No hay suficiente comida para todos (se necesitan ${comidaNecesaria}%).`);
    return false;
  }

  nave.recursos.comida -= comidaNecesaria;

  // Cada tripulante recupera algo de salud
  nave.tripulacion.forEach(t => {
    t.salud = Math.min(100, t.salud + Math.floor(Math.random() * 10 + 5));
  });

  log("La tripulación ha comido. Salud mejorada.");
  return true;
}

function descansar() {
  if (!nave.estado) {
    log("La misión está finalizada. No se pueden realizar más acciones.");
    return false;
  }

  if (nave.recursos.energia < 5) {
    log("No hay suficiente energía para descansar (se necesitan 5%).");
    return false;
  }

  nave.recursos.energia -= 5;

  // La tripulación recupera más salud que comiendo
  nave.tripulacion.forEach(t => {
    t.salud = Math.min(100, t.salud + Math.floor(Math.random() * 15 + 5));
  });

  log("La tripulación ha descansado. Salud recuperada.");
  return true;
}
function reparar() {
  if (!nave.estado) {
    log("La misión está finalizada. No se pueden realizar más acciones.");
    return false;
  }

  if (nave.recursos.energia < 20) {
    log("No hay suficiente energía para reparar (se necesitan 20%).");
    return false;
  }

  nave.recursos.energia -= 20;

  // Recupera un poco de agua y comida
  nave.recursos.agua = Math.min(100, nave.recursos.agua + 5);
  nave.recursos.comida = Math.min(100, nave.recursos.comida + 5);

  // La tripulación también se mejora un poco
  nave.tripulacion.forEach(t => {
    t.salud = Math.min(100, t.salud + Math.floor(Math.random() * 5 + 1));
  });

  log("Sistemas reparados. Recursos y salud mejorados.");
  return true;
}
function reportar() {
  // Calcula el promedio de salud de toda la tripulación
  const promedio = nave.tripulacion.reduce((acc, t) => acc + t.salud, 0) / nave.tripulacion.length;

  // Cuenta cuántos miembros tienen salud menor a 50 (considerados críticos)
  const criticos = nave.tripulacion.filter(t => t.salud < 50).length;

  // Cuenta cuántos recursos están por debajo de 30%
  const recursosBajos = Object.values(nave.recursos).filter(r => r < 30).length;

  // Muestra un resumen detallado en consola
  console.log('\n=== REPORTE DETALLADO ===');
  console.log(`Día de misión: ${nave.dia}`);
  console.log(`Estado: ${nave.estado ? 'ACTIVA' : 'FINALIZADA'}`);
  console.log(`Progreso: ${(nave.distancia / nave.distanciaObjetivo * 100).toFixed(1)}%`);
  console.log(`\nSalud promedio: ${promedio.toFixed(1)}%`);
  console.log(`Tripulantes críticos: ${criticos}`);
  console.log(`Recursos bajos: ${recursosBajos}`);

  console.log('\nRecursos actuales:');
  console.log(`- Agua:    ${nave.recursos.agua}%`);
  console.log(`- Comida:  ${nave.recursos.comida}%`);
  console.log(`- Energía: ${nave.recursos.energia}%`);

  console.log('\nTripulación:');
  nave.tripulacion.forEach(t => {
    console.log(`- ${t.nombre} (${t.rol}): ${t.salud}% salud`);
  });
}
function avanzarDia() {
  if (!nave.estado) {
    log("La misión está finalizada. No se pueden realizar más acciones.");
    return false;
  }

  // Aumenta el contador de días
  nave.dia++;

  // Se reduce automáticamente el consumo diario de recursos
  nave.recursos.agua = Math.max(0, nave.recursos.agua - nave.tripulacion.length * 2);
  nave.recursos.comida = Math.max(0, nave.recursos.comida - nave.tripulacion.length * 3);
  nave.recursos.energia = Math.max(0, nave.recursos.energia - 5);

  // Evento aleatorio con 30% de probabilidad
  if (Math.random() < 0.3) {
    const eventos = [
      {
        texto: "Tormenta solar afecta sistemas.",
        efecto: () => {
          nave.recursos.energia = Math.max(0, nave.recursos.energia - 10);
          nave.tripulacion.forEach(t => t.salud = Math.max(0, t.salud - 5));
        }
      },
      {
        texto: "Falla en reciclaje de agua.",
        efecto: () => {
          nave.recursos.agua = Math.max(0, nave.recursos.agua - 15);
        }
      },
      {
        texto: "Celebración a bordo.",
        efecto: () => {
          nave.tripulacion.forEach(t => t.salud = Math.min(100, t.salud + 5));
        }
      },
      {
        texto: "Falla menor en motores.",
        efecto: () => {
          nave.recursos.energia = Math.max(0, nave.recursos.energia - 10);
        }
      },
      {
        texto: "Asteroide con recursos descubierto.",
        efecto: () => {
          nave.recursos.agua = Math.min(100, nave.recursos.agua + 10);
          nave.recursos.comida = Math.min(100, nave.recursos.comida + 10);
        }
      }
    ];

    // Se elige y aplica un evento aleatorio
    const evento = eventos[Math.floor(Math.random() * eventos.length)];
    log(`Evento aleatorio: ${evento.texto}`);
    evento.efecto();
  }

  log(`Comienza el día ${nave.dia}`);
  return true;
}
function verificarEstadoMision() {
  // Si la distancia recorrida alcanza o supera la meta y la misión sigue activa
  if (nave.distancia >= nave.distanciaObjetivo && nave.estado) {
    nave.estado = false; // Finaliza la misión
    log("¡MISION CUMPLIDA! Has alcanzado el objetivo.");
    return;
  }

  // Si hay tripulantes cuya salud es 0 o menos (críticos)
  const criticos = nave.tripulacion.filter(t => t.salud <= 0).length;
  if (criticos > 0 && nave.estado) {
    nave.estado = false;
    log(`¡MISION ABORTADA! ${criticos} tripulante(s) en estado crítico.`);
    return;
  }

  // Si se agotó algún recurso esencial
  const recursosCriticos = Object.values(nave.recursos).filter(r => r <= 0).length;
  if (recursosCriticos > 0 && nave.estado) {
    nave.estado = false;
    log(`¡MISION ABORTADA! Se han agotado ${recursosCriticos} recursos esenciales.`);
    return;
  }
}
function mostrarMenu() {
  console.log('\n=== MENU PRINCIPAL ===');
  console.log('1. Mostrar estado de la misión');
  console.log('2. Explorar');
  console.log('3. Comer');
  console.log('4. Descansar');
  console.log('5. Reparar');
  console.log('6. Generar reporte detallado');
  console.log('7. Avanzar día');
  console.log('8. Salir');
  console.log('========================================');
}
function esperarEnter(rl) {
  return new Promise(resolve => {
    rl.question('Presione Enter para continuar...', () => {
      resolve();
    });
  });
}
async function manejarEntrada(opcion, rl) {
  let accionRealizada = false;

  switch(opcion) {
    case '1':
      mostrarDatos(); // Mostrar estado actual
      break;
    case '2':
      accionRealizada = explorar(); // Acción de exploración
      break;
    case '3':
      accionRealizada = comer(); // Alimentar a la tripulación
      break;
    case '4':
      accionRealizada = descansar(); // Descansar para recuperar salud
      break;
    case '5':
      accionRealizada = reparar(); // Reparar sistemas y recuperar recursos
      break;
    case '6':
      reportar(); // Generar informe detallado
      await esperarEnter(rl);
      break;
    case '7':
      accionRealizada = avanzarDia(); // Avanzar al día siguiente
      break;
    case '8':
      console.log('Saliendo del simulador...');
      return false; // Finaliza el bucle principal
    default:
      console.log('Opción no válida. Intente nuevamente.');
  }

  // Si se realizó alguna acción, se verifica el estado de la misión
  if (accionRealizada) {
    verificarEstadoMision();
    await esperarEnter(rl);
  }

  return true; // Continúa el simulador
}
async function iniciarSimulador() {
  // Limpia la consola para una presentación limpia
  console.clear();

  // Mensaje de bienvenida
  console.log('========================================');
  console.log('      SIMULADOR DE MISION GALACTICA     ');
  console.log('========================================');
  console.log('\nBienvenido a bordo de la ' + nave.nombre);
  console.log('Preparando sistemas...\n');

  // Espera 1.5 segundos simulando carga inicial
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Interfaz para leer entrada del usuario desde consola
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let continuar = true;

  // Bucle principal de juego
  while (continuar) {
    mostrarDatos();      // Muestra estado de la nave
    mostrarMenu();       // Muestra opciones disponibles

    // Espera opción del usuario
    const opcion = await new Promise(resolve => {
      rl.question('\nSeleccione una opcion (1-8): ', answer => {
        resolve(answer.trim());
      });
    });

    // Ejecuta la opción seleccionada y decide si continuar
    continuar = await manejarEntrada(opcion, rl);
  }

  rl.close(); // Cierra la entrada del usuario
  console.log('\nSimulación finalizada. Gracias por jugar!');
}
// Llama a la función principal e informa errores si ocurren
iniciarSimulador().catch(err => {
  console.error('Error en el simulador:', err);
});


