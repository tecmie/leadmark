import { Parser } from 'htmlparser2';

/** 
 * identify the position of the link in
 * the text so that we can parse the link and inject it's return value back into the position we got it from
 * @example
 * const message = "Subject Line Analysis: Analyze the subject line of the email. Newsletters like this https://js.langchain.com/docs/modules/chains/other_chains/multi_prompt_chain often have catchy or promotional subject lines that aim to attract attention.";
 * const links = extractHttpLinks(message);
 * console.log(links);
 * // => [
  {
    link: "https://js.langchain.com/docs/modules/chains/other_chains/multi_prompt_chain",
    position: 54
  }
]
*/
export function extractHttpLinks(text: string) {
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const matches = [];
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    const link = match[0];
    const position = match.index;
    matches.push({ link, position });
  }
  return matches;
}

/**
 * @name extractLinksWithIndex
 * @description This function uses a regular expression (linkRegex) to match and extract links from the given text.
 * It accounts for various link formats, including those with different protocols (http://, https://) and links starting with www.
 * It also handles different punctuation marks at the end of the link using the punctuationRegex.
 * The function iterates through all the matches found using linkRegex and constructs an array of objects,
 * each containing the extracted link, its start index, and its end index (excluding any trailing punctuation marks).
 * @param text
 * @returns [{ link, startIndex, endIndex }] of links with start and end index
 */

export function extractLinksWithIndex(text: string) {
  /// full plain text link extraction
  const linkRegex = /(?:www\.|(?:https?:\/\/))[^\s/$.?#].[^\s]*/gi;
  // plain text and failed attempt at html
  // const linkRegex = /(?:(?:href=['"])?(https?:\/\/\S+)|(?:www\.\S+))(?=['"])/gi;
  const punctuationRegex = /[.,?!)]*$/;

  const matches = [];
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    const link = match[0];
    const startIndex = match.index;
    const endIndex = linkRegex.lastIndex - 1;
    const punctuationMatch = punctuationRegex.exec(link);
    const punctuationLength = punctuationMatch ? punctuationMatch[0].length : 0;
    const linkEndIndex = endIndex - punctuationLength;

    matches.push({
      link,
      startIndex,
      endIndex: linkEndIndex,
    });
  }

  return matches;
}

/**
 * @name extractLinksFromHTML
 *
 * In this updated implementation, we create an instance of the Parser class from the htmlparser2 package.
 * We define an onopentag event handler that triggers whenever an opening tag is encountered.
 * If the tag is an <a> tag and it has an href attribute, we extract the link and its corresponding start and end indexes.
 * @see https://astexplorer.net/#/2AmVrGuGVJ
 */

export function extractLinksFromHTML(htmlText: string) {
  const links: any[] = [];

  const parser = new Parser(
    {
      onopentag(name, attribs) {
        if (name === 'a' && attribs.href) {
          links.push({
            link: attribs.href,
            startIndex: parser.startIndex,
            endIndex: parser.endIndex,
          });
        }
      },
    },
    { decodeEntities: true }
  );

  parser.write(htmlText);
  parser.end();

  return links;
}

/**
 * Extracts text content, image URLs, and hyperlink URLs from a given Cheerio DOM node and its children.
 * The extraction is performed recursively and the results are concatenated into a single string.
 *
 * @param {Object} node - The Cheerio DOM node to extract content from.
 * @param {string} base - The base URL for resolving relative URLs.
 * @param {string} [result=''] - The current result string to append new findings to.
 * @returns {string} The string with all found text, image URLs, and hyperlink URLs.
 *
 * @example
 * const $ = cheerio.load('<body><a href="/relative">Link</a><p>Text</p><img src="/image.jpg"></body>');
 * const textAndMeta = extractInnerTextAndMeta($.root()[0], 'http://example.com/');
 * console.log(textAndMeta); // Outputs: "Link URL: http://example.com/relative\nText\nImage URL: http://example.com/image.jpg\n"
 */
export const extractInnerTextAndMeta = (node: any, base: string, result = '') => {
  const { protocol, host } = new URL(base);
  const domain = `${protocol}//${host}/`;

  if (node.type === 'tag' || node.type === 'root') {
    // Handle image nodes
    if (node.name === 'img' && node.attribs.src) {
      let imageUrl = node.attribs.src;

      // If the URL starts with '/', it's a URL relative to the domain, so we build the absolute URL with the domain.
      if (imageUrl.startsWith('/')) {
        imageUrl = new URL(imageUrl, domain).toString();
      }
      // If the URL doesn't start with 'data:', it's a URL relative to the base URL, so we build the absolute URL with the base URL.
      else if (!imageUrl.startsWith('data:')) {
        imageUrl = new URL(imageUrl, base).toString();
      }

      // Add the image URL to the result string
      result += `Image URL: ${imageUrl}\n`;
    }

    // Handle link nodes
    if (node.name === 'a' && node.attribs.href) {
      let linkUrl = node.attribs.href;

      // If the URL starts with '/', it's a URL relative to the domain, so we build the absolute URL with the domain.
      if (linkUrl.startsWith('/')) {
        linkUrl = new URL(linkUrl, domain).toString();
      }
      // If the URL doesn't start with 'http:', it's a URL relative to the base URL, so we build the absolute URL with the base URL.
      else if (!linkUrl.startsWith('http')) {
        linkUrl = new URL(linkUrl, base).toString();
      }

      // Add the link URL to the result string
      result += `Link URL: ${linkUrl}\n`;
    }

    // Recursively handle the children of the current node
    for (const child of node.children) {
      result = extractInnerTextAndMeta(child, base, result);
    }
  }
  // Handle text nodes by adding their content to the result string
  else if (node.type === 'text') {
    result += node.data.trim() + '\n';
  }

  return result;
};
