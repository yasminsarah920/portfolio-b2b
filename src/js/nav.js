
// ===================================================
// MENU RESPONSIVO
// ===================================================

export function initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    // Verifica se os elementos existem antes de continuar
    if (!menuToggle || !navMenu) {
        return;
    }

    // Relaciona o botão ao menu para acessibilidade
    menuToggle.setAttribute('aria-controls', 'nav-menu');
    menuToggle.setAttribute('aria-expanded', 'false');

    // Alterna o menu ao clicar no botão
    menuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');

        // Atualiza o estado de acessibilidade
        menuToggle.setAttribute('aria-expanded', String(isActive));
    });

    // Fecha o menu ao clicar em qualquer link
    const navLinks = navMenu.querySelectorAll('.nav-links a');

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Fecha o menu ao pressionar a tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
    });
}

