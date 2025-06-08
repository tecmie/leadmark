import { convert } from 'html-to-text';
// import * as cheerio from 'cheerio';
// import axios from 'axios';


export function textFromHtml(htmlText: string) {
  // Convert HTML to plain text
  const plainText = convert(htmlText, {
    preserveNewlines: false,
    selectors: [
      { selector: 'h1', options: { uppercase: false } },
      { selector: 'h2', options: { uppercase: false } },
      { selector: 'h3', options: { uppercase: false } },
      { selector: 'h4', options: { uppercase: false } },
      { selector: 'h5', options: { uppercase: false } },
      { selector: 'h6', options: { uppercase: false } },
    ],
    wordwrap: false,
  });

  return plainText;
}

export type ParsedLink = {
  href: string;
  text: string;
  rawContent?: string;
  parsedContent?: string;
};
// export function parseHtmlLinks(text: string): ParsedLink[] {
//   // Parse the HTML links from the text using Cheerio
//   const $ = cheerio.load(text);
//   const links: ParsedLink[] = [];

//   $('a').each((index, element) => {
//     const href = $(element).attr('href') ?? '';
//     const text = $(element).text();
//     links.push({ href, text });
//   });

//   return links;
// }


// export async function isSitemap(link: string): Promise<boolean> {
//   try {
//     const response = await axios.get(link);
//     const $ = cheerio.load(response.data);

//     // Check if the page contains a common sitemap tag or format
//     return $('sitemap, loc, urlset').length > 0;
//   } catch (error:any) {
//     console.error('Error checking if link is a sitemap:', error.message);
//     return false;
//   }
// }

// export async function fetchLinksFromSitemap(sitemapUrl: string): Promise<string[]> {
//   try {
//     const response = await axios.get(sitemapUrl);
//     const $ = cheerio.load(response.data);

//     // Extract all the links from the sitemap
//     const links: string[] = [];
//     $('loc').each((index, element) => {
//       links.push($(element).text());
//     });

//     return links;
//   } catch (error:any) {
//     console.error('Error fetching links from sitemap:', error.message);
//     return [];
//   }
// }
