// src/index.ts
import { Deck } from "./classes/Deck.js";

console.log("--- Creando Mazo ---");
const miMazo = new Deck();

// 1. Ver cuántas cartas se crearon (deberían ser 52)
console.log("Total de cartas creadas:", miMazo.cards.length);

// 2. Ver la primera carta (estará ordenada, probablemente A de ♥)
console.log("Primera carta:", miMazo.cards[0].mostrarNombreCompleto());

console.log("--- Barajando ---");
miMazo.shuffle();

// 3. Ver la primera carta ahora (debería ser cualquiera)
console.log("Primera carta tras barajar:", miMazo.cards[0].mostrarNombreCompleto());

console.log("--- Repartiendo ---");
const cartaMano = miMazo.dealCard();
// Como dealCard puede devolver 'undefined' (si el mazo está vacío),
// verificamos que exista antes de usarla.
if (cartaMano) {
    console.log("Me han repartido:", cartaMano.mostrarNombreCompleto());
}

console.log("Cartas restantes en el mazo:", miMazo.cards.length); // Deberían quedar 51