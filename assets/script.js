(() => {
    const yearNodes = document.querySelectorAll('[data-current-year]');
    const year = new Date().getFullYear();

    yearNodes.forEach((node) => {
        node.textContent = year;
    });

    const toast = document.getElementById('toast');
    let toastTimer;

    const showToast = (message) => {
        if (!toast) return;

        window.clearTimeout(toastTimer);

        toast.textContent = message;
        toast.classList.add('is-visible');

        toastTimer = window.setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 1800);
    };

    document.querySelectorAll('[data-copy-email]').forEach((button) => {
        button.addEventListener('click', async () => {
            const email = button.getAttribute('data-copy-email');

            if (!email) return;

            try {
                await navigator.clipboard.writeText(email);

                showToast('Email copied');
            } catch (error) {
                window.location.href = `mailto:${email}`;
            }
        });
    });
})();