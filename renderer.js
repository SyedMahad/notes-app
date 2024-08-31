const markdownTextArea = document.getElementById('markdown');
const previewDiv = document.getElementById('preview-content');
const folderList = document.getElementById('folder-list');
const noteList = document.getElementById('note-list');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const saveFolderBtn = document.getElementById('save-folder-btn');
const addFolderBtn = document.getElementById('add-folder-btn');
const addNoteBtn = document.getElementById('add-note-btn');
const saveNoteBtn = document.getElementById('save-note-btn');
const folderNameInput = document.getElementById('folderName');
let currentFolder = '';
let currentNote = '';


async function loadFolders() {
  const folders = await window.api.loadFolders();
  folderList.innerHTML = '';

  folders.forEach(folder => {
    const folderItem = document.createElement('li');
    folderItem.textContent = folder;
    folderItem.addEventListener('click', () => loadNotes(folder));
    folderList.appendChild(folderItem);
  });
}

async function loadNotes(folderName) {
  currentFolder = folderName;
  const notes = await window.api.loadNotes(folderName);
  noteList.innerHTML = '';

  notes.forEach(note => {
    const noteItem = document.createElement('li');
    noteItem.textContent = note;
    noteItem.addEventListener('click', () => loadNoteContent(folderName, note));
    noteList.appendChild(noteItem);
  });
}

async function loadNoteContent(folderName, noteName) {
  currentNote = noteName;
  const content = await window.api.loadNote(folderName, noteName);
  markdownTextArea.value = content;

  renderMarkdownToHtml(content);
}

async function saveCurrentNote() {

  if (currentFolder && currentNote) {
    const content = markdownTextArea.value;
    await window.api.saveNote(currentFolder, currentNote, content);
    alert('Note saved!');
    loadNotes(currentFolder); // Reload the notes list
  } else {
    alert('No note selected to save.');
  }

  // // Focus back on the textarea to allow the user to start typing immediately
  // markdownTextArea.focus();
}

function renderMarkdownToHtml(markdownText) {
  window.api.renderMarkdown(markdownText)
    .then((htmlContent) => {
      previewDiv.innerHTML = htmlContent;
    })
    .catch((error) => {
      console.error("Error rendering markdown:", error);
    });
}

// Modal handling functions
addFolderBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

saveFolderBtn.addEventListener('click', async () => {
  const folderName = folderNameInput.value;

  if (folderName) {
    await window.api.createFolder(folderName); // Implement createFolder API in preload.js and main.js
    modal.style.display = 'none';
    loadFolders();
  } else {
    alert('Folder name is required');
  }
});

addNoteBtn.addEventListener('click', async () => {
  // Save the current note if there's any content in the textarea
  if (markdownTextArea.value.trim()) {
    const content = markdownTextArea.value;
    const randomName = content.split(' ').slice(0, 3).join(' ') || 'Untitled Note'; // Generate a name based on the first few words
    await window.api.saveNote(currentFolder, randomName, content);

    // Reload the notes list to include the newly saved note
    await loadNotes(currentFolder);
  }
  
  // Clear the editor and the preview for a new note
  markdownTextArea.value = ''; 
  renderMarkdownToHtml(''); // Clear the preview

  // Set up a new note state
  currentNote = 'New Note'; // You might want to handle this differently

  // Focus back on the textarea to allow the user to start typing immediately
  markdownTextArea.focus();
});

saveNoteBtn.addEventListener('click', saveCurrentNote);

markdownTextArea.addEventListener('input', () => {
  const markdownContent = markdownTextArea.value;

  renderMarkdownToHtml(markdownContent);
});

loadFolders(); // Load folders initially
