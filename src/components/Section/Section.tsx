import styled from 'styled-components';

import HR from '../../assets/hr.png';
import useChecklistStore from '../../checklist_store';
import { Checks, ChecksSection } from '../../types/checklist';
import CheckBox from '../Checkbox';

const SectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
`;

const SectionTitle = styled.h1`
    font-size: 32px;
    line-height: 32px;
    margin: 0;
    font-weight: bold;
    font-family: 'Cinzel', sans-serif;
    color: white;
`;

const SectionUnderline = styled.div`
    background: transparent center/contain scroll no-repeat;
    background-image: url(${HR});
    width: 30rem;
    height: 3.375rem;
`;

const SectionContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
`;

type SectionProps = {
    title: string;
    sectionName: keyof Checks;
};

export const Section: React.FC<SectionProps> = ({ title, sectionName }) => {
    const section = useChecklistStore(state => state.checks[sectionName]);
    const toggle = useChecklistStore(state => state.toggle);
    const validateChecks = useChecklistStore(
        state => () => state.validateChecks(state)
    );

    const errors = validateChecks();

    return (
        <SectionWrapper>
            <SectionTitle>{title}</SectionTitle>
            <SectionUnderline />
            <SectionContent>
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
