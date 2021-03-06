// Barra de progreso personalizada
import { growProgressFill } from "./custom-progress-bar.js";
// Temporizador
import { stopTimer } from "./timer.js";

/**
 * Da la vuelta solo a dos tarjetas. Llama a la función de comprobar tarjetas
 *
 * @param {HTMLElement} currentSection La pantalla del nivel
 * @param {HTMLElement} currentLevel
 * @param {HTMLElement} messagesSection Pantalla intermedia
 * @param {HTMLElement} button El botón para pasar al siguiente nivel
 * @param {HTMLElement} footer
 * @param {HTMLElement} shareButton El botón de compartir
 */
export function flipCard(currentSection, currentLevel, messagesSection, button, footer, shareButton) {
    // Capturamos el reverso de todas las tarjetas
    const allCards = document.querySelectorAll(".all-levels-cards__back");
    allCards.forEach(function(card) {
        // Con cada una, al hacer clic
        card.addEventListener("click", function() {
            // Capturamos el audio
            const flipSound = document.querySelector("#flip-sound");
            // Si la tarjeta aún NO se ha girado, lo reproducimos
            if (!card.classList.contains("all-levels-cards__back--turn")) {
                flipSound.play();
            }
            // Le añadimos la clase para girarla
            card.classList.add("all-levels-cards__back--turn");
            // Capturamos las tarjetas que aún NO se han adivinado
            const chosenCards = document.querySelectorAll(".all-levels-cards__back--turn:not(.all-levels-cards__back--hidden)");
            // Dentro de las que aún NO se han emparejado, capturamos el anverso
            const chosenPics = document.querySelectorAll(".all-levels-cards__back--turn:not(.all-levels-cards__back--hidden) .all-levels-cards__front .all-levels-cards-front__image");
            // Cuando ya se han seleccionado dos tarjetas
            if (chosenCards.length === 2) {
                // Comprobamos si son iguales
                checkCards(chosenPics, chosenCards, allCards, currentSection, currentLevel, messagesSection, button, footer, shareButton);
            // Para que NO se giren más de 2 tarjetas NI se reproduzca el audio al clicar en más tarjetas
            } else if (chosenCards.length > 2) {
                card.classList.remove("all-levels-cards__back--turn");
                flipSound.pause();
            }
        })
    })
}

/**
 * Verifica si las dos tarjetas que se han destapado son iguales
 *
 * @param {NodeListOf} chosenPics El anverso de las tarjetas que se han girado, pero aún no se han acertado
 * @param {NodeListOf} chosenCards El reverso de las tarjetas que se han girado, pero aún no se han acertado
 * @param {NodeListOf} allCards Todas las tarjetas, todavía sin girar
 * @param {HTMLElement} currentSection La pantalla del nivel
 * @param currentLevel
 * @param {HTMLElement} messagesSection Pantalla intermedia
 * @param {HTMLElement} button El botón para pasar al siguiente nivel
 * @param {HTMLElement} footer
 * @param {HTMLElement} shareButton El botón de compartir
 */
function checkCards(chosenPics, chosenCards, allCards, currentSection,  currentLevel, messagesSection, button, footer, shareButton) {
    // Capturamos el audio
    const bellSound = document.querySelector("#bell-sound");
    // Si su descripción es la misma, es decir, si es la misma fotografía
    if (chosenPics[0].getAttribute("alt") === chosenPics[1].getAttribute("alt")) {
        setTimeout(function() {
            // Reproducimos el audio con algo de retardo
            bellSound.play();
        }, 500)
        setTimeout(function() {
            chosenPics.forEach(function(card) {
                // A ambas les añadimos opacidad para que se fundan
                card.classList.add("all-levels-cards-front__image--opacity");
            })
            /* Capturamos las tarjetas que ya tienen opacidad (tiene que estar aquí para que capturen las 2 primeras) */
            const guessedCards = document.querySelectorAll(".all-levels-cards-front__image--opacity");
            growProgressFill(allCards, guessedCards);
            chosenCards.forEach(function(card) {
                // Ocultamos también las caras de atrás correspondientes
                card.classList.add("all-levels-cards__back--hidden");
            })
            // Si todas las tarjetas ya se han emparejado
            if (guessedCards.length === allCards.length) {
                // Paramos el temporizador
                stopTimer();
                setTimeout(function() {
                    // Ocultamos la pantalla actual y mostramos los mensajes
                    messagesSection.classList.remove("between-levels--hide");
                    currentSection.classList.add("all-levels--hide");
                    // Reseteamos el contenido del párrafo donde se mostraba el tiempo restante
                    const timeLeft = document.querySelector("#time-left");
                    timeLeft.textContent = "01:00";
                    /* Lo ocultamos y mostramos el otro p donde se informa de que se puede activar el temporizador */
                    timeLeft.classList.add("hidden");
                    document.querySelector("#timer-message").classList.remove("hidden");
                    changeBetweenLevelsTexts(currentLevel, messagesSection, button, footer, shareButton);
                }, 1200)
            }
        }, 1500)
    // Si las fotografías NO coinciden
    } else {
        setTimeout(function() {
            chosenCards.forEach(function(card) {
                // Volvemos a girar ambas para que vuelvan a estar tapadas
                card.classList.remove("all-levels-cards__back--turn");
            })
        }, 1500)
    }
}

/**
 * Cambia el h1 de la pantalla intermedia, dependiendo del nivel que se acabe de completar
 *
 * @param currentLevel
 * @param messagesSection
 * @param {HTMLElement} button El botón para pasar al nivel siguiente
 * @param {HTMLElement} footer
 * @param {HTMLElement} shareButton El botón de compartir
 */
function changeBetweenLevelsTexts(currentLevel, messagesSection, button, footer, shareButton) {
    // Capturamos el h1
    const text = document.querySelector("#in-between-text");
    // Capturamos el p
    const text2 = document.querySelector("#in-between-second-text");
    // Nos aseguramos de que este párrafo tenga este contenido (por si se había cambiado al usar el timer)
    text2.textContent = "You completed this level.";
    if (currentLevel[1].textContent == "2") {
        text.textContent = "Great!";
        messagesSection.classList.add("between-levels--first-change");
    } else if (currentLevel[1].textContent == "3") {
        text.textContent = "Impressive!";
        messagesSection.classList.add("between-levels--second-change");
        // Cambiamos el contenido textual del botón para pasar al siguiente nivel, ya que en esta pantalla nos lleva al nivel 1 otra vez
        button.textContent = "Play again";
        // Mostramos el footer y el botón de compartir
        footer.classList.remove("hidden");
        shareButton.classList.remove("hidden");
    } else {
        text.textContent = "Nice!";
        // Por si el jugador inicia de nuevo el juego tras acabar el tercer nivel
        button.textContent = "Next level";
        messagesSection.classList.remove("between-levels--first-change");
        messagesSection.classList.remove("between-levels--second-change");
    }
}