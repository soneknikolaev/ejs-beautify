import { html as beautifyHtmlBase, HTMLBeautifyOptions } from 'js-beautify';
import { splitEjsByDelimiters, generateTagsHashStore, TagsHashStore, TagsData } from './delimiter';

const EJS_TAG = 'ejs';
const SCOPE_TAG = 'scope';
const HTML_OPTIONS = {
    indent_size: 4,
    content_unformatted: [EJS_TAG],
    indent_with_tabs: false,
    wrap_line_length: 80
};

const transformToHTML = (
    arr: string[],
    tagsData: TagsData,
    tagsHashStore: TagsHashStore
): string => {
    const copy = [...arr];
    // Add html tag for js scopes
    for (let i = 0; i < arr.length; i++) {
        if (!tagsData.prefix.includes(copy[i - 1]) || !tagsData.sufix.includes(copy[i + 1])) {
            continue;
        }

        const jsCodeWithoutSpaces = arr[i].split(' ').join('');

        if (jsCodeWithoutSpaces.substring(jsCodeWithoutSpaces.length - 2) === '){') {
          copy[i + 1] = copy[i + 1] + '<' + SCOPE_TAG + '>';
        } else if (jsCodeWithoutSpaces.substring(jsCodeWithoutSpaces.length - 1) === '}') {
          copy[i - 1] = '</' + SCOPE_TAG + '>' + copy[i - 1];
        }
    }
    // replace ejs delimiter on html tags 
    let htmlWithoutEjs = copy.join('');

    htmlWithoutEjs = tagsData.prefix.reduce((acc: string, prefix: string) => {
        return acc
            .split(prefix)
            .map(item => item.trim())
            .join(`<${EJS_TAG}>${tagsHashStore[prefix]} `);
    }, htmlWithoutEjs);

    htmlWithoutEjs = tagsData.sufix.reduce((acc: string, sufix: string) => {
        return acc
            .split(sufix)
            .map(item => item.trim())
            .join(` ${tagsHashStore[sufix]}</${EJS_TAG}>`);
    }, htmlWithoutEjs);

    return htmlWithoutEjs;
}

const toEjs = (
    str: string,
    tagsData: TagsData,
    tagsHashStore: TagsHashStore
): string => {
    // delete block scopes tags
    let beautified = str.split('<' + SCOPE_TAG + '>').join('').split('</' + SCOPE_TAG + '>').join('');

    // delete ejs tags wrapping
    beautified = tagsData.prefix.reduce((acc: string, prefix: string) => {
        return acc.split(`<${EJS_TAG}>${tagsHashStore[prefix]} `).join(prefix + ' ');
    }, beautified);

    beautified = tagsData.sufix.reduce((acc: string, sufix: string) => {
        return acc.split(` ${tagsHashStore[sufix]}</${EJS_TAG}>`).join(' ' + sufix);
    }, beautified);

    // delete empty lines
    return beautified.replace(/^\s*\n/gm, '');
}

export const beautifyHtml = (
    template: string,
    tagsData: TagsData,
    options?: HTMLBeautifyOptions,
) => {
    const parsedTemplate = splitEjsByDelimiters(template, tagsData);
    // generate hash store for all delimiters symbols
    const tagsHashStore = generateTagsHashStore(tagsData);
    // create from ejs safe html
    const html = transformToHTML(parsedTemplate, tagsData, tagsHashStore);
    // beautify created html
    const mergedOptions = { ...HTML_OPTIONS, ...options };

    if (options && options.content_unformatted) {
        mergedOptions.content_unformatted = [
            ...HTML_OPTIONS.content_unformatted,
            ...options.content_unformatted
        ];
    }

    const beautified = beautifyHtmlBase(html, mergedOptions);
    // transform html back to ejs
    return toEjs(beautified, tagsData, tagsHashStore);
}