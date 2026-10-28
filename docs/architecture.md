# Kiến trúc dự án PlannerApp (Đề 3 – Quản lý kế hoạch cá nhân)

Trạng thái: **đề xuất, chờ duyệt**. Chưa có code nào được dựng theo tài liệu này.

Quyết định đã chốt: dùng **npm** làm package manager. Đề bài gốc: [de-bai.md](de-bai.md). Thiết kế nghiệp vụ/logic: [business-logic.md](business-logic.md).

## 1. Bối cảnh và ràng buộc

- React Native CLI (không Expo), TypeScript, RN 0.88.
- Thư viện được phép (đề bài): `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `@react-native-async-storage/async-storage`, `react-native-vector-icons` (không bắt buộc).
- Không dùng UI kit, state library, thư viện validate hay thư viện ngày giờ.
- Không để toàn bộ code trong một file (trừ 0,5 điểm). Cần file theme/colors chung, `StyleSheet.create`, Alert cho mọi thao tác xoá.
- Tham chiếu: kiến trúc `wattprint-expo` (vertical slice, tách lớp, kebab-case, không barrel file), chuyển hoá cho React Native thuần.

## 2. Các phương án đã cân nhắc

| Phương án | Ưu | Nhược |
| --- | --- | --- |
| A. Chia theo loại file (`screens/`, `components/`, `utils/`) | Quen thuộc, nhanh | Logic nghiệp vụ rải rác, khó giữ ranh giới |
| **B. Một feature slice `tasks` + lớp dùng chung mỏng (đề xuất)** | Gần wattprint, ranh giới rõ, vừa quy mô 3 màn hình | Hơi nhiều thư mục hơn A |
| C. Nhiều feature (list, form, detail riêng) | Tách tối đa | Quá mức cho app 3 màn hình, các màn dùng chung một state |

Chọn **B**.

## 3. Cây thư mục (chỉ file rỗng/stub)

```
App.tsx                      SafeAreaProvider > TasksProvider > NavigationContainer > RootNavigator
src/
  navigation/
    root-navigator.tsx       native-stack: TaskList, TaskForm, TaskDetail
    types.ts                 RootStackParamList
  features/tasks/
    types.ts                 Task, Category, Priority, TaskFilter, TaskSort
    tasks-context.tsx        TasksProvider + useTasks (useReducer); gọi services/, không chứa logic nghiệp vụ
    services/                TOÀN BỘ logic nghiệp vụ của feature (hàm thuần, không import React/UI)
      task-validation.ts     validateTask(values, mode)
      task-selectors.ts      isOverdue, nhãn số ngày còn lại, tiến độ, lọc/tìm/sắp xếp
      task-storage.ts        load/save AsyncStorage, chỉ seed khi key chưa tồn tại
      seed-data.ts           >= 6 việc mẫu (1 xong, 1 quá hạn), ngày tính theo hôm nay
    hooks/                   use-task-list-controls.ts, use-task-form.ts
    components/              task-card, task-checkbox, priority-badge, overdue-badge,
                             progress-header, task-filter-bar, sort-toggle
    screens/                 task-list-screen, task-form-screen, task-detail-screen
  components/
    ui/                      button, chip, text-field, screen-container
    states/                  empty-state, loading-state
  lib/                       storage.ts, date.ts, id.ts, confirm.ts
  theme/                     colors.ts, metrics.ts
```

Đã bỏ so với wattprint: i18n (chỉ tiếng Việt), stores (không có Zustand), http/query/env (không có backend), Zod, `src/screens` (chỉ có một feature), ErrorBoundary.

## 4. Quy tắc phụ thuộc

- `App.tsx` được import navigation, features, components.
- `navigation` chỉ import `features/tasks/screens`.
- `features` được import components, lib, theme; màn hình chỉ `import type` từ `navigation/types`.
- `features/tasks/services` chỉ import `types.ts`, `lib`, `theme`; không import React, component hay hook (để test được bằng Jest thuần).
- `components` chỉ import lib, theme; không import features hay navigation.
- `lib` và `theme` không import gì từ `src`.
- Dùng import tương đối (tối đa 3 cấp). Không dùng alias `@/`: RN CLI mặc định không đọc tsconfig `paths`, thêm alias cần `babel-plugin-module-resolver` (ngoài danh sách thư viện).
- Kiểm tra bằng `no-restricted-imports` trong `.eslintrc.js`; cần thử một import sai có chủ đích để chắc lint bắt được.

## 5. Đề bài → file

| Câu | Nơi hiện thực |
| --- | --- |
| 1 Danh sách | task-list-screen (FlatList), task-card, task-checkbox, priority-badge, progress-header |
| 2 Thêm/Sửa | task-form-screen, use-task-form, services/task-validation, lib/date, text-field, chip |
| 3 Xoá | onLongPress ở task-card, lib/confirm; nút "Xoá việc đã hoàn thành" tắt khi chưa có việc xong |
| 4 Chi tiết, quá hạn | task-detail-screen, overdue-badge, selectors |
| 5 Lọc/tìm/sắp xếp | task-filter-bar, sort-toggle, use-task-list-controls (lọc → tìm → sắp xếp) |
| 6 Lưu trữ | lib/storage, services/task-storage, services/seed-data, tasks-context |
| 7 Giao diện | theme/*, StyleSheet.create, empty-state, trạng thái pressed/disabled, viền đỏ khi lỗi, safe area, keyboard |

## 6. Gói cần cài

```
npm install @react-navigation/native @react-navigation/native-stack react-native-screens @react-native-async-storage/async-storage
```

`react-native-safe-area-context` đã có. `react-native-vector-icons`: đề xuất bỏ qua (cần setup font native); dùng ký tự (✓, +, ×).

## 7. Rủi ro cần xử lý

- **Hai package manager**: hiện có cả `package-lock.json` và `pnpm-lock.yaml`. Cần chọn một (đề xuất npm cho an toàn khi chấm bài).
- **RN 0.88 rất mới**: kiểm tra peer warning và chạy thử `react-native run-android` sau khi cài.
- **Jest**: `__tests__/App.test.tsx` sẽ hỏng sau khi thay App; cần mock AsyncStorage và `transformIgnorePatterns` cho `@react-navigation`.
- **Hydration**: không ghi storage trước khi load xong; chỉ seed khi giá trị là `null`, không seed khi là mảng rỗng.
- **Ngày**: so sánh theo 00:00 giờ địa phương; quy tắc "không trước hôm nay" chỉ áp dụng khi thêm mới; 31/02 bị loại bằng cách dựng lại `Date` rồi so sánh.
- **Quá hạn** = chưa xong và hạn < hôm nay; sắp xếp theo ưu tiên thì phá hoà bằng hạn.

## 8. Thứ tự dựng và cách kiểm chứng

1. Cài gói → `npm run android` chạy được.
2. Theme + lib có test → `npm test`.
3. Types, seed, storage, context → `npx tsc --noEmit`.
4. Component dùng chung → `npm run lint`.
5. Màn hình + navigation → duyệt tay Câu 1–5.
6. Tắt/mở lại app → dữ liệu còn (Câu 6).
7. Quy tắc ESLint → một import sai làm lint fail.

Phạm vi đợt này: bước 1 và các **file rỗng/stub** của cây ở mục 3; chưa viết logic.
