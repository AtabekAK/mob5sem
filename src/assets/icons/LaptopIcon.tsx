import * as React from 'react';
import Svg, { Path, SvgProps, Rect } from 'react-native-svg';
const LaptopIcon = (props: SvgProps) => (
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
    <Rect width={18} height={12} x={3} y={4} rx={2} ry={2} />
    <Path d="M2 20h20" />
  </Svg>
);
export default LaptopIcon;