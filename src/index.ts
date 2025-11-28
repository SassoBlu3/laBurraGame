import { Game } from "./classes/Game.js";
import { IPlayer } from "./interfaces/IPlayer.js";

// ------------------------------------------------
// 1. OBTENER ELEMENTOS DEL DOM
// ------------------------------------------------
const startScreen = document.getElementById('start-screen') as HTMLElement;
const gameBoard = document.getElementById('game-board') as HTMLElement;
const btnStart = document.getElementById('btn-start') as HTMLButtonElement;
const btnRestart = document.getElementById('btn-restart') as HTMLButtonElement;

const humanHandElement = document.getElementById('human-hand') as HTMLElement;
const cpuHandElement = document.getElementById('cpu-hand') as HTMLElement;
const activeCardSlot = document.getElementById('active-card-placeholder') as HTMLElement;

// Indicadores
const turnIndicator = document.getElementById('turn-indicator') as HTMLElement;
const deckCountElement = document.getElementById('deck-count') as HTMLElement;
const initialSuitDisplay = document.getElementById('initial-suit-display') as HTMLElement;
const currentSuitIcon = document.getElementById('current-suit-icon') as HTMLElement;
const cpuCardCount = document.getElementById('cpu-card-count') as HTMLElement;
const humanCardCount = document.getElementById('human-card-count') as HTMLElement;

let miJuego: Game;
let jugadorHumano: IPlayer;
let jugadorCPU: IPlayer;

// ------------------------------------------------
// 2. FUNCIONES DE RENDERIZADO
// ------------------------------------------------

function createCardBackElement(): HTMLDivElement {
    const cardBack = document.createElement('div');
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
    player.hand.forEach((card, index) => {
        const isMyTurn = miJuego.isHumanTurn;
        const cardElement = createCardImageElement(card, index, isMyTurn);
        if (!isMyTurn) {
            cardElement.style.cursor = 'not-allowed';
            cardElement.style.opacity = '0.8';
        }
        humanHandElement.appendChild(cardElement);
    });
    humanCardCount.textContent = player.hand.length.toString();
}

// Dibuja la mano del CPU (solo reversos)
function renderCPUHand(player: IPlayer): void {
    cpuHandElement.innerHTML = '';
    // La CPU solo muestra el número de cartas
    player.hand.forEach(() => {
        const cardBackElement = createCardBackElement();
        cpuHandElement.appendChild(cardBackElement);
    });
    cpuCardCount.textContent = player.hand.length.toString();
}

function renderActiveCard(): void {
    activeCardSlot.innerHTML = '';

    if (miJuego.activeCard) {
        const img = document.createElement('img');
        img.src = miJuego.activeCard.imageUrl;
        img.className = 'card-img';
        // Quitamos evento click
        activeCardSlot.appendChild(img);
    } else {
        activeCardSlot.innerHTML = '<span class="slot-label">Mesa</span>';
    }
}

function updateUI(): void {
    if (!miJuego) return;

    renderHumanHand(jugadorHumano);
    renderCPUHand(jugadorCPU);
    renderActiveCard();

    // Actualizar info textual
    deckCountElement.textContent = miJuego.deck.cards.length.toString();
    initialSuitDisplay.textContent = miJuego.currentSuit || "-";
    currentSuitIcon.textContent = miJuego.currentSuit || "♦";

    // Color del palo
    if (miJuego.currentSuit === "♥" || miJuego.currentSuit === "♦") {
        currentSuitIcon.style.color = "#e74c3c"; // Rojo
    } else {
        currentSuitIcon.style.color = "#2c3e50"; // Negro
    }

    // Indicador de turno
    if (miJuego.isHumanTurn) {
        turnIndicator.textContent = "Tu turno";
        turnIndicator.style.color = "#f1c40f";
    } else {
        turnIndicator.textContent = "Turno de CPU...";
        turnIndicator.style.color = "#bdc3c7";
    }
}

// ------------------------------------------------
// 3. MANEJO DE EVENTOS Y JUEGO
// ------------------------------------------------

async function handlePlayCard(cardIndex: number): Promise<void> {
    if (!miJuego.isHumanTurn) return;

    // 1. Animación
    const cardElement = document.querySelector(`img[data-index="${cardIndex}"]`) as HTMLElement;
    const targetSlot = activeCardSlot;

    if (cardElement && targetSlot) {
        const cardRect = cardElement.getBoundingClientRect();
        const slotRect = targetSlot.getBoundingClientRect();

        const deltaX = slotRect.left - cardRect.left + (slotRect.width - cardRect.width) / 2;
        const deltaY = slotRect.top - cardRect.top + (slotRect.height - cardRect.height) / 2;

        cardElement.style.transition = 'transform 0.5s ease-in-out';
        cardElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.0)`;
        cardElement.style.zIndex = '100';

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 2. Lógica
    const success = miJuego.playTurn(jugadorHumano, cardIndex);

    if (success) {
        updateUI();
    } else {
        alert("¡No puedes jugar esa carta! Debes seguir el palo: " + miJuego.currentSuit);
        updateUI();
    }
}

function initializeGame(): void {
    miJuego = new Game(["Jugador Humano"]);
    miJuego.startGame();

    jugadorHumano = miJuego.players.find(p => p.isHuman) as IPlayer;
    jugadorCPU = miJuego.players.find(p => !p.isHuman) as IPlayer;

    startScreen.classList.add('hidden');
    gameBoard.classList.remove('hidden');

    // Escuchar evento de cambio de estado (disparado por la instancia de juego)
    miJuego.addEventListener('game-state-changed', () => {
        updateUI();
    });

    // 3. Dibujar el estado inicial de la mesa y las manos
    updateUI();
    console.log("¡Juego iniciado! Palo actual:", miJuego.currentSuit);
}


// ------------------------------------------------
// 4. INICIO DEL PROGRAMA
// ------------------------------------------------

// Asignar el evento al botón de inicio
btnStart.addEventListener('click', initializeGame);
btnRestart.addEventListener('click', initializeGame);