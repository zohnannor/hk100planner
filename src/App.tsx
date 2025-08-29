import { useEffect, useRef } from 'react';
import { useIntersectionObserver, useToggle } from 'usehooks-ts';

import { LOGO } from './assets/index.ts';
import Button from './components/Button.tsx';
import FText from './components/FText.tsx';
import Section from './components/Section.tsx';
import SideBar from './components/SideBar.tsx';
import Tooltip from './components/Tooltip.tsx';
import {
    ABOUT_TEXT,
    COLORS,
    DESCRIPTION_TEXT,
    HOLLOW_KNIGHT_DISTRIBUTED_SECTIONS,
    HOLLOW_KNIGHT_SECTION_TITLES,
    SILKSONG_DISTRIBUTED_SECTIONS,
    SILKSONG_SECTION_TITLES,
} from './constants.ts';
import { useParallaxBackground } from './hooks/useParallaxBackground.ts';
import { useSaveParser } from './hooks/useSaveParser.ts';
import useUndoRedoKeybinds from './hooks/useUndoRedoKeybinds.ts';
import Settings from './Settings.tsx';
import useChecklistStore from './stores/checklistStore.ts';
import useUiStore from './stores/uiStore.ts';
import {
    FlexBox,
    InfoContainter,
    MainContent,
    MainLabel,
    MainWrapper,
    PercentLabel,
    SectionsColumn,
} from './styles';
import { typedKeys } from './util/typedObject.ts';

const App = () => {
    const { isLoading, error, result, isWasmReady, parseSaveFile } =
        useSaveParser();

    const setFromSaveFile = useChecklistStore('hollow-knight')(
        state => state.setFromSaveFile
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            parseSaveFile(file);
        }
    };

    useEffect(() => {
        if (result) {
            // TODO: remove!
            console.log(result);
            setFromSaveFile(result);
        }
    }, [result, isLoading]);

    const tooltipText = useUiStore(state => state.tooltipText);
    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const checklistHasErrors = useUiStore(state => state.checklistHasErrors);
    const checksValidation = useUiStore(state => state.checksValidation);
    const currentTab = useUiStore(state => state.currentTab);
    const setCurrentTab = useUiStore(state => state.setCurrentTab);

    const { percent, reset, checkAll } = useChecklistStore(currentTab)();

    const validateChecks = useChecklistStore(currentTab)(
        state => () => state.validateChecks(state)
    );
    const setChecklistHasErrors = useUiStore(
        state => state.setChecklistHasErrors
    );

    useUndoRedoKeybinds();

    const { isIntersecting, ref } = useIntersectionObserver();

    const backgroundRef = useRef<HTMLDivElement>(null);
    useParallaxBackground(backgroundRef);

    const [settingsCollapsed, toggleSettingsCollapsed] = useToggle(false);

    const decide = (a: number, b: number) =>
        checksValidation ? (a >= b ? COLORS.white : COLORS.red) : COLORS.white;

    const info = (sidebar?: boolean) => {
        // TODO: refactor
        const info =
            currentTab === 'hollow-knight'
                ? (() => {
                      const {
                          geo,
                          geoReq,
                          essence,
                          essenceReq,
                          paleOre,
                          paleOreReq,
                          simpleKeys,
                          simpleKeysReq,
                      } = useChecklistStore(currentTab)();
                      return [
                          ['[GEO]', geo, geoReq],
                          ['[ESSENCE]', essence, Math.max(...essenceReq)],
                          ['[PALE_ORE]', paleOre, paleOreReq],
                          ['[SIMPLE_KEY]', simpleKeys, simpleKeysReq],
                      ] as const;
                  })()
                : (() => {
                      const { rosaries, rosariesReq } =
                          useChecklistStore(currentTab)();
                      return [['[ROSARIES]', rosaries, rosariesReq]] as const;
                  })();
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

    const errors = checksValidation ? validateChecks() : {};
    setChecklistHasErrors(typedKeys(errors).length > 0);

    return (
        <MainWrapper>
            <div ref={backgroundRef} className='background' />
            <img src={LOGO} alt='logo' />

            <div>
                {!isWasmReady && <p>Loading WebAssembly module...</p>}
                <input
                    type='file'
                    accept='.dat'
                    onChange={handleFileChange}
                    disabled={isLoading}
                />

                {isLoading && <p>Parsing save file...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </div>

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
                <Button
                    label={
                        currentTab !== 'silksong' ? 'hollow-knight' : 'silksong'
                    }
                    onClick={() =>
                        setCurrentTab(
                            currentTab === 'silksong'
                                ? 'hollow-knight'
                                : 'silksong'
                        )
                    }
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

            <MainLabel ref={ref}>{info()}</MainLabel>
            <SideBar
                visible={!isIntersecting}
                game={currentTab}
                hasErrors={checklistHasErrors}
            >
                {info(true)}
            </SideBar>

            <MainContent>
                {/* TODO: refactor duplacated code... somehow */}
                {currentTab === 'hollow-knight' &&
                    HOLLOW_KNIGHT_DISTRIBUTED_SECTIONS.map(sectionColumn => (
                        <SectionsColumn key={sectionColumn.toString()}>
                            {sectionColumn.map(sectionName => {
                                return (
                                    <Section<'hollow-knight'>
                                        key={sectionName}
                                        title={
                                            HOLLOW_KNIGHT_SECTION_TITLES[
                                                sectionName
                                            ]
                                        }
                                        game={currentTab}
                                        sectionName={sectionName}
                                        errors={errors[currentTab]}
                                    />
                                );
                            })}
                        </SectionsColumn>
                    ))}
                {currentTab === 'silksong' &&
                    SILKSONG_DISTRIBUTED_SECTIONS.map(sectionColumn => (
                        <SectionsColumn key={sectionColumn.toString()}>
                            {sectionColumn.map(sectionName => {
                                console.log({ e: errors[currentTab] });

                                return (
                                    <Section<'silksong'>
                                        key={sectionName}
                                        title={
                                            SILKSONG_SECTION_TITLES[sectionName]
                                        }
                                        game={currentTab}
                                        sectionName={sectionName}
                                        errors={errors[currentTab]}
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
