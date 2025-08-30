import { COLORS } from '../constants';

import type { Property } from 'csstype';

type Props = {
    color?: Property.Color;
};

export const CheckIcon: React.FC<Props> = ({ color }) => (
    <svg
        version='1.1'
        id='Capa_1'
        x='0px'
        y='0px'
        viewBox='0 0 507.506 507.506'
        width='24'
        height='24'
    >
        <g>
            <path
                d='M163.865,436.934c-14.406,0.006-28.222-5.72-38.4-15.915L9.369,304.966c-12.492-12.496-12.492-32.752,0-45.248l0,0   c12.496-12.492,32.752-12.492,45.248,0l109.248,109.248L452.889,79.942c12.496-12.492,32.752-12.492,45.248,0l0,0   c12.492,12.496,12.492,32.752,0,45.248L202.265,421.019C192.087,431.214,178.271,436.94,163.865,436.934z'
                fill={color || COLORS.white}
            />
        </g>
    </svg>
);
