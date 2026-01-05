import * as React from 'react';
import Svg, { Path, SvgProps, Line } from 'react-native-svg';
const PencilIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Line x1="18" x2="22" y1="2" y2="6" />
    <Path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22l5.5-1.5Z" />
  </Svg>
);
export default PencilIcon;