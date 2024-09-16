import {
    ARCANE_EGG,
    CHARM_NOTCH,
    ELEGANT_KEY,
    ESSENCE,
    GEO,
    JOURNAL,
    KINGS_IDOL,
    LOVE_KEY,
    PALE_ORE,
    SEAL,
    SIMPLE_KEY,
    SLY_KEY,
    TRAM_PASS,
} from '../assets';

const WIKI_URL_BASE = 'https://hollowknight.wiki/w/';

const ICONS: Record<string, string> = {
    GEO: GEO,
    ESSENCE: ESSENCE,
    PALE_ORE: PALE_ORE,
    CHARM_NOTCH: CHARM_NOTCH,
    TRAM_PASS: TRAM_PASS,
    "WANDERER'S_JOURNAL": JOURNAL,
    HALLOWNEST_SEAL: SEAL,
    "KING'S_IDOL": KINGS_IDOL,
    ARCANE_EGG: ARCANE_EGG,
    LOVE_KEY: LOVE_KEY,
    SIMPLE_KEY: SIMPLE_KEY,
    ELEGANT_KEY: ELEGANT_KEY,
    "SHOPKEEPER'S_KEY": SLY_KEY,
};

type ParsedItemType = 'link' | 'text' | 'icon';

interface ParsedItem {
    type: ParsedItemType;
    val: string;
    link?: string;
}

const toTitleCase = (s: string) =>
    s.replace(/^_*(.)|_+(.)/g, (_, c, d) =>
        c ? c.toUpperCase() : ' ' + d.toUpperCase()
    );

const renderLink = (text: string) => {
    const result: ParsedItem[] = [];

    for (const match of text.matchAll(
        /(?<before>[^[]+)?(?:\[(?<val>[^\]]+)\])?(?:\((?<link>(?:[^)(]|\([^)(]*\))*)\))?/g
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
                    link: link.startsWith('http') ? link : WIKI_URL_BASE + link,
                });
            } else {
                const icon = ICONS[val];
                if (icon) {
                    result.push({
                        type: 'icon',
                        val: icon,
                        link: WIKI_URL_BASE + toTitleCase(val.toLowerCase()),
                    });
                    continue;
                } else {
                    result.push({
                        type: 'link',
                        val,
                        link: WIKI_URL_BASE + val,
                    });
                }
            }
        }
    }

    return result;
};

export default renderLink;
