// Chuyen doi cach sap xep: theo han (gan nhat truoc) hoac theo uu tien (Cao -> Thap).
import React from 'react';
import {SegmentedButtons} from '../../../components/ui/segmented-buttons';
import type {Segment} from '../../../components/ui/segmented-buttons';
import type {TaskSort} from '../types';

const SEGMENTS: Segment<TaskSort>[] = [
  {value: 'dueDate', label: 'Hạn gần nhất', icon: 'event'},
  {value: 'priority', label: 'Ưu tiên Cao → Thấp', icon: 'flag'},
];

type Props = {value: TaskSort; onChange: (s: TaskSort) => void};

export function SortToggle({value, onChange}: Props) {
  return (
    <SegmentedButtons segments={SEGMENTS} value={value} onChange={onChange} />
  );
}
