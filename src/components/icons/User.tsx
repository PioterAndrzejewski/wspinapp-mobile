import { Path, Svg } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

export const UserIcon = ({ size = 20, color }: Props): JSX.Element => {
  const colorToUse = color || "#000";

  return (
    <Svg width={size} height={size} viewBox='0 0 14 14' fill='none'>
      <Path
        d='M13.5 10.5V12.5C13.5 12.7652 13.3946 13.0196 13.2071 13.2071C13.0196 13.3946 12.7652 13.5 12.5 13.5H10.5'
        stroke={colorToUse}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M10.5 0.5H12.5C12.7652 0.5 13.0196 0.605357 13.2071 0.792893C13.3946 0.98043 13.5 1.23478 13.5 1.5V3.5'
        stroke={colorToUse}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M0.5 3.5V1.5C0.5 1.23478 0.605357 0.98043 0.792893 0.792893C0.98043 0.605357 1.23478 0.5 1.5 0.5H3.5'
        stroke={colorToUse}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M3.5 13.5H1.5C1.23478 13.5 0.98043 13.3946 0.792893 13.2071C0.605357 13.0196 0.5 12.7652 0.5 12.5V10.5'
        stroke={colorToUse}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M6.99975 6.49998C8.10431 6.49998 8.99974 5.60455 8.99974 4.49999C8.99974 3.39543 8.10431 2.5 6.99975 2.5C5.89518 2.5 4.99976 3.39543 4.99976 4.49999C4.99976 5.60455 5.89518 6.49998 6.99975 6.49998Z'
        stroke={colorToUse}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
      <Path
        d='M10.8034 11.0001C10.545 10.1944 10.0375 9.49168 9.35402 8.99309C8.67053 8.49449 7.84635 8.22583 7.00032 8.22583C6.15429 8.22583 5.33012 8.49449 4.64662 8.99309C3.96312 9.49168 3.45562 10.1944 3.19727 11.0001H10.8034Z'
        stroke={colorToUse}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
