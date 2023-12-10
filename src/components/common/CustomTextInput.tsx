import { useState } from "react";
import type { FieldError } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { RegisterData } from "src/components/auth/RegisterPanel";
import { VisionIcon, VisionLowIcon } from "src/components/common/SvgIcons";
import { styleGuide } from "src/styles/guide";

export type CustomTextInputProps = {
  label: string;
  secure?: boolean;
  onChange: (val: string) => void;
  value: string | undefined;
  field?: keyof RegisterData | undefined;
  error?: FieldError;
  onBlur?: any;
  hookBlurHandler: any;
};

export default function CustomTextInput({
  label,
  secure,
  onChange,
  value,
  field,
  error,
  hookBlurHandler,
  ...props
}: CustomTextInputProps) {
  const [inputFocused, setInputFocused] = useState(false);
  const [hidden, setHidden] = useState<boolean | undefined>(secure);
  const handlePress = () => setHidden((prevValue) => !prevValue);

  const handleBlur = () => {
    setInputFocused(false);
    hookBlurHandler();
  };

  const showPassword = () => (
    <View style={styles.icon}>
      <TouchableOpacity onPress={handlePress} hitSlop={20}>
        {hidden ? <VisionLowIcon /> : <VisionIcon />}
      </TouchableOpacity>
    </View>
  );

  const textInputStyles = () => {
    if (error)
      return {
        ...styles.input,
        ...styles.inputError,
      };

    if (inputFocused)
      return {
        ...styles.input,
        ...styles.inputFocused,
      };
    return styles.input;
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <View>
          <TextInput
            style={textInputStyles()}
            onFocus={() => setInputFocused(true)}
            onBlur={handleBlur}
            value={value}
            editable
            secureTextEntry={secure && hidden}
            onChangeText={onChange}
            {...props}
          />
          {error?.message && (
            <Text style={styles.errorText}>{error.message}</Text>
          )}
          {secure && showPassword()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 4,
    color: styleGuide.color.primary["900"],
    ...styleGuide.text.label,
  },
  input: {
    width: "100%",
    height: 47,
    paddingHorizontal: 20,
    ...styleGuide.corner.sm,
    ...styleGuide.text.title,
    backgroundColor: styleGuide.color.white,
  },
  inputError: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: styleGuide.color.error,
  },
  inputFocused: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: styleGuide.color.blue["500"],
  },
  errorText: {
    position: "absolute",
    bottom: -24,
    right: 0,
    color: styleGuide.color.error,
    ...styleGuide.text.caption,
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
});