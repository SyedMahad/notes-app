const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
  renderMarkdown: (markdownText) => ipcRenderer.invoke('render-markdown', markdownText),
});
