import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
  let window = new BrowserWindow({ width: 800, height: 620 });

  window.setMenu(null);

  // window.webContents.openDevTools();

  window.loadFile(`${path.join(__dirname, 'index.html')}`);

  window.on('closed', () => {
    window = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
