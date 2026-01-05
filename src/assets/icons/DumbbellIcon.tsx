import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const DumbbellIcon = (props: SvgProps) => (
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
    <Path d="m6.5 6.5 11 11" />
    <Path d="m21 21-1-1" />
    <Path d="m3 3 1 1" />
    <Path d="m18 22 4-4" />
    <Path d="m2 6 4-4" />
    <Path d="m3 10 7-7" />
    <Path d="m14 21 7-7" />
  </Svg>
);
export default DumbbellIcon;