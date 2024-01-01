import { Path, Svg } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

export const SettingsIcon = ({ size = 20, color }: Props): JSX.Element => {
  const colorToUse = color || "#000";

  return (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
      <Path
        d='M8.96575 3.85718L9.70289 1.95432C9.82721 1.63214 10.0459 1.35503 10.3304 1.15926C10.6149 0.963487 10.9519 0.858198 11.2972 0.857178H12.7029C13.0482 0.858198 13.3852 0.963487 13.6697 1.15926C13.9541 1.35503 14.1729 1.63214 14.2972 1.95432L15.0343 3.85718L17.5371 5.29718L19.56 4.98861C19.8968 4.94289 20.2397 4.99833 20.545 5.1479C20.8501 5.29747 21.104 5.5344 21.2743 5.82861L21.96 7.02861C22.1357 7.32749 22.2168 7.67263 22.1923 8.01847C22.1677 8.36431 22.039 8.6946 21.8228 8.96575L20.5714 10.56V13.44L21.8571 15.0343C22.0733 15.3055 22.202 15.6358 22.2265 15.9816C22.2511 16.3274 22.17 16.6726 21.9943 16.9715L21.3085 18.1715C21.1383 18.4656 20.8844 18.7025 20.5793 18.8522C20.274 19.0017 19.9311 19.0572 19.5943 19.0115L17.5714 18.7029L15.0686 20.1429L14.3315 22.0457C14.2071 22.3679 13.9884 22.6451 13.7039 22.8408C13.4195 23.0366 13.0825 23.1419 12.7372 23.1429H11.2972C10.9519 23.1419 10.6149 23.0366 10.3304 22.8408C10.0459 22.6451 9.82721 22.3679 9.70289 22.0457L8.96575 20.1429L6.46289 18.7029L4.44004 19.0115C4.10321 19.0572 3.76039 19.0017 3.45514 18.8522C3.14992 18.7025 2.89603 18.4656 2.72575 18.1715L2.04004 16.9715C1.86432 16.6726 1.78337 16.3274 1.80785 15.9816C1.83233 15.6358 1.96111 15.3055 2.17718 15.0343L3.42861 13.44V10.56L2.14289 8.96575C1.92682 8.6946 1.79805 8.36431 1.77357 8.01847C1.74909 7.67263 1.83004 7.32749 2.00575 7.02861L2.69146 5.82861C2.86174 5.5344 3.11563 5.29747 3.42086 5.1479C3.7261 4.99833 4.06893 4.94289 4.40575 4.98861L6.42861 5.29718L8.96575 3.85718ZM8.57146 12C8.57146 12.6781 8.77255 13.341 9.14928 13.9048C9.52603 14.4687 10.0615 14.9081 10.688 15.1676C11.3145 15.4271 12.0038 15.495 12.6689 15.3627C13.334 15.2304 13.9449 14.9039 14.4244 14.4244C14.9039 13.9449 15.2304 13.334 15.3627 12.6689C15.495 12.0038 15.4271 11.3145 15.1676 10.688C14.9081 10.0615 14.4687 9.52601 13.9048 9.14928C13.341 8.77255 12.6781 8.57146 12 8.57146C11.0907 8.57146 10.2187 8.93268 9.57568 9.57568C8.9327 10.2187 8.57146 11.0907 8.57146 12Z'
        stroke={colorToUse}
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </Svg>
  );
};
