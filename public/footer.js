//public/footer.js

window.addEventListener('DOMContentLoaded', () => {
    const footer = document.createElement('footer');
    footer.className = 'site-footer text-center';
    footer.innerHTML = `&copy; ${new Date().getFullYear()} <a href="/" class="footer-link">FancyAlt</a>. All rights reserved.`;
    document.body.appendChild(footer);
});
