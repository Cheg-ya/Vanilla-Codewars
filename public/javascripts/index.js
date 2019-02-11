const codeContainer = document.getElementById('codeContainer');
const codeEditor = document.getElementById('codeEditor');
const defaultCode = [
    'function solution (arr) {',
    '\treturn "김서방은 " + arr.indexOf("Kim") + "에 있다";',
    '}'
].join('\n');

require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function() {
    var editor = monaco.editor.create(codeEditor, {
        value: defaultCode,
        language: 'javascript'
    });
});

codeContainer.value = defaultCode;

codeEditor.addEventListener('keyup', function (e) {
    codeContainer.value = e.target.value;
});
