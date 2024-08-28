import styled, { css } from 'styled-components';
import { useToggle } from 'usehooks-ts';

import { HR } from '../../assets';
import useChecklistStore from '../../checklist_store';
import { FlexBox } from '../../styles';
import { Checks, ChecksSection } from '../../types/checklist';
import Button from '../Button';
import CheckBox from '../Checkbox';

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
    checksCount: number;
};

const SectionContent = styled.div<SectionContentProps>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    margin-top: 20px;
    transition: 0.2s;
    max-height: ${({ checksCount }) => `${125 * checksCount}px`};
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

type SectionProps = {
    title: string;
    sectionName: keyof Checks;
};

export const Section: React.FC<SectionProps> = ({ title, sectionName }) => {
    const [folded, toggleFolded] = useToggle(false);
    const section = useChecklistStore(state => state.checks[sectionName]);
    const toggle = useChecklistStore(state => state.toggle);
    const validateChecks = useChecklistStore(
        state => () => state.validateChecks(state)
    );

    const errors = validateChecks();

    return (
        <SectionWrapper>
            <FlexBox direction='column' align='center'>
                <SectionTitle>{title}</SectionTitle>
                <Button
                    size='small'
                    label={folded ? 'show' : 'hide'}
                    onClick={toggleFolded}
                />
            </FlexBox>
            <SectionUnderline />
            <SectionContent
                checksCount={Object.keys(section).length}
                $folded={folded}
            >
                {Object.entries(section).map(([name, check]) => {
                    const typedName = name as keyof ChecksSection<keyof Checks>;
                    return (
                        <CheckBox
                            label={name}
                            defaultChecked={check.checked}
                            key={name}
                            onToggle={() => toggle(sectionName, typedName)}
                            error={JSON.stringify(errors[typedName])}
                        />
                    );
                })}
            </SectionContent>
        </SectionWrapper>
    );
};
