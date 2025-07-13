declare module 'react-native-country-codes-picker' {
  import { Component } from 'react';

  export interface Country {
    code: string;
    dial_code: string;
    name: string;
    flag: string;
  }

  interface CountryPickerStyle {
    modal?: any;
    backdrop?: any;
    line?: any;
    itemsList?: any;
    textInput?: any;
    countryButtonStyles?: any;
    searchMessageText?: any;
    countryMessageContainer?: any;
    flag?: any;
    dialCode?: any;
    countryName?: any;
  }

  interface CountryPickerProps {
    show: boolean;
    pickerButtonOnPress: (item: Country) => void;
    popularCountries?: string[];
    ListHeaderComponent?: React.ComponentType<any>;
    lang?: string;
    style?: CountryPickerStyle;
  }

  export const CountryPicker: React.ComponentType<CountryPickerProps>;
} 