
// ===================================================
// TESTIMONIALS - API FETCH & CENTERED CAROUSEL
// ===================================================

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const avatarImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
];

const SCROLL_AMOUNT = 340;

/**
 * Função principal da seção de depoimentos.
 */
export async function initTestimonials() {
    const cardsContainer = document.getElementById('testimonials-cards');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Verifica se o container existe na página.
    if (!cardsContainer) {
        return;
    }

    // Carrega os depoimentos da API.
    await loadTestimonials(cardsContainer);

    // Configura os botões de navegação.
    setupNavigation(cardsContainer, prevBtn, nextBtn);
}

/**
 * Busca os usuários da API e renderiza os cards.
 */
async function loadTestimonials(cardsContainer) {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Erro HTTP: ${response.status}`
            );
        }

        const users = await response.json();
        const firstFiveUsers = users.slice(0, 5);

        cardsContainer.innerHTML = '';

        firstFiveUsers.forEach((user, index) => {
            cardsContainer.insertAdjacentHTML(
                'beforeend',
                createCardHTML(user, index)
            );
        });

        // Inicializa o carrossel depois da renderização.
        initCarouselFocus(cardsContainer);

    } catch (error) {
        console.error(
            'Erro ao carregar a seção de depoimentos:',
            error
        );

        cardsContainer.innerHTML = `
            <p class="testimonials-error">
                Não foi possível carregar os depoimentos.
            </p>
        `;
    }
}

/**
 * Cria o HTML de um card de depoimento.
 */
function createCardHTML(user, index) {
    const avatarUrl =
        avatarImages[index] ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;

    return `
        <article class="testimonial-card">
            <div class="card-company">
                <span class="company-name">
                    ${escapeHTML(user.company.name)}
                </span>
            </div>

            <p class="card-text">
                "${escapeHTML(user.company.catchPhrase)}.
                ${escapeHTML(user.company.bs)}."
            </p>

            <div class="card-author">
                <img
                    src="${avatarUrl}"
                    alt="Foto de ${escapeHTML(user.name)}"
                    class="author-avatar"
                    loading="lazy"
                />

                <div class="author-info">
                    <h4 class="author-name">
                        ${escapeHTML(user.name)}
                    </h4>

                    <span class="author-role">
                        Co-founder / ${escapeHTML(user.address.city)}
                    </span>
                </div>
            </div>
        </article>
    `;
}

/**
 * Protege os dados recebidos da API antes de inseri-los no HTML.
 */
function escapeHTML(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}

/**
 * Configura os botões de navegação do carrossel.
 */
function setupNavigation(cardsContainer, prevBtn, nextBtn) {
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            cardsContainer.scrollBy({
                left: SCROLL_AMOUNT,
                behavior: 'smooth'
            });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            cardsContainer.scrollBy({
                left: -SCROLL_AMOUNT,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Atualiza o card visualmente ativo.
 */
function updateActiveCard(cardsContainer) {
    const cards =
        cardsContainer.querySelectorAll('.testimonial-card');

    if (!cards.length) {
        return;
    }

    const containerRect =
        cardsContainer.getBoundingClientRect();

    const containerCenter =
        containerRect.left + containerRect.width / 2;

    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();

        const cardCenter =
            cardRect.left + cardRect.width / 2;

        const distance =
            Math.abs(containerCenter - cardCenter);

        if (distance < minDistance) {
            minDistance = distance;
            closestCard = card;
        }
    });

    cards.forEach((card) => {
        card.classList.remove('active');
    });

    if (closestCard) {
        closestCard.classList.add('active');
    }
}

/**
 * Inicializa a posição inicial e o comportamento do carrossel.
 */
function initCarouselFocus(cardsContainer) {
    const cards =
        cardsContainer.querySelectorAll('.testimonial-card');

    // Centraliza inicialmente o terceiro card.
    if (cards.length >= 3) {
        const targetCard = cards[2];

        const containerWidth =
            cardsContainer.offsetWidth;

        const cardOffsetLeft =
            targetCard.offsetLeft;

        const cardWidth =
            targetCard.offsetWidth;

        cardsContainer.scrollLeft =
            cardOffsetLeft -
            (containerWidth / 2) +
            (cardWidth / 2);
    }

    // Define o card central como ativo.
    updateActiveCard(cardsContainer);

    // Atualiza o card ativo durante o scroll.
    cardsContainer.addEventListener(
        'scroll',
        () => updateActiveCard(cardsContainer),
        { passive: true }
    );
}

