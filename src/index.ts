import { Game } from "./classes/Game.js";
import { HumanPlayer } from "./classes/HumanPlayer.js";
import { CPUPlayer } from "./classes/CPUPlayer.js";
import { IPlayer } from "./interfaces/IPlayer.js";

// ------------------------------------------------
// 1. OBTENER ELEMENTOS DEL DOM (DEL HTML)
// ------------------------------------------------
const startScreen = document.getElementById('start-screen') as HTMLElement;
const gameBoard = document.getElementById('game-board') as HTMLElement;
const btnStart = document.getElementById('btn-start') as HTMLButtonElement;
const humanHandElement = document.getElementById('human-hand') as HTMLElement;
const cpuHandElement = document.getElementById('cpu-hand') as HTMLElement;
const activeCardSlot = document.getElementById('active-card-placeholder') as HTMLElement;

let miJuego: Game;
let jugadorHumano: IPlayer;
let jugadorCPU: IPlayer;

// ------------------------------------------------
// 2. FUNCIONES DE RENDERIZADO (DIBUJAR EN PANTALLA)
// ------------------------------------------------

// Crea una imagen HTML para una carta volteada (CPU o Mazo)
function createCardBackElement(): HTMLDivElement {
    const cardBack = document.createElement('div');
    // Usamos la clase CSS que ya tiene el background-image del dorso
    cardBack.className = 'card-back';
    return cardBack;
}

// Crea una imagen HTML para una carta visible (Mano Humana o Mesa)
function createCardImageElement(card: any, cardIndex: number, isPlayable: boolean): HTMLImageElement {
    const img = document.createElement('img');
    img.src = card.imageUrl;
    img.alt = card.mostrarNombreCompleto();
    img.className = 'card-img';

    // Agregamos un atributo de datos para saber su índice en la mano
    img.dataset.index = cardIndex.toString();
    
    // Si la carta es jugable, le damos el cursor de pointer y un evento de click
    if (isPlayable) {
        img.addEventListener('click', () => handlePlayCard(cardIndex));
    }
    
    return img;
}

// Dibuja la mano del JUGADOR HUMANO
function renderHumanHand(player: IPlayer): void {
    // 1. Limpiamos el contenedor
    humanHandElement.innerHTML = '';
    
    // 2. Por ahora, asumimos que todas las cartas son jugables.
    // La lógica de si una carta es legal o no va dentro de playTurn.
    player.hand.forEach((card, index) => {
        const cardElement = createCardImageElement(card, index, true);
        humanHandElement.appendChild(cardElement);
    });
}

// Dibuja la mano del CPU (solo reversos)
function renderCPUHand(player: IPlayer): void {
    cpuHandElement.innerHTML = '';
    // La CPU solo muestra el número de cartas
    player.hand.forEach(() => {
        const cardBackElement = createCardBackElement();
        cpuHandElement.appendChild(cardBackElement);
    });
}

// Dibuja la carta activa en la mesa
function renderActiveCard(suit: string): void {
    activeCardSlot.innerHTML = '';
    
    // Buscamos la primera carta con ese palo en el mazo (simplemente para usar su imagen)
    // Esto es temporal hasta que tengamos el descarte.
    const activeCard = jugadorHumano.hand.find(c => c.suit === suit) || jugadorCPU.hand.find(c => c.suit === suit);

    if (activeCard) {
        // Usamos el mismo elemento de imagen, pero sin evento de click
        const img = createCardImageElement(activeCard, -1, false);
        activeCardSlot.appendChild(img);
    }
}

// Función principal de dibujo para mantener la UI sincronizada
function updateUI(): void {
    if (miJuego) {
        renderHumanHand(jugadorHumano);
        renderCPUHand(jugadorCPU);
        renderActiveCard(miJuego.currentSuit);
    }
}

// ------------------------------------------------
// 3. MANEJO DE EVENTOS Y JUEGO
// ------------------------------------------------

// Lógica que se ejecuta al hacer clic en una carta
function handlePlayCard(cardIndex: number): void {
    console.log(`Intentando jugar la carta en el índice: ${cardIndex}`);
    
    // Intentamos jugar el turno. El método Game.playTurn maneja la validación.
    miJuego.playTurn(jugadorHumano, cardIndex);

    // Actualizamos la interfaz después de la jugada
    updateUI();
    
    // TODO: Pasar el turno a la CPU o al siguiente jugador.
}


// Función que inicia el juego (llamada por el botón)
function initializeGame(): void {
    // 1. Inicializar la lógica del juego
    miJuego = new Game(["Jugador Humano"]); 
    miJuego.startGame(); 

    // Obtener las referencias de los jugadores para el renderizado
    jugadorHumano = miJuego.players.find(p => p.isHuman) as IPlayer;
    jugadorCPU = miJuego.players.find(p => p.name === "Computadora 🤖") as IPlayer;

    // 2. Mostrar la pantalla de juego
    startScreen.classList.add('hidden');
    gameBoard.classList.remove('hidden');

    // 3. Dibujar el estado inicial de la mesa y las manos
    updateUI();
    console.log("¡Juego iniciado! Palo actual:", miJuego.currentSuit);
}


// ------------------------------------------------
// 4. INICIO DEL PROGRAMA
// ------------------------------------------------

// Asignar el evento al botón de inicio
btnStart.addEventListener('click', initializeGame);

// Esto es solo para depuración inicial, puedes borrarlo después
console.log("Aplicación cargada. Esperando clic en 'JUGAR AHORA'.");