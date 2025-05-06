//public/js/app.js

//initialize custom dark theme and JSONEditor config on DOM load
window.addEventListener('DOMContentLoaded', () => {
    if (window.JSONEditor && JSONEditor.defaults?.themes?.bootstrap5) {
        //define custom dark theme based on Bootstrap5
        class CustomDarkTheme extends JSONEditor.defaults.themes.bootstrap5 {
            getBackgroundColor() { return '#2a2a2a'; }
            getBorderColor() { return '#555'; }
            getInputColor() { return '#e0e0e0'; }
            getInputBackgroundColor() { return '#2a2a2a'; }
        }

        JSONEditor.defaults.themes['custom-dark'] = CustomDarkTheme;
        JSONEditor.defaults.iconlib = 'fontawesome5';

        //set default theme if dark mode is active
        if (document.body.classList.contains('dark-mode')) {
            JSONEditor.defaults.theme = 'custom-dark';
        }
    }
});

//DOM element references
const uploadForm = document.getElementById('uploadForm');
const urlForm = document.getElementById('urlForm');
const loading = document.getElementById('loading');
const resultBox = document.getElementById('result');
const jsonTreeBox = document.getElementById('jsonTree');
let jsonEditor;

//show loading spinner and hide result areas
function showLoading() {
    loading.style.display = 'block';
    resultBox.style.display = 'none';
    jsonTreeBox.style.display = 'none';
}

//hide loading spinner
function hideLoading() {
    loading.style.display = 'none';
}

//recursively expand any array fields (like 'tags')
function expandAllArrays(node) {
    if (!node) return;
    if (Array.isArray(node.value)) node.expand?.();
    if (node.childs) node.childs.forEach(expandAllArrays);
}

//render JSON result using JSONEditor
function displayResult(data) {
    resultBox.style.display = 'none';
    jsonTreeBox.style.display = 'block';

    //destroy existing editor if present
    if (jsonEditor) jsonEditor.destroy();

    const container = document.getElementById('jsonTree');
    jsonEditor = new JSONEditor(jsonTreeBox, {
        mode: 'view',
        mainMenuBar: false,
        navigationBar: false,
        statusBar: false,
        theme: document.body.classList.contains('dark-mode') ? 'custom-dark' : undefined
    });

    //load data into editor
    jsonEditor.set(data);

    //wait for rendering to complete, then expand array fields
    setTimeout(() => {
        if (jsonEditor && jsonEditor.node && jsonEditor.node.expand) {
            expandJsonNodes(jsonEditor.node);
        }
    }, 100);

    container.scrollIntoView({ behavior: 'smooth' });
}

//expands all tree nodes for full visibility of nested data
function expandJsonNodes(node) {
    if (node && typeof node.expand === 'function') {
        node.expand();
    }

    if (node && node.childs) {
        node.childs.forEach(child => expandJsonNodes(child));
    }
}

//show error message in result box
function displayError(message) {
    resultBox.textContent = `Error: ${message}`;
    resultBox.style.display = 'block';
    jsonTreeBox.style.display = 'none';
}

//handle image file upload form
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const formData = new FormData(uploadForm);
    try {
        const response = await fetch('/api/generate-caption', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unknown error occurred.');
        hideLoading();
        displayResult(data);
    } catch (err) {
        hideLoading();
        displayError(err.message);
    }
});

//handle image URL submission form
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showLoading();
    const img = urlForm.img.value;
    const mode = urlForm.mode.value;
    try {
        const response = await fetch(`/api/analyze-url?img=${encodeURIComponent(img)}&mode=${encodeURIComponent(mode)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unknown error occurred.');
        hideLoading();
        displayResult(data);
    } catch (err) {
        hideLoading();
        displayError(err.message);
    }
});

//toggle between dark/light mode and re-render JSONEditor if needed
const toggle = document.getElementById('darkToggle');
toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';

    if (jsonEditor && jsonEditor.get()) {
        const currentData = jsonEditor.get();
        jsonEditor.destroy();
        jsonEditor = new JSONEditor(jsonTreeBox, {
            mode: 'view',
            mainMenuBar: false,
            navigationBar: false,
            statusBar: false,
            theme: document.body.classList.contains('dark-mode') ? 'custom-dark' : undefined
        });
        jsonEditor.set(currentData);
        setTimeout(() => expandAllArrays(jsonEditor.node), 50);
    }
});

