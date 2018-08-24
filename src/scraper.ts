import * as cheerio from 'cheerio';
import * as request from 'request-promise';
import * as urlJoin from 'url-join';
import * as normalizeURL from 'normalize-url';

export class Scraper {
  public async scrape(
    url: string,
    state: any,
    fn: (url: string, source: string, state: any) => void,
    depth: number,
    maximumDepth: number,
    ignoreURLs: string[],
  ): Promise<void> {
    ignoreURLs.push(url);

    let source: string = null;

    try {
      source = await this.getSource(url);
    } catch (error) {
      return;
    }

    fn(url, source, state);

    if (depth >= maximumDepth) {
      return;
    }

    const cheerioInstance = cheerio.load(source);

    const links: string[] = cheerioInstance('a')
      .toArray()
      .map((element) => element.attribs['href'])
      .filter((link: string) => link);

    for (const link of links) {
      const linkURL: string = this.isAbsoluteURL(link) ? this.normalizeURL(link) : this.normalizeURL(this.joinURL(url, link));

      if (ignoreURLs.includes(linkURL)) {
        continue;
      }

      await this.scrape(linkURL, state, fn, depth + 1, maximumDepth, ignoreURLs);
    }
  }

  protected async getSource(url: string): Promise<string> {
    return request.get(url);
  }

  protected isAbsoluteURL(url: string): boolean {
    return new RegExp(/^https?:\/\//i).test(url);
  }

  protected joinURL(part1: string, part2: string): string {
      if (part2.startsWith('/')) {
        const host: string = new RegExp(/^https?:\/\/[^\/]+/i).exec(part1)[0];

        return this.joinURL(host, part2);
      }
    

    return this.joinURL(part1, part2);
  }

  protected normalizeURL(url: string): string {
    return normalizeURL(url, {
        stripWWW: false,
    });
  }
}
