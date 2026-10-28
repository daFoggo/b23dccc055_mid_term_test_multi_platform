// Du lieu mau lan chay dau: 8 viec, 3 viec da xong, 2 viec qua han, 1 viec han hom nay.
import {addDaysToToday} from '../../../lib/date';
import type {Task} from '../types';

export function createSeedTasks(now: Date = new Date()): Task[] {
  const due = (n: number) => addDaysToToday(n, now);
  return [
    {id: 'seed-1', title: 'Ôn tập giữa kỳ Lập trình di động', note: 'Ôn chương 1-5 và làm lại bài tập trên lớp.', category: 'Học tập', priority: 'Cao', dueDate: due(2), done: false},
    {id: 'seed-2', title: 'Nộp báo cáo thực tập', note: 'Gửi bản PDF cho giảng viên hướng dẫn.', category: 'Công việc', priority: 'Cao', dueDate: due(-2), done: false},
    {id: 'seed-3', title: 'Chạy bộ 30 phút', note: '', category: 'Sức khoẻ', priority: 'Trung bình', dueDate: due(0), done: false},
    {id: 'seed-4', title: 'Mua quà sinh nhật mẹ', note: '', category: 'Cá nhân', priority: 'Thấp', dueDate: due(7), done: true},
    {id: 'seed-5', title: 'Đọc chương 3 giáo trình CSDL', note: '', category: 'Học tập', priority: 'Trung bình', dueDate: due(-1), done: true},
    {id: 'seed-6', title: 'Họp nhóm đồ án', note: 'Họp lúc 19h tại thư viện.', category: 'Công việc', priority: 'Trung bình', dueDate: due(1), done: false},
    {id: 'seed-7', title: 'Khám răng định kỳ', note: '', category: 'Sức khoẻ', priority: 'Thấp', dueDate: due(-5), done: false},
    {id: 'seed-8', title: 'Dọn phòng', note: '', category: 'Cá nhân', priority: 'Thấp', dueDate: due(-3), done: true},
  ];
}
