import * as React from 'react';
import Svg, { Path, SvgProps, Circle } from 'react-native-svg';
const GuitarIcon = (props: SvgProps) => (
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
    <Path d="m12 15 6-6" />
    <Circle cx={6.5} cy={6.5} r={0.5} />
    <Path d="M12 15a2 2 0 0 0-2-2c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4" />
    <Path d="M12 21a2 2 0 0 0 2-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4" />
  </Svg>
);
export default GuitarIcon;