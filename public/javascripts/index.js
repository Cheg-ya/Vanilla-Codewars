const codeContainer = document.getElementById('codeContainer');
const codeEditor = document.getElementById('codeEditor');
const userForm = document.getElementById('userForm');

const defaultCode = [
  'function solution (arr) {',
  '\treturn "김서방은 " + arr.indexOf("Kim") + "에 있다";',
  '}'
].join('\n');

require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});

require(['vs/editor/editor.main'], () => {
  const editor = monaco.editor.create(codeEditor, {
    value: defaultCode,
    language: 'javascript'
  });
});

codeContainer.value = defaultCode;

codeEditor.addEventListener('keyup', e => {
  codeContainer.value = e.target.value;
});

const problemId = document.getElementsByClassName('problemInfo')[0];

userForm.addEventListener('submit', e => {
  e.preventDefault();

  fetch(`/problems/${problemId.dataset.problemId}`, { method: 'POST' }).then(res => res.json()
  .then(result => {
    const userAnswer = e.target.children[0].value;
    const { tests } = result;
    const executionResults = [];    
    const solution = new Function(`return (${userAnswer})(...arguments)`);

    for (let i = 0; i < tests.length; i++) {
      let userAnswer;

      try {
        userAnswer = eval(tests[i].code);

      } catch (err) {
        userAnswer = err.message;
      }

      const expectedAnswer = tests[i].solution;

      if (userAnswer !== expectedAnswer) {
        executionResults.push({ result: 'failed', expectedAnswer, userAnswer });

      } else {
        executionResults.push({ result: 'passed', expectedAnswer, userAnswer });
      }
    }

    let testResult;

    if (executionResults.every(({ result }) => result === 'passed')) {
      testResult = { allPassed: true, executionResults };

    } else {
      testResult = { allPassed: false, executionResults };
    }

    showResult(testResult);
  }));
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

    document.getElementById('displayResult').innerHTML = successResult;

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
