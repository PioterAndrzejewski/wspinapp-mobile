import { BoxProps } from "@shopify/restyle";
import { ReactNode } from "react";
import { Object } from "ts-toolbelt";

import { Theme } from "src/styles/theme";

import View from "./View";

type OverlayCardViewProps = Object.Merge<
  BoxProps<Theme>,
  { children: ReactNode }
>;

const OverlayCardView = ({ children, ...rest }: OverlayCardViewProps) => (
  <View
    backgroundColor='mainBackground'
    padding='s'
    borderRadius={6}
    shadowOffset={{ width: 0, height: 3 }}
    shadowRadius={6}
    shadowOpacity={0.35}
    elevation={5}
    {...rest}
  >
    {children}
  </View>
);

export default OverlayCardView;
