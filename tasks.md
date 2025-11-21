A. Lógica del juego — flujo paso a paso (estado y acciones)
0. Estado inicial global
    deck (mazo central con todas las cartas restantes, boca abajo).
    discard (carta base actual en el centro — la última jugada).
    players = [humanPlayer, cpuPlayer].
    currentPlayerIndex indica turno (0 = humano, 1 = CPU).
    winner (null o jugador que ganó).

1. Preparación
    Barajar deck.
    Repartir 5 cartas a humanPlayer y 5 a cpuPlayer (cartas robadas del tope del deck).
    Sacar una carta del deck y colocarla como discard (carta base que guía palo y número).
    Establecer currentPlayerIndex (por ejemplo, 0 = humano).

2. Turno del jugador (humano)
    Mostrar la mano (5 cartas) — UI(user interface): mostrar imagenes de cartas con data-id.
    El jugador puede hacer clic en una carta:
        Si selectedCard.matches(discard) (mismo palo o mismo número) → jugarla:
            Remover la carta de su mano.
            Ponerla en discard.
            Verificar si su mano quedó vacía → si sí, gana (fin).
            Si gana, darle la opción de elegir la siguiente carta a jugar (palo y número) — ver nota abajo.
            Si no gana, pasar turno al CPU.
        Si no coincide → mostrar mensaje de error: "Debes jugar una carta del mismo palo o número."

    Si el jugador no tiene carta válida (ver hasPlayableCard(discard) == false):
        Mostrar opción/acción "Robar" o hacer que al intentar jugar se active robo automático.
        Robar una carta del deck y agregar a la mano. 
        Repetir uno por acción hasta que encuentre una carta jugable o el mazo se agote.
            Si la carta robada coincide, jugarla automáticamente (se quita de la mano y pasa a discard).
             Las cartas previamente robadas que no coinciden se quedan en la mano del jugador.
            Si el deck se agota y no hay carta coincidente → terminar turno (pasa al CPU).

    Mostrar actualización de UI tras cada carta robada.

3. Turno del CPU
    CPU evalúa su mano:
        Si tiene carta que coincide (hasPlayableCard): escoger una (por ejemplo la carta de mayor valor que coincida
         o la primera) y la juega:
            Remover de su mano, colocar en discard.
            Si su mano queda vacía → gana.
            Si gana, hacer que CPU elija aleatoriamente de su mazo.
            Pasar turno al humano.

        Si no tiene carta válida:
            Robar del deck hasta que robe una carta jugable o el deck se agote.
            Si roba jugable → jugarla automáticamente; las cartas no jugables quedan en su mano.
            Si mazo vacío y no puede jugar → terminar su turno (pasa al humano).
    
4. Regla de victoria en cada "lanzada"
    Gana el jugador que lance la carta más alta: cuando ambos (humano y CPU) han jugado su carta correspondiente al turno,
    se compara la cara (valor numérico) de la carta más reciente de cada jugador y quien tenga el valor más alto gana
    la ronda y obtiene el derecho de elegir la siguiente carta a jugar (palo y número).
        
        Implementación práctica (sugerida):
            Mantener lastPlayedByHuman y lastPlayedByCPU.
            Tras cada jugada, si ambos han jugado en la “mano” actual 
            (es decir, si tras el humano jugar el CPU también jugó, o viceversa), comparar valores y
             declarar ganador de la ronda.
            El ganador de la ronda podrá forzar (opción en UI) la carta guía:
             elegir un palo y/o número para la siguiente discard (esto puede implementarse como:
              poner la carta discard a una carta virtual con ese palo/número que obliga al otro a respetarlo).

    Cada vez que un jugador se queda sin cartas, termina el juego y ese jugador es el ganador absoluto.

5. Nota sobre la “elección de la siguiente carta por ganador”
    Cuando alguien gana la ronda, se ofrece UI con selección de palo y número de su mazo. Al confirmar:
        Cambiar discard a una "carta elegida virtualmente" (un objeto Card creado con ese palo y número).
        El siguiente jugador debe jugar conforme a esa discard.

6. Fin del juego
    Si algún jugador queda con hand.length === 0 → ganador, mostrar mensaje y botón Reiniciar.

7. Casos extremos
    Si deck se agota y ninguno puede jugar → se declara empate 
    Evitar bucles infinitos: en UI no permitir robar automáticamente sin límites (se hace secuencial y se actualiza la interfaz).