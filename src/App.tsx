import { useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { LOGO } from './assets/index.ts';
import useChecklistStore from './checklist_store.ts';
import { Button } from './components/Button/Button.tsx';
import { FText } from './components/FText/FText.tsx';
import Section from './components/Section';
import { SideBar } from './components/SideBar/SideBar.tsx';
import { Tooltip } from './components/Tooltip/Tooltip.tsx';
import { useParallaxBackground } from './hooks/useParallaxBackground.ts';
import useUndoRedoKeybinds from './hooks/useUndoRedoKeybinds.ts';
import {
    FlexBox,
    MainContent,
    MainLabel,
    MainWrapper,
    PercentLabel,
    SectionsColumn,
} from './styles';
import { CheckSection } from './types/checklist.ts';

const SECTION_TITLES: Record<CheckSection, string> = {
    bosses: 'Bosses',
    equipment: 'Equipment',
    spells: 'Spells',
    nail: 'Nail',
    dreamNail: 'Dream Nail',
    nailArts: 'Nail Arts',
    charms: 'Charms',
    maskShards: 'Mask Shards',
    vesselFragment: 'Vessel Fragment',
    colosseum: 'Colosseum',
    dreamers: 'Dreamers',
    dreamWarriors: 'Warrior Dreams',
    dreamBosses: 'Dream Bosses (no percents)',
    godhome: 'Godhome',
    grubs: 'Grubs (no percents)',
    relicsAndItems: 'Relics and Items (no percents)',
    whisperingRoots: 'Whispering Roots (no percents)',
};

const DISTRIBUTED_SECTIONS: CheckSection[][] = [
    ['bosses', 'equipment', 'spells', 'charms', 'colosseum', 'grubs'],
    [
        'nail',
        'dreamNail',
        'nailArts',
        'maskShards',
        'vesselFragment',
        'dreamers',
        'dreamWarriors',
        'dreamBosses',
        'godhome',
        'relicsAndItems',
        'whisperingRoots',
    ],
];

const App = () => {
    const {
        percent,
        geo,
        essence,
        paleOre,
        geoReq,
        essenceReq,
        paleOreReq,
        elegantKeyReq,
        loveKeyReq,
        shopkeepersKeyReq,
        simpleKeyRoyalWaterwaysReq,
        simpleKeyGodseekerCocoonReq,
        reset,
        checkAll,
    } = useChecklistStore();
    useUndoRedoKeybinds();

    const { isIntersecting, ref } = useIntersectionObserver();

    const backgroundRef = useRef<HTMLDivElement | null>(null);
    useParallaxBackground(backgroundRef);

    return (
        <MainWrapper>
            <div ref={backgroundRef} className='background' />
            <img src={LOGO} alt='logo' />

            <Tooltip>
                [Bro](Pure Vessel) was tarnished by an idea instilled 😭😭😭😭💀
            </Tooltip>

            <FlexBox
                direction='column'
                align='center'
                justify='space-between'
                position='relative'
            >
                <Button label='Uncheck All' onClick={reset} />
                <Button label='Check All' onClick={checkAll} />
            </FlexBox>

            <PercentLabel ref={ref}>
                {percent.toFixed(2).replace('-0', '0')}%
            </PercentLabel>

            <MainLabel>
                <FlexBox direction='column'>
                    <FText>
                        [GEO] {geo} / {geoReq}
                    </FText>
                    <FText>
                        [ESSENCE] {essence} / {Math.max(...essenceReq)}
                    </FText>
                    <FText>
                        [PALE_ORE] {paleOre} / {paleOreReq}
                    </FText>

                    <FText>
                        [SIMPLE_KEY]
                        {+simpleKeyRoyalWaterwaysReq +
                            +simpleKeyGodseekerCocoonReq}
                    </FText>
                    <FText>[ELEGANT_KEY] {elegantKeyReq}</FText>
                    <FText>[LOVE_KEY] {loveKeyReq}</FText>
                    <FText>[SHOPKEEPER'S_KEY] {shopkeepersKeyReq}</FText>
                </FlexBox>
            </MainLabel>

            <SideBar visible={!isIntersecting} />

            <MainContent>
                {DISTRIBUTED_SECTIONS.map(sectionColumn => (
                    <SectionsColumn key={sectionColumn.toString()}>
                        {sectionColumn.map(sectionName => {
                            return (
                                <Section
                                    key={sectionName}
                                    title={SECTION_TITLES[sectionName]}
                                    sectionName={sectionName}
                                />
                            );
                        })}
                    </SectionsColumn>
                ))}
            </MainContent>
        </MainWrapper>
    );
};

export default App;
