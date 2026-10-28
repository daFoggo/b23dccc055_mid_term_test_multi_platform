import { Alert } from 'react-native';
import { confirmDestructive } from './confirm';

test('confirmDestructive shows Huỷ (cancel) and Xoá (destructive) and runs onConfirm', () => {
  const spy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const onConfirm = jest.fn();

  confirmDestructive({ title: 'Xoá công việc', message: 'Chắc chưa?', onConfirm });

  expect(spy).toHaveBeenCalledTimes(1);
  const [title, message, buttons] = spy.mock.calls[0];
  expect(title).toBe('Xoá công việc');
  expect(message).toBe('Chắc chưa?');
  expect(buttons?.[0]).toMatchObject({ text: 'Huỷ', style: 'cancel' });
  expect(buttons?.[1]).toMatchObject({ text: 'Xoá', style: 'destructive' });
  expect(onConfirm).not.toHaveBeenCalled();
  buttons?.[1].onPress?.();
  expect(onConfirm).toHaveBeenCalledTimes(1);
  spy.mockRestore();
});
