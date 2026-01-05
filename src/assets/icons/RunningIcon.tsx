// src/assets/icons/RunningIcon.tsx

import * as React from 'react';
import Svg, { Path, SvgProps, Circle } from 'react-native-svg';

const RunningIcon = (props: SvgProps) => (
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
    <Circle cx={6} cy={4} r={1} />
    <Path d="m18 10-2.5-2.5" />
    <Path d="m14 4-2.5 2.5" />
    <Path d="M7 14.5 4.5 12 7 9.5" />
    <Path d="m17 21-2-4" />
    <Path d="m11 11-2 3-3-2" />
    <Path d="m18 21-3-3 1-4 3 1 2 4Z" />
    <Path d="M4 17h4" />
  </Svg>
);

export default RunningIcon;