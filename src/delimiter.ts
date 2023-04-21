const PREFIX = ['<%%', '<%=', '<%-', '<%_', '<%#', '<%'];
const SUFIX = ['%%>', '%>', '-%>', '_%>'];

export type TagsData = {
    prefix: string[];
    sufix: string[];
}

export type TagsHashStore = {
    [key: string]: string;
}

const createTag = (
    values: string[],
    oldDelimiter: string,
    newDelimiter?: string
): string[] => {
    if (!newDelimiter) {
        return values;
    }

    return values.map((val: string) => {
        return val.split(oldDelimiter).join(newDelimiter);
    });
}

export const getTagsData = (
    delimiter?: string,
    openDelimiter?: string,
    closeDelimiter?: string
): TagsData => {
    let prefix = createTag(PREFIX, '<', openDelimiter);
    let sufix = createTag(SUFIX, '>', closeDelimiter);

    if (delimiter) {
        prefix = createTag(prefix, '%', delimiter);
        sufix = createTag(sufix, '%', delimiter);
    }

    return { prefix, sufix };
}

export const generateTagsHashStore = (tagsData: TagsData): TagsHashStore => {
    const { prefix, sufix } = tagsData || {};

    return [...prefix, ...sufix].reduce((acc: TagsHashStore, sym: string) => {
        let hash = '';

        for (let i = 0; i < sym.length; i++) {
            hash += sym[i].charCodeAt(0);
        }

        acc[sym] = hash;

        return acc;
    }, {});
}

export const splitEjsByDelimiters = (template: string, tagsData: TagsData): string[] => {
    const regex = new RegExp([
        ...tagsData.prefix,
        ...tagsData.sufix
    ].join('|'));
    const arr = [];
    let result = regex.exec(template);
    let firstPos;

    while (result) {
        firstPos = result.index;

      if (firstPos !== 0) {
        arr.push(template.substring(0, firstPos));
        template = template.slice(firstPos);
      }

      arr.push(result[0]);
      template = template.slice(result[0].length);
      result = regex.exec(template);
    }

    if (template) {
      arr.push(template);
    }

    return arr;
}