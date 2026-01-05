import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const PlantIcon = (props: SvgProps) => (
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
    <Path d="M7 20h10" />
    <Path d="M10 20v-6.5a2.5 2.5 0 0 1 5 0V20" />
    <Path d="M8 8a2.5 2.5 0 0 1 5 0V13" />
    <Path d="M12 4a2.5 2.5 0 0 1 5 0V9" />
  </Svg>
);
export default PlantIcon;