import { useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { LOGO } from './assets/index.ts';
import { Button } from './components/Button/Button.tsx';
import { FText } from './components/FText/FText.tsx';
import Section from './components/Section';
import { SideBar } from './components/SideBar/SideBar.tsx';
import { Tooltip } from './components/Tooltip/Tooltip.tsx';
import { useParallaxBackground } from './hooks/useParallaxBackground.ts';
import useUndoRedoKeybinds from './hooks/useUndoRedoKeybinds.ts';
import useChecklistStore from './stores/checklistStore.ts';
import useUiStore from './stores/uiStore.ts';
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
    bosses: '[Bosses](Bosses (Hollow Knight))',
    equipment: '[Equipment](Abilities)',
    spells: '[Spells]',
    nail: '[Nail]',
    dreamNail: '[Dream Nail]',
    nailArts: '[Nail Arts]',
    charms: '[Charms]',
    maskShards: '[Mask Shards]',
    vesselFragments: '[Vessel Fragments]',
    colosseum: '[Colosseum of Fools]',
    dreamers: '[Dreamers]',
    dreamWarriors: '[Warrior Dreams]',
    dreamBosses: '[Dream Bosses](Bosses (Hollow Knight)#Boss_Variants)',
    godhome: '[Godhome]',
    grubs: '[Grubs] (no percents)',
    relicsAndItems: '[Relics and Items](Items) (no percents)',
    whisperingRoots: '[Whispering Roots](Whispering Root) (no percents)',
};

const DISTRIBUTED_SECTIONS: CheckSection[][] = [
    ['bosses', 'equipment', 'spells', 'charms', 'colosseum', 'grubs'],
    [
        'nail',
        'dreamNail',
        'nailArts',
        'maskShards',
        'vesselFragments',
        'dreamers',
        'dreamWarriors',
        'dreamBosses',
        'godhome',
        'relicsAndItems',
        'whisperingRoots',
    ],
];

const ABOUT_TEXT =
    'This is a tool to help you plan your Hollow Knight ["Speed Completion"](Achievements (Hollow Knight)#Challenges) achievement checklist. ' +
    'For it, you need to achieve 100% completion in under 20 hours. ' +
    "As the game with all DLCs has a maximum of 112% completion, you can skip some of the checks from the base game you don't want to do, and do them in the DLC instead. " +
    'Additionally, [not everything counts as a check](Completion (Hollow Knight)). ' +
    'So what you should do? ' +
    'Check the boxes and the tool will tell you what things depend on other things.';

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

    const tooltipText = useUiStore(state => state.tooltipText);
    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);

    useUndoRedoKeybinds();

    const { isIntersecting, ref } = useIntersectionObserver();

    const backgroundRef = useRef<HTMLDivElement | null>(null);
    useParallaxBackground(backgroundRef);

    const info = (
        <FlexBox $direction='column'>
            <FText>
                [GEO] {geo} / {geoReq}
            </FText>
            <FText>
                [ESSENCE] {essence} / {Math.max(...essenceReq)}
            </FText>
            <FText>
                [PALE_ORE] {paleOre} / {paleOreReq}
            </FText>

            {(simpleKeyRoyalWaterwaysReq || simpleKeyGodseekerCocoonReq) && (
                <FText>
                    [SIMPLE_KEY]
                    {+simpleKeyRoyalWaterwaysReq + +simpleKeyGodseekerCocoonReq}
                </FText>
            )}
            {elegantKeyReq && <FText>[ELEGANT_KEY] required</FText>}
            {loveKeyReq && <FText>[LOVE_KEY] required</FText>}
            {shopkeepersKeyReq && <FText>[SHOPKEEPER'S_KEY] required</FText>}
        </FlexBox>
    );

    return (
        <MainWrapper>
            <div ref={backgroundRef} className='background' />
            <img src={LOGO} alt='logo' />

            <Button
                label='What?'
                size='small'
                onClick={() => {
                    setTooltipText(ABOUT_TEXT);
                    openTooltip();
                }}
            />

            <Tooltip>{tooltipText}</Tooltip>

            <PercentLabel>
                {percent.toFixed(2).replace('-0', '0')}%
            </PercentLabel>

            <FlexBox>
                <Button label='Uncheck All' onClick={reset} />
                <Button label='Check All' onClick={checkAll} />
            </FlexBox>

            <MainLabel ref={ref}>{info}</MainLabel>
            <SideBar visible={!isIntersecting}>{info}</SideBar>

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
