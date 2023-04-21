import { js as beautifyJSBase, JSBeautifyOptions } from 'js-beautify';

import { splitEjsByDelimiters, TagsData } from './delimiter';

const HASH_KEY = `ejs-beautify`;
const JS_OPTIONS = {
    indent_size: 0,
    indent_char: "",
    max_preserve_newlines: 5,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: "normal",
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 0,
    indent_inner_html: false,
    comma_first: false,
    e4x: false,
    indent_empty_lines: false
}

const uncommentLines = (code: string): string => {
    return code
        // delete spaces between comments
        .split(`${HASH_KEY} */ /* ${HASH_KEY}`)
        .join(`${HASH_KEY} *//* ${HASH_KEY}`)
        // delete html wrapping comments
        .split(`/* ${HASH_KEY} `)
        .join('')
        .split(` ${HASH_KEY} */`)
        .join('');
}

const commentLine = (line: string): string => {
    if (line.slice(0, 2) === '/*' && line.slice(-2) === '*/') {
        return line;
    }

    return `/* ${HASH_KEY} ${line} ${HASH_KEY} */`;
}

const transformToJS = (
    arr: string[],
    tagsData: TagsData,
): string => {
    // comment html code
    const copy = [...arr];

    for (let i = 0; i < copy.length; i++) {
        if (tagsData.prefix.includes(copy[i])) {
            copy[i] = commentLine(copy[i]);
            
            if (copy[i - 1]) {
                copy[i - 1] = commentLine(copy[i - 1]);
            }
        } else if (tagsData.sufix.includes(copy[i])) {
            copy[i] = commentLine(copy[i]); 

            if (copy[i + 1] && !tagsData.prefix.includes(copy[i + 1])) {
                copy[i + 1] = commentLine(copy[i + 1]);
            }
        }
    }

    return copy.join('');
}

const toEjs = (str: string): string => {
    return uncommentLines(str).replace(/\n/g, '');
}

export const beautifyJS = (
    template: string,
    tagsData: TagsData,
    options?: JSBeautifyOptions,
): string => {
    const parsedTemplate = splitEjsByDelimiters(template, tagsData);
    // if js is not presented, skip js beautify
    if (parsedTemplate.length <= 1) {
        return template;
    }
    // create from ejs safe js, comment all html code
    const js = transformToJS(parsedTemplate, tagsData);
    // beautify created js
    const beautified = beautifyJSBase(js, { ...JS_OPTIONS, ...options });
    // transform js back to ejs
    return toEjs(beautified);
}