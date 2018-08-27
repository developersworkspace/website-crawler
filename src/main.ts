import { Crawler } from './crawler';
import * as fs from 'fs';
import { remote } from 'electron';

const loader = document.querySelector('div.loading') as HTMLDivElement;

const txtListOfURLs = document.querySelector('textarea#listOfURLs') as HTMLTextAreaElement;

const txtListOfPatterns = document.querySelector('textarea#listOfPatterns') as HTMLTextAreaElement;

const txtDepth = document.querySelector('input#depth') as HTMLInputElement;

const btnCrawl = document.querySelector('button#crawl');

const lbMessage = document.querySelector('label#message');

btnCrawl.addEventListener('click', async () => {
  lbMessage.innerHTML = '';
  
  const urls: string[] = txtListOfURLs.value.split('\n').filter((url: string) => url);

  if (!urls.length) {
    lbMessage.innerHTML = 'Enter at least one URL';
    return;
  }

  const patterns: string[] = txtListOfPatterns.value.split('\n').filter((url: string) => url);

  if (!patterns.length) {
    lbMessage.innerHTML = 'Enter at least one pattern';
    return;
  }

  const state: string[] = [];

  const ignoredURLs: string[] = [];

  loader.style.display = 'block';

  const crawler: Crawler = new Crawler();

  for (const url of urls) {
    await crawler.crawl(
      url,
      state,
      (url: string, source: string, state: any) => {
        for (const pattern of patterns) {
          if (new RegExp(pattern, 'i').test(source)) {
            state.push(`${pattern};${url}`);
          }
        }
      },
      0,
      parseInt(txtDepth.value),
      ignoredURLs,
    );
  }

  loader.style.display = 'none';

  const filePath: string = remote.dialog.showSaveDialog(undefined, {
    filters: [
      {
        name: 'CSV',
        extensions: ['*.csv'],
      },
    ],
  });

  if (filePath) {
    fs.writeFileSync(filePath, state.join('\n'));
  }  
});
