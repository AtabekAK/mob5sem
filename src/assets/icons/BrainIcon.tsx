import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
const BrainIcon = (props: SvgProps) => (
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
    <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.98-1.58 2.5 2.5 0 0 1-1.03-3.82 2.5 2.5 0 0 1 1.03-3.82 2.5 2.5 0 0 1 2.98-1.58A2.5 2.5 0 0 1 12 8.5v-4A2.5 2.5 0 0 1 9.5 2Z" />
    <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.98-1.58 2.5 2.5 0 0 0 1.03-3.82 2.5 2.5 0 0 0-1.03-3.82 2.5 2.5 0 0 0-2.98-1.58A2.5 2.5 0 0 0 12 8.5v-4A2.5 2.5 0 0 0 14.5 2Z" />
  </Svg>
);
export default BrainIcon;