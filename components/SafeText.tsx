import React from "react";
import { Text, TextInput, TextInputProps, TextProps } from "react-native";
import { GlobalColors } from "../constants/Colors";

// Safe Text component with guaranteed visibility
export const SafeText: React.FC<TextProps> = ({ style, ...props }) => {
  const safeStyle = [
    { color: GlobalColors.defaultText },
    ...(Array.isArray(style) ? style : [style]),
  ];

  return <Text style={safeStyle} {...props} />;
};

// Safe TextInput component with guaranteed visibility
export const SafeTextInput: React.FC<TextInputProps> = ({
  style,
  placeholderTextColor,
  ...props
}) => {
  const safeStyle = [
    {
      color: GlobalColors.defaultText,
      borderColor: GlobalColors.border,
    },
    ...(Array.isArray(style) ? style : [style]),
  ];

  const safePlaceholderColor = placeholderTextColor || GlobalColors.placeholder;

  return (
    <TextInput
      style={safeStyle}
      placeholderTextColor={safePlaceholderColor}
      {...props}
    />
  );
};

// Export as default
export default SafeText;
