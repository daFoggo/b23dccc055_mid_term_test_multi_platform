// Nut doi cach sap xep: theo han (gan nhat truoc) hoac theo uu tien (Cao -> Thap).
import React from 'react';
import {Button} from '../../../components/ui/button';
import type {TaskSort} from '../types';

const LABEL: Record<TaskSort, string> = {
  dueDate: 'Sắp xếp: Hạn gần nhất',
  priority: 'Sắp xếp: Ưu tiên Cao → Thấp',
};

type Props = {value: TaskSort; onToggle: () => void};

export function SortToggle({value, onToggle}: Props) {
  return <Button label={LABEL[value]} variant="outlined" onPress={onToggle} />;
}
