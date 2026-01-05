import * as React from 'react';
import Svg, { Path, SvgProps, Polyline } from 'react-native-svg';
const TranslateIcon = (props: SvgProps) => (
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
    <Path d="m5 12 7 7 7-7" />
    <Path d="m12 19V3" />
    <Polyline points="5 8 2 5 5 2" />
    <Path d="m20 20 2-2 2 2" />
    <Path d="M21 15v4" />
    <Path d="M19 12h-2a4 4 0 0 0-4 4v0" />
    <Path d="m15 9-3-3-3 3" />
  </Svg>
);
export default TranslateIcon;