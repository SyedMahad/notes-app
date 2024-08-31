const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {

  saveNote: (folderName, noteName, content) => ipcRenderer.invoke('save-note', folderName, noteName, content),
  loadNote: (folderName, noteName) => ipcRenderer.invoke('load-note', folderName, noteName),
  renderMarkdown: (markdownText) => ipcRenderer.invoke('render-markdown', markdownText),
  loadFolders: () => ipcRenderer.invoke('load-folders'),
  loadNotes: (folderName) => ipcRenderer.invoke('load-notes', folderName),
  createFolder: (folderName) => ipcRenderer.invoke('create-folder', folderName),

});
