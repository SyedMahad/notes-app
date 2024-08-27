const { app, BrowserWindow, ipcMain } = require('electron');
const marked = require('marked');
const path = require('path');
const fs = require('fs');


let mainWindow;

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile('index.html');

  // For development purpose
  if (mainWindow) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('render-markdown', async (event, content) => {
  return new Promise((resolve, reject) => {
    try {
        const parsedHTML = marked.parse(content);
        resolve(parsedHTML);
    } catch (error) {
        reject(error);
    }
  });
});

ipcMain.handle('save-file', async (event, filePath, content) => {
  return new Promise((resolve, reject) => {
    // fs.writeFile(filePath, content, 'utf8', (err) => {
    fs.writeFile(filePath, content, 'utf-8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('File saved successfully');
      }
    });
  });
});

ipcMain.handle('load-file', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    // fs.readFile(filePath, 'utf8', (err, data) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
});

