import { useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

import { LOGO } from './assets/index.ts';
import { Button } from './components/Button/Button.tsx';
import { FText } from './components/FText/FText.tsx';
import Section from './components/Section';
import { SideBar } from './components/SideBar/SideBar.tsx';
import { Tooltip } from './components/Tooltip/Tooltip.tsx';
import { COLORS } from './constants.ts';
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
    grubs: '[Grubs](Grub#Rewards_and_locations) (no percents)',
    relicsAndItems: '[Relics and Items](Items) (no percents)',
    whisperingRoots: '[Whispering Roots](Whispering Root) (no percents)',
};

const DISTRIBUTED_SECTIONS: CheckSection[][] = [
    ['bosses', 'equipment', 'spells', 'charms', 'colosseum', 'relicsAndItems'],
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
        'grubs',
        'whisperingRoots',
    ],
];

const DESCRIPTION_TEXT =
    'This is a tool to help you plan your Hollow Knight ["Speed Completion"](Achievements (Hollow Knight)#Challenges) achievement checklist. ' +
    'For it, you need to achieve 100% completion in under 20 hours. ' +
    "As the game with all DLCs has a maximum of 112% completion, you can skip some of the checks from the base game you don't want to do, and do them in the DLC instead. " +
    'Additionally, [not everything counts as a check](Completion (Hollow Knight)). ' +
    'So what should you do? ' +
    'Check the boxes and the tool will tell you what things depend on other things. ' +
    'Also helpful for ["Steel Heart"](Achievements (Hollow Knight)#Challenges) achievement!';

const ABOUT_TEXT =
    'Made by [me](https://github.com/zohnannor) (mostly logic) and [my friend](https://github.com/swbuwk) (mostly design). ' +
    'Check out [the repo](https://github.com/zohnannor/hk100planner) and leave a star if you like it! :)';

const App = () => {
    const {
        percent,
        geo,
        essence,
        simpleKeys,
        paleOre,
        geoReq,
        essenceReq,
        paleOreReq,
        simpleKeysReq,
        reset,
        checkAll,
    } = useChecklistStore();

    const tooltipText = useUiStore(state => state.tooltipText);
    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const checklistHasErrors = useUiStore(state => state.checklistHasErrors);

    useUndoRedoKeybinds();

    const { isIntersecting, ref } = useIntersectionObserver();

    const backgroundRef = useRef<HTMLDivElement | null>(null);
    useParallaxBackground(backgroundRef);

    const compare = (a: number, b: number) =>
        a >= b ? COLORS.white : COLORS.red;

    const info = (
        <FlexBox $direction='column' $align='center'>
            <FText color={compare(geo, geoReq)}>
                [GEO] {geo} / {geoReq}
            </FText>
            <FText color={compare(essence, Math.max(...essenceReq))}>
                [ESSENCE] {essence} / {Math.max(...essenceReq)}
            </FText>
            <FText color={compare(paleOre, paleOreReq)}>
                [PALE_ORE] {paleOre} / {paleOreReq}
            </FText>
            <FText color={compare(simpleKeys, simpleKeysReq)}>
                [SIMPLE_KEY] {simpleKeys} / {simpleKeysReq}
            </FText>
        </FlexBox>
    );

    return (
        <MainWrapper>
            <div ref={backgroundRef} className='background' />
            <img src={LOGO} alt='logo' />

            <FlexBox $margin={'16px 0'}>
                <Button
                    label='What?'
                    size='small'
                    onClick={() => {
                        setTooltipText(DESCRIPTION_TEXT);
                        openTooltip();
                    }}
                />
                <Button
                    label='Settings'
                    size='small'
                    onClick={() => alert('TODO: UI Settings')}
                />
                <Button
                    label='About'
                    size='small'
                    onClick={() => {
                        setTooltipText(ABOUT_TEXT);
                        openTooltip();
                    }}
                />
                <Button
                    label='Report a bug'
                    size='small'
                    onClick={() => {
                        window.open(
                            'https://github.com/zohnannor/hk100planner/issues/new'
                        );
                    }}
                />
            </FlexBox>

            <Tooltip>{tooltipText}</Tooltip>

            <PercentLabel $hasErrors={checklistHasErrors}>
                {percent.toFixed(2).replace('-0', '0')}%
            </PercentLabel>

            <FlexBox>
                <Button label='Uncheck All' onClick={reset} />
                <Button label='Check All' onClick={checkAll} />
            </FlexBox>

            <MainLabel ref={ref}>{info}</MainLabel>
            <SideBar visible={!isIntersecting} hasErrors={checklistHasErrors}>
                {info}
            </SideBar>

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
