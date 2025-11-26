// src/index.ts
import { Game } from "./classes/Game.js";

const miJuego = new Game(["Sasso"]);
miJuego.startGame(); // Reparte cartas y define el palo inicial

const jugadorHumano = miJuego.players[1]; // Tu jugador

// Antes de jugar, verificamos si necesita robar
miJuego.handleDrawIfNecessary(jugadorHumano); 
jugadorHumano.showHand();

// Intentamos jugar. Necesitas saber qué palo es (mira la consola).
// Supongamos que el palo es '♥'. Si intentas jugar una carta que no sea '♥' y tienes '♥', fallará.

// Intenta jugar la primera carta (índice 0):
miJuego.playTurn(jugadorHumano, 0); 

// Intenta jugar la primera carta de nuevo (índice 0, si tienes 2 cartas aún):
// miJuego.playTurn(jugadorHumano, 0);