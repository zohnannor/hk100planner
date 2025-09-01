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
    ROSARIES,
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

    ROSARIES: ROSARIES,
};

type ParsedItemType = 'link' | 'text' | 'icon' | 'monospace';

interface ParsedItem {
    type: ParsedItemType;
    val: string;
    link?: string;
}

const toTitleCase = (s: string) =>
    s.replace(/^_*(.)|_+(.)/g, (_, c, d) =>
        c ? c.toUpperCase() : ' ' + d.toUpperCase()
    );

const MD_URL_REGEX =
    /(?<before>[^[]+)?(?:\[(?<val>[^\]]+)\])?(?:\((?<link>(?:[^)(]|\([^)(]*\))*)\))?/g;

const renderLink = (text: string) => {
    const result: ParsedItem[] = [];

    const segments = text.split('`');

    segments.forEach((segment, index) => {
        if (index % 2 === 1) {
            // code block: `code`
            result.push({ type: 'monospace', val: segment });
        } else {
            for (const match of segment.matchAll(MD_URL_REGEX)) {
                const { before, val, link } = match.groups || {};
                if (before) {
                    // regular text w/o links
                    result.push({ type: 'text', val: before });
                }
                if (val) {
                    if (link) {
                        result.push({
                            type: 'link',
                            val,
                            link: link.startsWith('http')
                                ? link
                                : WIKI_URL_BASE + link,
                        });
                    } else {
                        const icon = ICONS[val];
                        if (icon) {
                            // an icon: `[icon]`
                            result.push({
                                type: 'icon',
                                val: icon,
                                link:
                                    WIKI_URL_BASE +
                                    toTitleCase(val.toLowerCase()),
                            });
                        } else {
                            // a link without a url: `[link]`
                            result.push({
                                type: 'link',
                                val,
                                link: WIKI_URL_BASE + val,
                            });
                        }
                    }
                }
            }
        }
    });

    return result;
};

export default renderLink;
