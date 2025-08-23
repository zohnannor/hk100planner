import styled, { css } from 'styled-components';

import { QuestionMark } from './assets';
import Button from './components/Button';
import { FText } from './components/FText/FText';
import useUiStore from './stores/uiStore';
import { FlexBox } from './styles';

const DESCRIPTION = "Use [Skurry's grub names](https://youtu.be/9J_Fg8F94Qk).";

const SettingTitle = styled.div`
    display: inline-flex;
    font-size: min(24px, 5vw);
    line-height: min(24px, 5vw);
    margin: 0;
    font-family: 'Cinzel', sans-serif;
    gap: 8px;
    align-items: center;
`;

type SettingsWrapperProps = {
    $collapsed?: boolean;
};

const SettingsWrapper = styled.div<SettingsWrapperProps>`
    width: min(400px, 90vw);
    transition: 0.2s;
    opacity: 1;
    max-height: ${() => `${125 * 3}px`};

    ${({ $collapsed }) =>
        !$collapsed &&
        css`
            max-height: 0;
            opacity: 0;
            margin-top: 0;
            pointer-events: none;
        `}
`;

type SettingsProps = {
    collapsed: boolean;
};

const Settings: React.FC<SettingsProps> = ({ collapsed }) => {
    const checksValidation = useUiStore(state => state.checksValidation);
    const toggleChecksValidation = useUiStore(
        state => state.toggleChecksValidation
    );
    const useOfficialTMGrubNames = useUiStore(
        state => state.useOfficialTMGrubNames
    );
    const toggleUseOfficialTMGrubNames = useUiStore(
        state => state.toggleUseOfficialTMGrubNames
    );
    const setTooltipText = useUiStore(state => state.setTooltipText);
    const openTooltip = useUiStore(state => state.openTooltip);
    const collapsedSections = useUiStore(state => state.collapsedSections);
    const toggleSection = useUiStore(state => state.toggleSection);

    return (
        <SettingsWrapper $collapsed={collapsed}>
            <FlexBox $align='center' $justify='space-between'>
                <SettingTitle>
                    <FText>Checks validation</FText>
                </SettingTitle>
                <Button
                    size='small'
                    label={checksValidation ? 'on' : 'off'}
                    onClick={toggleChecksValidation}
                />
            </FlexBox>
            <FlexBox $align='center' $justify='space-between'>
                <SettingTitle>
                    <FText>Use official™ grub names</FText>
                    <FlexBox
                        onClick={() => {
                            setTooltipText(DESCRIPTION);
                            openTooltip();
                        }}
                    >
                        <QuestionMark />
                    </FlexBox>
                </SettingTitle>
                <Button
                    size='small'
                    label={useOfficialTMGrubNames ? 'use' : "don't"}
                    onClick={toggleUseOfficialTMGrubNames}
                />
            </FlexBox>
            <FlexBox $align='center' $justify='space-between'>
                <SettingTitle>
                    <FText>(Un)collapse all sections</FText>
                </SettingTitle>
                <Button
                    size='small'
                    label={collapsedSections.length === 0 ? 'hide' : 'show'}
                    onClick={toggleSection}
                />
            </FlexBox>
        </SettingsWrapper>
    );
};

export default Settings;
