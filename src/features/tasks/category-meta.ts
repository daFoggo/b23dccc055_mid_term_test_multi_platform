// Icon va mau nhan dien cho tung danh muc (dung tren the va man chi tiet).
import type {Category} from './types';

export const CATEGORY_META: Record<Category, {icon: string; color: string}> = {
  'Học tập': {icon: 'school', color: '#6750A4'},
  'Công việc': {icon: 'work', color: '#00639B'},
  'Sức khoẻ': {icon: 'favorite', color: '#B3261E'},
  'Cá nhân': {icon: 'person', color: '#7D5260'},
};

export const FALLBACK_CATEGORY_META = {icon: 'label', color: '#79747E'};

export function categoryMeta(c: string): {icon: string; color: string} {
  return CATEGORY_META[c as Category] ?? FALLBACK_CATEGORY_META;
}
