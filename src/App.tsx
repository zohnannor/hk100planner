import { useRef } from 'react';
import { useIntersectionObserver, useToggle } from 'usehooks-ts';

import { LOGO } from './assets/index.ts';
import { Button } from './components/Button/Button.tsx';
import { FText } from './components/FText/FText.tsx';
import Section from './components/Section';
import { SideBar } from './components/SideBar/SideBar.tsx';
import { Tooltip } from './components/Tooltip/Tooltip.tsx';
import {
    ABOUT_TEXT,
    COLORS,
    DESCRIPTION_TEXT,
    DISTRIBUTED_SECTIONS,
    SECTION_TITLES,
} from './constants.ts';
import { useParallaxBackground } from './hooks/useParallaxBackground.ts';
import useUndoRedoKeybinds from './hooks/useUndoRedoKeybinds.ts';
import Settings from './Settings.tsx';
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
    const validateChecks = useChecklistStore(
        state => () => state.validateChecks(state)
    );
    const setChecklistHasErrors = useUiStore(
        state => state.setChecklistHasErrors
    );

    const tooltipText = useUiStore(state => state.tooltipText);
    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const checklistHasErrors = useUiStore(state => state.checklistHasErrors);
    const checksValidation = useUiStore(state => state.checksValidation);

    useUndoRedoKeybinds();

    const { isIntersecting, ref } = useIntersectionObserver();

    const backgroundRef = useRef<HTMLDivElement>(null);
    useParallaxBackground(backgroundRef);

    const [settingsCollapsed, toggleSettingsCollapsed] = useToggle(false);

    const decide = (a: number, b: number) =>
        checksValidation ? (a >= b ? COLORS.white : COLORS.red) : COLORS.white;

    const info = (
        <FlexBox $direction='column' $align='center'>
            <FText color={decide(geo, geoReq)}>
                [GEO] {geo} / {geoReq}
            </FText>
            <FText color={decide(essence, Math.max(...essenceReq))}>
                [ESSENCE] {essence} / {Math.max(...essenceReq)}
            </FText>
            <FText color={decide(paleOre, paleOreReq)}>
                [PALE_ORE] {paleOre} / {paleOreReq}
            </FText>
            <FText color={decide(simpleKeys, simpleKeysReq)}>
                [SIMPLE_KEY] {simpleKeys} / {simpleKeysReq}
            </FText>
        </FlexBox>
    );

    const errors = checksValidation ? validateChecks() : {};
    setChecklistHasErrors(Object.keys(errors).length > 0);

    return (
        <MainWrapper>
            <div ref={backgroundRef} className='background' />
            <img src={LOGO} alt='logo' />

            <FlexBox $margin='16px 0'>
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
                    onClick={toggleSettingsCollapsed}
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
                            'https://github.com/zohnannor/hk100planner/issues/new/choose'
                        );
                    }}
                />
            </FlexBox>

            <Settings collapsed={settingsCollapsed} />

            <Tooltip>{tooltipText}</Tooltip>

            <PercentLabel $hasErrors={checklistHasErrors}>
                {percent}%
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
                                    errors={errors}
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
