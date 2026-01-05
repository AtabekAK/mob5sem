import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const BedIcon = (props: SvgProps) => (
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
    <Path d="M2 4v16h20V4" />
    <Path d="M2 10h20" />
    <Path d="M6 8v-2" />
    <Path d="M10 8v-2" />
  </Svg>
);
export default BedIcon;