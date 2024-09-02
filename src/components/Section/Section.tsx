import styled, { css } from 'styled-components';

import { HR } from '../../assets';
import { OFFICIAL_TM_GRUB_NAMES } from '../../constants';
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

type SectionProps = {
    title: string;
    sectionName: CheckSection;
};

export const Section: React.FC<SectionProps> = ({ title, sectionName }) => {
    const section = useChecklistStore(state => state.checks[sectionName]);
    const toggle = useChecklistStore(state => state.toggle);
    const reset = useChecklistStore(state => state.reset);
    const checkAll = useChecklistStore(state => state.checkAll);
    const validateChecks = useChecklistStore(
        state => () => state.validateChecks(state)
    );

    const checksValidation = useUiStore(state => state.checksValidation);
    const collapsedSections = useUiStore(state => state.collapsedSections);
    const toggleCollapsed = useUiStore(state => state.toggleSection);
    const setChecklistHasErrors = useUiStore(
        state => state.setChecklistHasErrors
    );
    const useOfficialTMGrubNames = useUiStore(
        state => state.useOfficialTMGrubNames
    );

    const collapsed = collapsedSections.includes(sectionName);
    const errors = checksValidation ? validateChecks() : {};
    setChecklistHasErrors(Object.keys(errors).length > 0);

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
                $checksCount={Object.keys(section).length}
                $collapsed={collapsed}
            >
                {Object.entries(section).map(([name, check]) => {
                    const typedName = name as keyof ChecksSection<CheckSection>;

                    const label =
                        useOfficialTMGrubNames && sectionName === 'grubs'
                            ? OFFICIAL_TM_GRUB_NAMES[
                                  typedName as keyof ChecksSection<'grubs'>
                              ]
                            : name;

                    return (
                        <SectionCheckBox
                            label={label}
                            defaultChecked={check.checked}
                            description={check.description}
                            key={label}
                            onToggle={() => toggle(sectionName, typedName)}
                            error={formatCheckListError(
                                typedName,
                                errors[`${sectionName} ${typedName}`]
                            )}
                        />
                    );
                })}
            </SectionContent>
        </SectionWrapper>
    );
};
