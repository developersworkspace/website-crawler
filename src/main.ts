import { Scraper } from './scraper';

const scraper: Scraper = new Scraper();

const url: string = 'https://medium.com/@developersworkspace';
const state: string[] = [];
const ignoreURLs: string[] = [];

(async () => {
    await scraper.scrape(url, state, (url: string, source: string, state: any) => {
        console.log(url);
    }, 0, 1, ignoreURLs);
    
    console.log(ignoreURLs);
})();