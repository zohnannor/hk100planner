import { useRef } from 'react';
import styled from 'styled-components';
import { useIntersectionObserver, useToggle } from 'usehooks-ts';

import { LOGO, SILKSONG_BACKGROUND, VOIDHEARD_BACKGROUD } from './assets';
import Button from './components/Button';
import FText from './components/FText';
import SaveUploader from './components/SaveUploader';
import Section from './components/Section';
import SideBar from './components/SideBar';
import Tooltip from './components/Tooltip';
import {
    ABOUT_TEXT,
    BREAKPOINTS,
    COLORS,
    DESCRIPTION_TEXT,
    HOLLOW_KNIGHT_DISTRIBUTED_SECTIONS,
    HOLLOW_KNIGHT_SECTION_TITLES,
    SILKSONG_DISTRIBUTED_SECTIONS,
    SILKSONG_SECTION_TITLES,
} from './constants';
import { useBreakpoint } from './hooks/useBreakpoint';
import { useParallaxBackground } from './hooks/useParallaxBackground';
import useUndoRedoKeybinds from './hooks/useUndoRedoKeybinds';
import Settings from './Settings';
import useChecklistStore from './stores/checklistStore';
import useUiStore from './stores/uiStore';
import {
    FlexBox,
    InfoContainter,
    MainContent,
    MainLabel,
    MainWrapper,
    PercentLabel,
    SectionsColumn,
} from './styles';
import { GameKey, SectionNames } from './types/checklist';
import { typedKeys } from './util/typedObject';

type BackgroundProps = {
    $currentTab: GameKey;
};

const Background = styled.div<BackgroundProps>`
    top: 0;
    position: fixed;
    z-index: -1;
    width: 120vw;
    height: calc(100vh + 200px);

    &::before,
    &::after {
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        opacity: 1;
        background-size: cover;
        background-position: center 0;
    }

    &::before {
        background-image: linear-gradient(
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0.5)
            ),
            url(${VOIDHEARD_BACKGROUD});
        opacity: ${({ $currentTab }) =>
            $currentTab === 'hollow-knight' ? 1 : 0};
        z-index: 1;
        transition: opacity 0.5s;
    }

    &::after {
        background-image: linear-gradient(
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0.5)
            ),
            url(${SILKSONG_BACKGROUND});
    }
`;

const Info = ({ game, sidebar }: { game: GameKey; sidebar?: boolean }) => {
    const checksValidation = useUiStore(state => state.checksValidation);

    const decide = (a: number, b: number) =>
        checksValidation ? (a >= b ? COLORS.white : COLORS.red) : COLORS.white;

    let info: [string, number, number][];
    if (game === 'hollow-knight') {
        const {
            geo,
            geoReq,
            essence,
            essenceReq,
            paleOre,
            paleOreReq,
            simpleKeys,
            simpleKeysReq,
        } = useChecklistStore(game)();
        info = [
            ['[GEO]', geo, geoReq],
            ['[ESSENCE]', essence, Math.max(...essenceReq)],
            ['[PALE_ORE]', paleOre, paleOreReq],
            ['[SIMPLE_KEY]', simpleKeys, simpleKeysReq],
        ] as const;
    } else {
        const { rosaries, rosariesReq } = useChecklistStore(game)();
        info = [['[ROSARIES]', rosaries, rosariesReq]] as const;
    }

    return (
        <InfoContainter $tabletAlign={sidebar ? 'flex-end' : 'center'}>
            {info.map(x => {
                const [it, val, req] = x;
                const available = val - req;

                if (sidebar)
                    return (
                        <FText color={decide(val, req)} key={it}>
                            {it} {val} / {req}
                        </FText>
                    );

                const p =
                    available === 0 || it === '[ESSENCE]'
                        ? ''
                        : available > 0
                        ? `(${available} unspent)`
                        : `(${-available} short)`;

                return (
                    <FText color={decide(val, req)} key={it}>
                        {it} {val} collected / {req} required
                        {p}
                    </FText>
                );
            })}
        </InfoContainter>
    );
};

const SectionColumns = <Game extends GameKey>({ game }: { game: Game }) => {
    const checksValidation = useUiStore(state => state.checksValidation);

    const validateChecks = useChecklistStore(game)(
        state => () => state.validateChecks(state)
    );
    const setChecklistHasErrors = useUiStore(
        state => state.setChecklistHasErrors
    );

    const errors = checksValidation ? validateChecks() : {};
    setChecklistHasErrors(typedKeys(errors).length > 0);

    const sectionTitles = (
        game === 'hollow-knight'
            ? HOLLOW_KNIGHT_SECTION_TITLES
            : SILKSONG_SECTION_TITLES
    ) as Record<SectionNames<Game>, string>;
    const sections = (
        game === 'hollow-knight'
            ? HOLLOW_KNIGHT_DISTRIBUTED_SECTIONS
            : SILKSONG_DISTRIBUTED_SECTIONS
    ) as SectionNames<Game>[][];

    return (
        <>
            {sections.map(sectionColumn => (
                <SectionsColumn key={sectionColumn.toString()}>
                    {sectionColumn.map(sectionName => {
                        return (
                            <Section<Game>
                                game={game}
                                key={sectionName}
                                title={sectionTitles[sectionName]}
                                sectionName={sectionName}
                                errors={errors[game]}
                            />
                        );
                    })}
                </SectionsColumn>
            ))}
        </>
    );
};

const App = () => {
    const tooltipText = useUiStore(state => state.tooltipText);
    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const checklistHasErrors = useUiStore(state => state.checklistHasErrors);
    const currentTab = useUiStore(state => state.currentTab);
    const setCurrentTab = useUiStore(state => state.setCurrentTab);

    const { percent, reset, checkAll } = useChecklistStore(currentTab)();

    useUndoRedoKeybinds();

    const isMobile = useBreakpoint(BREAKPOINTS.mobile);
    const { isIntersecting, ref } = useIntersectionObserver();

    const backgroundRef = useRef<HTMLDivElement>(null);
    useParallaxBackground(backgroundRef);

    const [settingsCollapsed, toggleSettingsCollapsed] = useToggle(false);

    return (
        <MainWrapper>
            <Tooltip>{tooltipText}</Tooltip>

            <Background
                $currentTab={currentTab}
                ref={backgroundRef}
                className='background'
            />
            <img src={LOGO} alt='logo' />

            <Button
                label={currentTab !== 'silksong' ? 'hollow-knight' : 'silksong'}
                onClick={() =>
                    setCurrentTab(
                        currentTab === 'silksong' ? 'hollow-knight' : 'silksong'
                    )
                }
            />

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
                    onClick={() =>
                        window.open(
                            'https://github.com/zohnannor/hk100planner/issues/new/choose'
                        )
                    }
                />
            </FlexBox>

            <Settings collapsed={settingsCollapsed} />
            {!isMobile && <SaveUploader />}

            <PercentLabel $hasErrors={checklistHasErrors}>
                {percent}%
            </PercentLabel>

            <FlexBox>
                <Button label='Uncheck All' onClick={reset} />
                <Button label='Check All' onClick={checkAll} />
            </FlexBox>

            <MainLabel ref={ref}>
                <Info game={currentTab} />
            </MainLabel>

            <SideBar visible={!isIntersecting} hasErrors={checklistHasErrors}>
                <Info game={currentTab} sidebar={true} />
            </SideBar>

            <MainContent>
                <SectionColumns game={currentTab} />
            </MainContent>
        </MainWrapper>
    );
};

export default App;
