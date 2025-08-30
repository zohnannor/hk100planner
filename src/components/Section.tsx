import styled, { css } from 'styled-components';

import { HR } from '../assets';
import useChecklistStore from '../stores/checklistStore';
import useUiStore from '../stores/uiStore';
import { FlexBox, HasErrors } from '../styles';
import {
    CheckNames,
    Checks,
    GameKey,
    RequirementCheckErrors,
    SectionNames,
} from '../types/checklist';
import { typedEntries, typedKeys } from '../util/typedObject';
import Button from './Button';
import { SectionCheckBox } from './Checkbox/SectionCheckBox';
import FText from './FText';

const SectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const SectionTitle = styled.h1<HasErrors>`
    font-size: min(32px, 8vw);
    line-height: min(32px, 8vw);
    margin: 0;
    font-weight: bold;
    font-family: 'Cinzel', sans-serif;
    text-align: center;
    color: ${({ $hasErrors }) => ($hasErrors ? 'crimson' : 'white')};
`;

const SectionUnderline = styled.div`
    background: transparent center/contain scroll no-repeat;
    background-image: url(${HR});
    width: min(30rem, 90vw);
    height: min(3.375rem, 10.125vw);
`;

type SectionContentProps = {
    $collapsed?: boolean;
    $checksCount: number;
};

const SectionContent = styled.div<SectionContentProps>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    margin-top: 20px;
    transition: 0.2s;
    max-height: ${({ $checksCount }) => `${125 * $checksCount}px`};
    opacity: 1;

    ${({ $collapsed }) =>
        $collapsed &&
        css`
            max-height: 0;
            opacity: 0;
            margin-top: 0;
            pointer-events: none;
        `}
`;

const SectionButtons = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    & > div {
        justify-self: center;
    }
`;

type SectionProps<Game extends GameKey> = {
    game: Game;
    title: string;
    sectionName: SectionNames<Game>;
    errors: RequirementCheckErrors[Game];
};

const Section = <Game extends GameKey>({
    game,
    title,
    sectionName,
    errors,
}: SectionProps<Game>) => {
    const useChecklist = useChecklistStore(game);
    const section = useChecklist(
        state => (state.checks as Checks<Game>)[sectionName]
    );
    const reset = useChecklist(state => state.reset);
    const checkAll = useChecklist(state => state.checkAll);

    const collapsedSections = useUiStore(
        state =>
            state.collapsedSections[state.currentTab] as SectionNames<Game>[]
    );
    const toggleCollapsed = useUiStore(state => state.toggleSection);

    const collapsed = collapsedSections.includes(sectionName);
    const sectionHasErrors = typedKeys(errors ?? {}).some(
        section => section === sectionName
    );

    return (
        <SectionWrapper>
            <FlexBox $direction='column' $align='center' $gap='16px'>
                <SectionTitle $hasErrors={sectionHasErrors}>
                    <FText>{title}</FText>
                </SectionTitle>
                <SectionButtons>
                    <Button
                        size='small'
                        label='uncheck all'
                        onClick={() => reset(sectionName)}
                    />
                    <Button
                        size='small'
                        label={collapsed ? 'show' : 'hide'}
                        onClick={() => toggleCollapsed(sectionName)}
                    />
                    <Button
                        size='small'
                        label='check all'
                        onClick={() => checkAll(sectionName)}
                    />
                </SectionButtons>
            </FlexBox>
            <SectionUnderline />
            <SectionContent
                $checksCount={typedKeys(section).length}
                $collapsed={collapsed}
            >
                {typedEntries(section).map(([name, check]) => {
                    return (
                        <SectionCheckBox<Game>
                            game={game}
                            key={name as string}
                            sectionName={sectionName}
                            checkName={
                                name as CheckNames<Game, SectionNames<Game>>
                            }
                            check={check}
                            errors={errors}
                        />
                    );
                })}
            </SectionContent>
        </SectionWrapper>
    );
};

export default Section;
