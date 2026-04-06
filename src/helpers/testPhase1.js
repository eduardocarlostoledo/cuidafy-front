/**
 * Archivo de prueba para Phase 1
 * Ejecutar: npm run dev y abrir console del navegador
 * 
 * Verifica:
 * - Hook useDisponibilidades funciona
 * - Mapeo de especialidades funciona
 * - Helpers normalizan datos correctamente
 */

import { useDisponibilidades } from "../hooks/useDisponibilidades";
import { useDisponibilidadById } from "../hooks/useDisponibilidadById";
import { getImagenEspecialidad, getEspecialidadesDisponibles } from "../data/especialidadImagenes";
import { normalizarDisponibilidades, validarDisponibilidad } from "../helpers/disponibilidadesHelper";

/**
 * Datos de prueba (mock del backend)
 */
const MOCK_DISPONIBILIDADES = [
  {
    _id: "6940a0dbdb30ed80a7724c8a",
    fecha: "2025-12-20",
    horarios: [
      { hora: "06:00-07:00", stock: true, _id: "6940a0dbdb30ed80a7724c8b" },
      { hora: "07:00-08:00", stock: true, _id: "6940a0dbdb30ed80a7724c8c" },
      { hora: "08:00-09:00", stock: false, _id: "6940a0dbdb30ed80a7724c8d" },
    ],
    creador: {
      _id: "694092b9831c7890b7c4e120",
      especialidad: ["Apoyo a la familia del paciente"],
      localidadesLaborales: ["1. Posadas"],
      creador: {
        _id: "694092b9831c7890b7c4e11f",
        nombre: "Juan",
        apellido: "Pérez",
      },
    },
    disponibilidad: [
      { hora: "06:00-07:00", stock: true, _id: "6940a0dbdb30ed80a7724c8b" },
      { hora: "07:00-08:00", stock: true, _id: "6940a0dbdb30ed80a7724c8c" },
      { hora: "08:00-09:00", stock: false, _id: "6940a0dbdb30ed80a7724c8d" },
    ],
  },
];

/**
 * TEST 1: Validar especialidades
 */
export const testEspecialidades = () => {
  console.log("🧪 TEST 1: Especialidades");
  console.group("Especialidades Disponibles");

  const especialidades = getEspecialidadesDisponibles();
  console.log(`Total: ${especialidades.length}`);
  console.log(especialidades);

  console.groupEnd();

  console.group("Test getImagenEspecialidad");
  const img1 = getImagenEspecialidad("Apoyo a la familia del paciente");
  const img2 = getImagenEspecialidad("Especialidad Inexistente");
  console.log("Imagen válida:", img1);
  console.log("Imagen fallback:", img2);
  console.groupEnd();

  console.log("✅ TEST 1 COMPLETADO\n");
};

/**
 * TEST 2: Validar estructura de disponibilidades
 */
export const testValidarDisponibilidades = () => {
  console.log("🧪 TEST 2: Validación de Disponibilidades");

  console.group("Validar disponibilidad válida");
  const erroresValida = validarDisponibilidad(MOCK_DISPONIBILIDADES[0]);
  console.log(
    erroresValida.length === 0
      ? "✅ Válida (sin errores)"
      : "❌ Errores encontrados:",
    erroresValida
  );
  console.groupEnd();

  console.group("Validar disponibilidad inválida");
  const disponibilidadInvalida = { _id: "123" }; // Falta casi todo
  const erroresInvalida = validarDisponibilidad(disponibilidadInvalida);
  console.log("❌ Errores encontrados:");
  erroresInvalida.forEach((err) => console.log(`  - ${err}`));
  console.groupEnd();

  console.log("✅ TEST 2 COMPLETADO\n");
};

/**
 * TEST 3: Normalizar disponibilidades a Cards
 */
export const testNormalizarDisponibilidades = () => {
  console.log("🧪 TEST 3: Normalizar Disponibilidades a Cards");

  console.group("Datos crudos del backend");
  console.log(MOCK_DISPONIBILIDADES[0]);
  console.groupEnd();

  console.group("Datos normalizados para Card");
  const cardNormalizada = normalizarDisponibilidades(MOCK_DISPONIBILIDADES);
  console.log(cardNormalizada[0]);
  console.groupEnd();

  console.group("Validaciones");
  console.log(`✅ Id: ${cardNormalizada[0].id}`);
  console.log(`✅ Text: ${cardNormalizada[0].text}`);
  console.log(`✅ Count: ${cardNormalizada[0].count} horarios`);
  console.log(`✅ Link: ${cardNormalizada[0].link}`);
  console.log(`✅ Metadata profesional: ${cardNormalizada[0].metadata.profesional}`);
  console.groupEnd();

  console.log("✅ TEST 3 COMPLETADO\n");
};

/**
 * TEST 4: Test del Hook (requiere conexión real al backend)
 */
export const testHookDisponibilidades = () => {
  console.log("🧪 TEST 4: Hook useDisponibilidades");
  console.log("⚠️  Este test requiere conexión real al backend");
  console.log("Ejecutar en un componente React para ver resultados reales");
  console.log("Ejemplo:");
  console.log(`
    function MiComponente() {
      const { disponibilidades, loading, error } = useDisponibilidades();
      
      useEffect(() => {
        if (disponibilidades.length > 0) {
          console.log("✅ Hook funcionando:", disponibilidades);
        }
      }, [disponibilidades]);
      
      if (loading) return <Spinner />;
      if (error) return <Error msg={error} />;
      return <div>{disponibilidades.length} disponibilidades</div>;
    }
  `);
};

/**
 * Ejecutar todos los tests
 */
export const ejecutarTodoTestPhase1 = () => {
  console.clear();
  console.log("🚀 INICIANDO TESTS - PHASE 1");
  console.log("================================\n");

  testEspecialidades();
  testValidarDisponibilidades();
  testNormalizarDisponibilidades();
  testHookDisponibilidades();

  console.log("\n================================");
  console.log("✅ TODOS LOS TESTS COMPLETADOS");
  console.log("================================");
};

export default ejecutarTodoTestPhase1;
