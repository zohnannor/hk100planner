import { FC } from 'react';
import styled from 'styled-components';

import HR from '../../assets/hr.png';
import useChecklistStore, {
    ChecklistState,
    ChecksKeys,
} from '../../checklist_store';
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
    width: 45rem;
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
    sectionName: keyof ChecksKeys;
};

export const Section: FC<SectionProps> = ({ title, sectionName }) => {
    const section = useChecklistStore(state => state.checks[sectionName]);
    const toggle = useChecklistStore(state => state.toggle);

    return (
        <SectionWrapper>
            <SectionTitle>{title}</SectionTitle>
            <SectionUnderline />
            <SectionContent>
                {Object.entries(section).map(([name, check]) => (
                    <CheckBox
                        label={name}
                        defaultChecked={check.checked}
                        key={name}
                        onToggle={() => toggle(sectionName, name)}
                    />
                ))}
            </SectionContent>
        </SectionWrapper>
    );
};
