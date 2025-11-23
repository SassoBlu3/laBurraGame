import { Card } from "./classes/Card.js";

// Solo le pasamos 2 cosas: Palo y Valor. El número 13 o 14 lo calcula ella sola.
const carta = new Card("♥", "J"); 

console.log(carta.mostrarNombreCompleto());
console.log("Valor numérico:", carta.rank);
