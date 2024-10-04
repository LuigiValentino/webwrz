function getEl(id) {
    return document.getElementById(id);
}

const iFrame = getEl('iFrame');
const saveBtn = getEl('saveBtn');
const loadBtn = getEl('loadBtn');
const templateBtn = getEl('templateBtn');
const templateModal = getEl('templateModal');
const closeTemplateModal = getEl('closeTemplateModal');
const saveTemplateBtn = getEl('saveTemplateBtn');
const exportBtn = getEl('exportBtn');
const shareBtn = getEl('shareBtn');
const customTemplatesContainer = getEl('customTemplates');

const htmlTextArea = CodeMirror.fromTextArea(getEl('html-code'), {
    mode: 'htmlmixed',
    theme: 'dracula',
    lineNumbers: true
});
const cssTextArea = CodeMirror.fromTextArea(getEl('css-code'), {
    mode: 'css',
    theme: 'dracula',
    lineNumbers: true
});
const jsTextArea = CodeMirror.fromTextArea(getEl('js-code'), {
    mode: 'javascript',
    theme: 'dracula',
    lineNumbers: true
});
const templates = {
    basic: {
        html: '<h1>Hola Mundo</h1>',
        css: 'body { font-family: Arial, sans-serif; }',
        js: 'console.log("Hola Mundo");'
    },
    bootstrap: {
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plantilla Bootstrap</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1 class="mt-5">Hola Mundo</h1>
        <button class="btn btn-primary">Botón</button>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>`,
        css: '',
        js: ''
    },
    vue: {
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plantilla Vue.js</title>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.12"></script>
</head>
<body>
    <div id="app">
        <h1>{{ message }}</h1>
    </div>
    <script>
        new Vue({
            el: '#app',
            data: {
                message: 'Hola Mundo'
            }
        });
    </script>
</body>
</html>`,
        css: '',
        js: ''
    },
    tailwind: {
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plantilla TailwindCSS</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 text-gray-800">
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold">Hola Mundo</h1>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Botón</button>
    </div>
</body>
</html>`,
        css: '',
        js: ''
    },
    react: {
        html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plantilla React</title>
    <script src="https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/babel-standalone@6.26.0/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        function App() {
            return <h1>Hola Mundo</h1>;
        }
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>`,
        css: '',
        js: ''
    }
};


function updatePreview() {
    const doc = iFrame.contentWindow.document;
    doc.open();
    doc.writeln(`
        <html>
        <head>
            <style>${cssTextArea.getValue()}</style>
        </head>
        <body>${htmlTextArea.getValue()}<script>${jsTextArea.getValue()}<\/script></body>
        </html>
    `);
    doc.close();
}

function loadCustomTemplates() {
    const customTemplates = JSON.parse(localStorage.getItem('customTemplates')) || [];
    customTemplatesContainer.innerHTML = '';
    customTemplates.forEach((template, index) => {
    const btn = document.createElement('button');
    btn.className = 'template-option bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded';
    btn.dataset.template = `custom-${index}`;
    btn.textContent = template.name;
    btn.addEventListener('click', () => {
        htmlTextArea.setValue(template.html);
        cssTextArea.setValue(template.css);
        jsTextArea.setValue(template.js);
        updatePreview(); 
        templateModal.classList.add('hidden');
    });
    customTemplatesContainer.appendChild(btn);
});

}

document.body.addEventListener('input', updatePreview);

saveBtn.addEventListener('click', function () {
    const project = {
        html: htmlTextArea.getValue(),
        css: cssTextArea.getValue(),
        js: jsTextArea.getValue()
    };
    localStorage.setItem('onlineWebEditorProject', JSON.stringify(project));
    alert('¡Proyecto guardado!');
});

loadBtn.addEventListener('click', function () {
    const project = JSON.parse(localStorage.getItem('onlineWebEditorProject'));
    if (project) {
        htmlTextArea.setValue(project.html);
        cssTextArea.setValue(project.css);
        jsTextArea.setValue(project.js);
        updatePreview();
        alert('¡Proyecto cargado!');
    } else {
        alert('¡No se encontró ningún proyecto guardado!');
    }
});

templateBtn.addEventListener('click', function () {
    templateModal.classList.remove('hidden');
    loadCustomTemplates();
});

closeTemplateModal.addEventListener('click', function () {
    templateModal.classList.add('hidden');
});

saveTemplateBtn.addEventListener('click', function () {
    const templateName = prompt('Ingrese el nombre de la plantilla:');
    if (templateName) {
        const customTemplates = JSON.parse(localStorage.getItem('customTemplates')) || [];
        const newTemplate = {
            name: templateName,
            html: htmlTextArea.getValue(),
            css: cssTextArea.getValue(),
            js: jsTextArea.getValue()
        };
        customTemplates.push(newTemplate);
        localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
        alert('¡Plantilla guardada!');
    }
});

exportBtn.addEventListener('click', function () {
    const project = {
        html: htmlTextArea.getValue(),
        css: cssTextArea.getValue(),
        js: jsTextArea.getValue()
    };
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

shareBtn.addEventListener('click', function () {
    const project = {
        html: htmlTextArea.getValue(),
        css: cssTextArea.getValue(),
        js: jsTextArea.getValue()
    };
    const encodedProject = encodeURIComponent(JSON.stringify(project));
    const shareUrl = `${window.location.origin}${window.location.pathname}?project=${encodedProject}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('¡Enlace compartido copiado al portapapeles!');
    });
});

function loadProjectFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedProject = urlParams.get('project');
    if (encodedProject) {
        const project = JSON.parse(decodeURIComponent(encodedProject));
        htmlTextArea.setValue(project.html);
        cssTextArea.setValue(project.css);
        jsTextArea.setValue(project.js);
        updatePreview();
        alert('¡Proyecto cargado desde el enlace!');
    }
}

function autoSave() {
    const project = {
        html: htmlTextArea.getValue(),
        css: cssTextArea.getValue(),
        js: jsTextArea.getValue()
    };
    localStorage.setItem('onlineWebEditorProject', JSON.stringify(project));
}

window.addEventListener('DOMContentLoaded', () => {
    updatePreview();
    loadProjectFromUrl();
    setInterval(autoSave, 30000); 
});
