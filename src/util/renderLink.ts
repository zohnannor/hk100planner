export const WIKI_URL_BASE = 'https://hollowknight.wiki/w/';

type ParsedItemType = 'link' | 'text';

interface ParsedItem {
    type: ParsedItemType;
    val: string;
    link?: string;
}

const renderLink = (text: string) => {
    const result: ParsedItem[] = [];

    for (const match of text.matchAll(
        /(?<before>[^[]+)?(?:\[(?<val>[^\]]+)\])?(?:\((?<link>[^)]+)\))?/g
    )) {
        const { before, val, link } = match.groups || {};
        if (before) {
            result.push({
                type: 'text',
                val: before,
            });
        }
        if (val) {
            if (link) {
                result.push({
                    type: 'link',
                    val,
                    link: WIKI_URL_BASE + link,
                });
            } else {
                result.push({
                    type: 'link',
                    val,
                    link: WIKI_URL_BASE + val,
                });
            }
        }
    }

    return result;
};

export default renderLink;
