import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Country } from 'react-native-country-codes-picker';
import { Ionicons } from '@expo/vector-icons';

interface CountryPickerHeaderProps {
  countries: Country[];
  lang: string;
  onPress: (country: Country) => void;
  onClose?: () => void;
}

const CountryPickerHeader: React.FC<CountryPickerHeaderProps> = ({ countries, lang, onPress, onClose }) => {
  return (
    <View
      style={{
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        position: 'relative',
      }}
    >
      {onClose && (
        <TouchableOpacity
          onPress={onClose}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={28} color="#374151" />
        </TouchableOpacity>
      )}
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 14,
          fontFamily: 'Comfortaa-Bold',
        }}
      >
        Popular Countries
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {countries?.slice(0, 6).map((country, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onPress(country)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                paddingHorizontal: 10,
                paddingVertical: 7,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                maxWidth: 90,
                minWidth: 60,
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 15, marginRight: 3 }}>
                {country.flag}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 13,
                  color: '#374151',
                  fontFamily: 'Comfortaa-Medium',
                  maxWidth: 40,
                }}
              >
                {country.dial_code}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CountryPickerHeader; 