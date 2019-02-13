const codeContainer = document.getElementById('codeContainer');
const codeEditor = document.getElementById('codeEditor');
let defaultCode = [
  'function solution (arr) {',
  '\treturn "김서방은 " + arr.indexOf("Kim") + "에 있다";',
  '}'
].join('\n');

require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});

if (!codeContainer.value.length) {
  require(['vs/editor/editor.main'], function() {
    const editor = monaco.editor.create(codeEditor, {
      value: defaultCode,
      language: 'javascript'
    });
  });

} else {
  defaultCode = codeContainer.value;

  require(['vs/editor/editor.main'], function() {
    const editor = monaco.editor.create(codeEditor, {
      value: defaultCode,
      language: 'javascript'
    });
  });
}

codeContainer.value = defaultCode;

codeEditor.addEventListener('keyup', function (e) {
  codeContainer.value = e.target.value;
});
