// Calcula el CO2 ahorrado dado el tipo de residuo y cantidad
export function calculateCO2(residuo, cantidad = 1) {
  return (residuo.co2Ahorro || 0) * cantidad;
}
