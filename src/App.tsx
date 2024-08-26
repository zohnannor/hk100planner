import { useRef } from 'react';
import useChecklistStore from './checklist_store.ts';
import { Button } from './components/Button/Button.tsx';
import Section from './components/Section';
import { useParallaxBackground } from './hooks/useParallaxBackground.ts';
import useUndoRedoKeybinds from './hooks/useUndoRedoKeybinds.ts';
import {
    MainContent,
    MainLabel,
    MainTitle,
    MainWrapper,
    PercentLabel,
} from './styles';

const App = () => {
    const st = useChecklistStore();
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
    } = st;
    useUndoRedoKeybinds();

    const backgroundRef = useRef<HTMLDivElement | null>(null);
    useParallaxBackground(backgroundRef);

    return (
        <MainWrapper>
            <div ref={backgroundRef} className='background' />
            <MainTitle>Hollow Knight Speed Completion planner</MainTitle>

            <Button label='Reset' onClick={reset} />
            <Button label='Check All' onClick={checkAll} />

            <PercentLabel>{percent.toFixed(2)}%</PercentLabel>

            <MainLabel>{geo} geo</MainLabel>
            <MainLabel>{essence} essence</MainLabel>
            <MainLabel>{paleOre} pale ore</MainLabel>

            <MainLabel>{geoReq} geo</MainLabel>
            <MainLabel>{essenceReq} essence</MainLabel>
            <MainLabel>{paleOreReq} pale ore</MainLabel>

            <MainContent>
                <Section title='Bosses' sectionName='bosses' />
                <Section title='Equipment' sectionName='equipment' />
                <Section title='Spells' sectionName='spells' />
                <Section title='Nail' sectionName='nail' />
                <Section title='Dream Nail' sectionName='dreamNail' />
                <Section title='Nail Arts' sectionName='nailArts' />
                <Section title='Charms' sectionName='charms' />
                <Section title='MaskShards' sectionName='maskShards' />
                <Section title='Vessel Fragment' sectionName='vesselFragment' />
                <Section title='Colosseum' sectionName='colosseum' />
                <Section title='Dreamers' sectionName='dreamers' />
                <Section title='Warrior Dreams' sectionName='dreamWarriors' />
                <Section
                    title='Dream Bosses (no percents)'
                    sectionName='dreamBosses'
                />
                <Section title='Godhome' sectionName='godhome' />
            </MainContent>
        </MainWrapper>
    );
};

export default App;
