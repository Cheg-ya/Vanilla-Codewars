const codeContainer = document.getElementById('codeContainer');
const codeEditor = document.getElementById('codeEditor');
const userForm = document.getElementById('userForm');

const defaultCode = [
  'function solution (arr) {',
  '\treturn "김서방은 " + arr.indexOf("Kim") + "에 있다";',
  '}'
].join('\n');

require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});

let editor;

require(['vs/editor/editor.main'], () => {
  editor = monaco.editor.create(codeEditor, {
    value: defaultCode,
    language: 'javascript'
  });
});

const problemId = document.getElementsByClassName('problemInfo')[0];

userForm.addEventListener('submit', e => {
  e.preventDefault();

  const userAnswer = editor.getValue();
  debugger;
  fetch(`/problems/${problemId.dataset.problemId}`, { 
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ solution: userAnswer })
  }).then(res => res.json().then(result => showResult(result)));
});

function showResult (result) {
  const { allPassed, executionResults } = result;

  if (allPassed) {
    const successTemplate = _.template(
      `<div class="resultContainer">
        <h4>Result</h4>
        <table class="contents">
          <tr>
            <td>
              <span>Expected</span>
            </td>
            <td>
              <span>Instead</span>
            </td>
          </tr>
          <% _.forEach(results, ({ result, expectedAnswer, userAnswer }) => { %>
            <tr class=<%= result %>>
              <td>
                <%= expectedAnswer %>
              </td>
              <td>
                <%= userAnswer %>
              </td>
            </tr>
          <% }) %>
        </table>
        <button class="backBtn"><a href="/">Back to main</a></button>
      </div>`
    );

    const successResult = successTemplate({ results: executionResults });

    document.getElementById('resultBoard').innerHTML = successResult;

  } else {
    const failureTemplate = _.template(
      `<div class="resultContainer">
        <h4>Result</h4>
        <table class="contents">
          <tr>
            <td>
              <span>Expected</span>
            </td>
            <td>
              <span>Instead</span>
            </td>
          </tr>
          <% _.forEach(results, ({ result, expectedAnswer, userAnswer }) => { %>
            <tr class=<%= result %>>
              <td>
                <%= expectedAnswer %>
              </td>
              <td>
                <%= userAnswer %>
              </td>
          </tr>
          <% }) %>
        </table>
      </div>`
    );

    const failureResult = failureTemplate({ results: executionResults });

    document.getElementById('resultBoard').innerHTML = failureResult;
  }
}
