(() => {
    const dialog = document.querySelector('.contact-dialog');
    let opener;
    document.querySelectorAll('[data-contact-open]').forEach(button => button.addEventListener('click', () => {
        opener = button;
        dialog.showModal();
        document.body.classList.add('modal-open')
    }));

    function close() {
        dialog.close()
    }

    dialog.querySelector('.contact-close').addEventListener('click', close);
    dialog.addEventListener('click', event => {
        if (event.target === dialog) {
            const r = dialog.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close()
        }
    });
    dialog.addEventListener('close', () => {
        document.body.classList.remove('modal-open');
        opener?.focus()
    })
})();

(() => {
    const dialog = document.querySelector('.share-dialog');
    const url = 'https://aleksgelvides.github.io/landing/';
    const title = 'Алексей Гельвидес — Java / Kotlin Backend Developer';
    const text = 'Backend-разработчик: Java / Kotlin, микросервисы, интеграции и отказоустойчивость.';
    const status = dialog.querySelector('.share-status');
    const input = dialog.querySelector('input');
    input.value = url;
    dialog.querySelector('[data-share="telegram"]').href = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
    dialog.querySelector('[data-share="whatsapp"]').href = 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + url);
    dialog.querySelector('[data-share="email"]').href = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(text + '\n\n' + url);
    let opener;
    const seenKey = 'landing-share-prompt-seen';
    let seen = false;
    try {
        seen = sessionStorage.getItem(seenKey) === '1'
    } catch {
    }

    function markSeen() {
        seen = true;
        try {
            sessionStorage.setItem(seenKey, '1')
        } catch {
        }
    }

    function openShare(button) {
        opener = button;
        status.textContent = '';
        dialog.showModal();
        document.body.classList.add('modal-open');
        markSeen()
    }

    let promptTimer;
    let countdownStarted = false;
    let promptReady = false;

    function atEnd() {
        return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 45
    }

    function showReadyPrompt() {
        if (!seen && promptReady && !document.hidden && !document.querySelector('dialog[open]')) {
            promptReady = false;
            openShare(document.querySelector('[data-share-open]'))
        }
    }

    function checkPrompt() {
        if (!seen && !countdownStarted && !document.hidden && atEnd()) {
            countdownStarted = true;
            promptTimer = setTimeout(() => {
                promptReady = true;
                showReadyPrompt()
            }, 3000)
        }
        showReadyPrompt()
    }

    window.addEventListener('scroll', checkPrompt, {passive: true});
    window.addEventListener('resize', checkPrompt);
    document.addEventListener('visibilitychange', checkPrompt);
    document.querySelectorAll('dialog').forEach(item => {
        item.addEventListener('close', checkPrompt);
        new MutationObserver(checkPrompt).observe(item, {attributes: true, attributeFilter: ['open']})
    });
    checkPrompt();
    document.querySelectorAll('[data-share-open]').forEach(button => button.addEventListener('click', () => openShare(button)));
    dialog.querySelector('.contact-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
        if (event.target === dialog) {
            const r = dialog.getBoundingClientRect();
            if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close()
        }
    });
    dialog.addEventListener('close', () => {
        document.body.classList.remove('modal-open');
        opener?.focus()
    });
    dialog.querySelector('[data-copy-link]').addEventListener('click', async () => {
        try {
            if (!navigator.clipboard?.writeText) throw Error();
            await navigator.clipboard.writeText(url);
            status.textContent = 'Ссылка скопирована.'
        } catch {
            input.focus();
            input.select();
            status.textContent = 'Скопируйте выделенную ссылку: Ctrl+C или ⌘C.'
        }
    });
    const native = dialog.querySelector('[data-system-share]');
    native.hidden = typeof navigator.share !== 'function';
    native.addEventListener('click', async () => {
        try {
            await navigator.share({title, text, url})
        } catch (error) {
            if (error.name !== 'AbortError') status.textContent = 'Выберите другой способ отправки.'
        }
    });
})();

document.addEventListener('keydown', event => {
    if (event.key === 'Tab') document.body.classList.add('keyboard-navigation')
});
document.addEventListener('pointerdown', () => document.body.classList.remove('keyboard-navigation'));
