import { useRef } from 'react';

import useChecklistStore from './checklist_store.ts';
import { Button } from './components/Button/Button.tsx';
import DialogBox from './components/DialogBox';
import Section from './components/Section';
import { SideBar } from './components/SideBar/SideBar.tsx';
import { useParallaxBackground } from './hooks/useParallaxBackground.ts';
import useUndoRedoKeybinds from './hooks/useUndoRedoKeybinds.ts';
import {
    MainContent,
    MainLabel,
    MainTitle,
    MainWrapper,
    PercentLabel,
    SectionsColumn,
} from './styles';
import { Sections } from './types/checklist.ts';

const SECTION_TITLES: Record<Sections, string> = {
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
};

const DISTRIBUTED_SECTIONS: Sections[][] = [
    ['bosses', 'equipment', 'spells', 'charms', 'colosseum'],
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
        reset,
        checkAll,
    } = useChecklistStore();
    useUndoRedoKeybinds();

    const backgroundRef = useRef<HTMLDivElement | null>(null);
    useParallaxBackground(backgroundRef);

    return (
        <MainWrapper>
            <div ref={backgroundRef} className='background' />
            <MainTitle>Hollow Knight Speed Completion planner</MainTitle>

            <SideBar>
                <DialogBox>
                    <Button label='Reset' onClick={reset} />
                    <Button label='Check All' onClick={checkAll} />
                </DialogBox>

                <PercentLabel>{percent.toFixed(2)}%</PercentLabel>

                <MainLabel>{geo} geo</MainLabel>
                <MainLabel>{essence} essence</MainLabel>
                <MainLabel>{paleOre} pale ore</MainLabel>

                <MainLabel>{geoReq} geo requirement</MainLabel>
                <MainLabel>{essenceReq} essence requirement</MainLabel>
                <MainLabel>{paleOreReq} pale ore requirement</MainLabel>
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
