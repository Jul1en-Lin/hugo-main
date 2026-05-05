function initPostFilters() {
    const tools = document.querySelector('[data-post-tools]');
    if (!tools) return;

    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-blog-filter]'));
    const search = document.querySelector<HTMLInputElement>('[data-blog-search]');
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-blog-card]'));
    const empty = document.querySelector<HTMLElement>('[data-blog-empty]');
    const count = document.querySelector<HTMLElement>('[data-blog-count]');

    let activeCategory = 'all';

    function normalize(value: string) {
        return value.trim().toLowerCase();
    }

    function applyFilters() {
        const query = normalize(search?.value || '');
        let visible = 0;

        cards.forEach((card) => {
            const categories = normalize(card.dataset.categories || '');
            const title = normalize(card.dataset.title || '');
            const summary = normalize(card.dataset.summary || '');
            const matchesCategory = activeCategory === 'all' || categories.split(/\s+/).includes(activeCategory);
            const matchesQuery = !query || title.includes(query) || summary.includes(query);
            const shouldShow = matchesCategory && matchesQuery;

            card.hidden = !shouldShow;
            if (shouldShow) visible += 1;
        });

        if (empty) empty.hidden = visible !== 0;
        if (count) count.textContent = String(visible);
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            activeCategory = normalize(button.dataset.blogFilter || 'all');
            buttons.forEach((item) => {
                const isActive = item === button;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
            applyFilters();
        });

        button.addEventListener('keydown', (event) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

            event.preventDefault();
            const currentIndex = buttons.indexOf(button);
            let nextIndex = currentIndex;

            if (event.key === 'ArrowLeft') nextIndex = currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1;
            if (event.key === 'ArrowRight') nextIndex = currentIndex >= buttons.length - 1 ? 0 : currentIndex + 1;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = buttons.length - 1;

            buttons[nextIndex]?.focus();
        });
    });

    search?.addEventListener('input', applyFilters);
    applyFilters();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostFilters);
} else {
    initPostFilters();
}
