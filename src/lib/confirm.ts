// Alert xac nhan cac thao tac xoa.
import {Alert} from 'react-native';

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
};

export function confirmDestructive(o: ConfirmOptions): void {
  Alert.alert(
    o.title,
    o.message,
    [
      {text: 'Huỷ', style: 'cancel'},
      {text: o.confirmText ?? 'Xoá', style: 'destructive', onPress: o.onConfirm},
    ],
    {cancelable: true},
  );
}
