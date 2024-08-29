import styled, { css } from 'styled-components';

import { HR } from '../../assets';
import useChecklistStore from '../../stores/checklistStore';
import useUiStore from '../../stores/uiStore';
import { FlexBox } from '../../styles';
import { CheckSection, ChecksSection } from '../../types/checklist';
import formatCheckListError from '../../util/formatCheckListError';
import Button from '../Button';
import { SectionCheckBox } from '../Checkbox/SectionCheckBox';
import { FText } from '../FText/FText';

const SectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const SectionTitle = styled.h1`
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    font-weight: bold;
    font-family: 'Cinzel', sans-serif;
`;

const SectionUnderline = styled.div`
    background: transparent center/contain scroll no-repeat;
    background-image: url(${HR});
    width: 30rem;
    height: 3.375rem;
`;

type SectionContentProps = {
    $folded?: boolean;
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

    ${({ $folded }) =>
        $folded &&
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

type SectionProps = {
    title: string;
    sectionName: CheckSection;
};

export const Section: React.FC<SectionProps> = ({ title, sectionName }) => {
    const hiddenSections = useUiStore(state => state.hiddenSections);
    const toggleFolded = useUiStore(state => state.toggleSection);
    const section = useChecklistStore(state => state.checks[sectionName]);
    const toggle = useChecklistStore(state => state.toggle);
    const reset = useChecklistStore(state => state.reset);
    const checkAll = useChecklistStore(state => state.checkAll);
    const validateChecks = useChecklistStore(
        state => () => state.validateChecks(state)
    );

    const shouldValidateChecks = useUiStore(
        state => state.shouldValidateChecks
    );

    const folded = hiddenSections.includes(sectionName);
    const errors = shouldValidateChecks ? validateChecks() : {};

    return (
        <SectionWrapper>
            <FlexBox $direction='column' $align='center' $gap='8px'>
                <SectionTitle>
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
                        label={folded ? 'show' : 'hide'}
                        onClick={() => toggleFolded(sectionName)}
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
                $checksCount={Object.keys(section).length}
                $folded={folded}
            >
                {Object.entries(section).map(([name, check]) => {
                    const typedName = name as keyof ChecksSection<CheckSection>;
                    return (
                        <SectionCheckBox
                            label={name}
                            defaultChecked={check.checked}
                            description={check.description}
                            key={name}
                            onToggle={() => toggle(sectionName, typedName)}
                            error={formatCheckListError(
                                typedName,
                                errors[typedName]
                            )}
                        />
                    );
                })}
            </SectionContent>
        </SectionWrapper>
    );
};
