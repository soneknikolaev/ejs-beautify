import js_beautify from 'js-beautify';
import { getTagsData } from './delimiter';
import { beautifyHtml } from './htmlCode';
import { beautifyJS } from './jsCode';

type Options = {
    delimiter?: string;
    openDelimiter?: string;
    closeDelimiter?: string;
    jsOptions?: js_beautify.JSBeautifyOptions;
    htmlOptions?: js_beautify.HTMLBeautifyOptions;
}

export const beautify = (template: string, opts?: Options): string => {
    const { delimiter, openDelimiter, closeDelimiter, jsOptions, htmlOptions } = opts || {};
    const tagsData = getTagsData(delimiter, openDelimiter, closeDelimiter);

    template = beautifyJS(template, tagsData, jsOptions);
    template = beautifyHtml(template, tagsData, htmlOptions);

    return template;
}
