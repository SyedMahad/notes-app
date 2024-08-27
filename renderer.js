const markdownTextArea = document.getElementById('markdown');
const previewDiv = document.getElementById('preview');


// Convert Markdown to HTML using the exposed API from preload.js
function renderMarkdownToHtml(markdownText) {  
  window.api.renderMarkdown(markdownText)
  .then((htmlContent) => {
    previewDiv.innerHTML = htmlContent;
  })
  .catch((error) => {
    console.error("Error rendering markdown:", error);
  })
}

// Event listener for textarea input
markdownTextArea.addEventListener('input', () => {
  const markdownContent = markdownTextArea.value;
  renderMarkdownToHtml(markdownContent);
});

// Initial render
renderMarkdownToHtml(markdownTextArea.value);

// Example usage of file saving and loading
async function saveCurrentNote() {
  const content = markdownTextArea.value;
  const filePath = 'note.md'; // Example path, you may prompt the user for this
  await window.api.saveFile(filePath, content);
  alert('Note saved!');
}

async function loadNote() {
  const filePath = 'note.md'; // Example path, you may prompt the user for this
  const content = await window.api.loadFile(filePath);
  markdownTextArea.value = content;
  renderMarkdownToHtml(content);
}

// Initial render
renderMarkdownToHtml(markdownTextArea.value);

// Example triggers for saving and loading (could be buttons in the HTML)
// saveCurrentNote();
// loadNote();
