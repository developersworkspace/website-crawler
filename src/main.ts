import { Crawler } from './crawler';
import * as fs from 'fs';
import { remote } from 'electron';

const loader = document.querySelector('div.loading') as HTMLDivElement;

const txtListOfURLs = document.querySelector('textarea#listOfURLs') as HTMLTextAreaElement;

const txtListOfPatterns = document.querySelector('textarea#listOfPatterns') as HTMLTextAreaElement;

const txtDepth = document.querySelector('input#depth') as HTMLInputElement;

const btnCrawl = document.querySelector('button#crawl');

btnCrawl.addEventListener('click', async () => {
  loader.style.display = 'block';

  const urls: string[] = txtListOfURLs.value.split('\n');
  const patterns: string[] = txtListOfPatterns.value.split('\n');

  const crawler: Crawler = new Crawler();

  const state: string[] = [];

  const ignoredURLs: string[] = [];

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

  loader.style.display = 'none';
});
