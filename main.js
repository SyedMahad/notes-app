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

ipcMain.handle('save-note', async (event, folderName, noteName, content) =>{
  const folderPath = path.join(__dirname, 'notes', folderName);
  const filePath = path.join(folderPath, `${noteName}.md`);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }

    fs.writeFile(filePath, content, 'utf-8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve("Note saved successfully");
      }
    });
  });
});

ipcMain.handle('load-note', async (event, folderName, noteName) => {
  const filePath = path.join(__dirname, 'notes', folderName, `${noteName}.md`);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
});

ipcMain.handle('load-folders', async () => {
  const notesDir = path.join(__dirname, 'notes');
  return new Promise((resolve, reject) => {
    fs.readdir(notesDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const folders = files.filter(file => fs.lstatSync(path.join(notesDir, file)).isDirectory());
        resolve(folders);
      }
    });
  });
});

ipcMain.handle('create-folder', async (event, folderName) => {
  const folderPath = path.join(__dirname, 'notes', folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  return folderName;
});

ipcMain.handle('load-notes', async (event, folderName) => {
  const folderPath = path.join(__dirname, 'notes', folderName);

  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const notes = files
          .filter(file => file.isFile() && path.extname(file.name) === '.md')
          .map(file => path.basename(file.name, '.md'));
        resolve(notes);
      }
    });
  });
});


