// Icon Material (react-native-vector-icons, font MaterialIcons).
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../theme/colors';

type Props = {name: string; size?: number; color?: string};

export function Icon({name, size = 20, color = colors.onSurfaceVariant}: Props) {
  return <MaterialIcons name={name} size={size} color={color} />;
}
