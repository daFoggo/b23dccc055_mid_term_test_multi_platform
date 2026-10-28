# Kiến trúc dự án PlannerApp (Đề 3 – Quản lý kế hoạch cá nhân)

Trạng thái: **đã hiện thực** (nhánh `feat/foundations`). Cây thư mục, quy tắc phụ thuộc và công cụ dưới đây phản ánh code hiện có; các sai lệch đã biết và việc còn lại nằm ở mục 7 và mục 9.

Quyết định đã chốt: dùng **npm** làm package manager. Tài liệu liên quan: đề bài [de-bai.md](de-bai.md); thiết kế nghiệp vụ/logic [business-logic.md](business-logic.md); tham chiếu Material Design 3 [material-3.md](material-3.md) (dữ liệu thô trong `docs/m3/`); phong cách giao diện (M3 kết hợp phẳng kiểu wattprint, font Inter) [design-style.md](design-style.md); bảng đối chiếu đề bài [danh-gia-de-bai.md](danh-gia-de-bai.md).

## 1. Bối cảnh và ràng buộc

- React Native CLI (không Expo), TypeScript, RN 0.88.
- Thư viện được phép (đề bài): `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`, `@react-native-async-storage/async-storage`, `react-native-vector-icons` (không bắt buộc, app có dùng).
- Không dùng UI kit, state library, thư viện validate hay thư viện ngày giờ.
- Không để toàn bộ code trong một file (trừ 0,5 điểm). Cần file theme/colors chung, `StyleSheet.create`, Alert cho mọi thao tác xoá.
- Tham chiếu: kiến trúc `wattprint-expo` (vertical slice, tách lớp, kebab-case, không barrel file), chuyển hoá cho React Native thuần.

## 2. Các phương án đã cân nhắc

| Phương án | Ưu | Nhược |
| --- | --- | --- |
| A. Chia theo loại file (`screens/`, `components/`, `utils/`) | Quen thuộc, nhanh | Logic nghiệp vụ rải rác, khó giữ ranh giới |
| **B. Một feature slice `tasks` + lớp dùng chung mỏng (đã chọn)** | Gần wattprint, ranh giới rõ, vừa quy mô 3 màn hình | Hơi nhiều thư mục hơn A |
| C. Nhiều feature (list, form, detail riêng) | Tách tối đa | Quá mức cho app 3 màn hình, các màn dùng chung một state |

Đã chọn **B**.

## 3. Cây thư mục (theo code hiện có)

```
App.tsx                      StatusBar + SafeAreaProvider > TasksProvider > SnackbarProvider > NavigationContainer > RootNavigator
index.js
jest.config.js               preset @react-native/jest-preset, globalSetup, setupFilesAfterEnv, transformIgnorePatterns
jest.global-setup.js         ghim TZ = Europe/Berlin cho mọi worker
jest.setup.js                mock AsyncStorage (đường dẫn '.../async-storage/jest')
__tests__/App.test.tsx
src/
  navigation/
    root-navigator.tsx       native-stack: TaskList, TaskForm, TaskDetail
    types.ts                 RootStackParamList
  features/tasks/
    types.ts                 Task, Category, Priority, TaskFilter, TaskSort, FILTER_LABELS
    category-meta.ts         icon + màu nhận diện cho từng danh mục (có fallback)
    tasks-context.tsx        TasksProvider + useTasks (useReducer); gọi services/, không chứa logic nghiệp vụ
    tasks-context.test.tsx
    services/                TOÀN BỘ logic nghiệp vụ của feature (hàm thuần, không import React/UI)
      task-validation.ts     validateTask(values, mode, today)
      task-selectors.ts      isOverdue, daysLeft, dueLabel, getProgress, filterTasks, searchTasks,
                             sortTasks, selectVisibleTasks, getFilterCounts
      task-storage.ts        load/save AsyncStorage, chỉ seed khi key chưa tồn tại
      seed-data.ts           >= 6 việc mẫu (1 xong, 1 quá hạn), ngày tính theo hôm nay
      *.test.ts              mỗi service có file test cạnh nó
    hooks/                   use-task-list-controls.ts, use-task-form.ts
    components/              task-card, task-checkbox, priority-badge, overdue-badge,
                             progress-header, task-filter-bar, sort-toggle
    screens/                 task-list-screen, task-form-screen, task-detail-screen
  components/
    ui/                      button, chip, text-field, screen-container,
                             icon, search-bar, segmented-buttons, fab, snackbar
    states/                  empty-state, loading-state
  lib/                       storage.ts, date.ts (gồm quickDueDates, addDaysToToday), id.ts, confirm.ts (+ *.test.ts)
  theme/                     colors.ts, metrics.ts, theme.test.ts
```

Đã bỏ so với wattprint: i18n (chỉ tiếng Việt), stores (không có Zustand), http/query/env (không có backend), Zod, `src/screens` (chỉ có một feature), ErrorBoundary.

## 4. Quy tắc phụ thuộc

Quy tắc thiết kế:

- `App.tsx` được import navigation, features, components.
- `navigation` chỉ import `features/tasks/screens`.
- `features` được import components, lib, theme; màn hình chỉ `import type` từ `navigation/types`.
- `features/tasks/services` chỉ import `types.ts`, `lib`, `theme`; không import React, component hay hook (để test được bằng Jest thuần).
- `components` chỉ import lib, theme; không import features hay navigation.
- `lib` và `theme` không import gì từ `src`.
- Dùng import tương đối (tối đa 3 cấp). Không dùng alias `@/`: RN CLI mặc định không đọc tsconfig `paths`, thêm alias cần `babel-plugin-module-resolver` (ngoài danh sách thư viện).

Hiện trạng (đã đối chiếu với code):

- `lib/*` chỉ import `react-native` và AsyncStorage, không import từ `src`: đúng quy tắc.
- `components/ui` chỉ import `theme` và nhau: đúng quy tắc.
- **Sai lệch đã biết:** `theme/colors.ts` có `import type {Priority} from '../features/tasks/types'`, trái quy tắc "theme không import từ src". Chỉ là import kiểu (không có phụ thuộc lúc chạy). Hướng sửa: chuyển `Priority` sang một file kiểu dùng chung hoặc khai báo `priorityColors` trong feature.
- **Chưa được cưỡng chế:** rule ESLint `no-restricted-imports` **chưa** được cấu hình trong `.eslintrc.js`, nên ranh giới trên hiện chỉ giữ bằng kỷ luật khi code, không được máy kiểm tra.

## 5. Đề bài → file

| Câu | Nơi hiện thực |
| --- | --- |
| 1 Danh sách | task-list-screen (FlatList), task-card, task-checkbox, priority-badge, progress-header, category-meta |
| 2 Thêm/Sửa | task-form-screen, use-task-form, services/task-validation, lib/date (formatDateInput, quickDueDates), text-field, chip, button |
| 3 Xoá | onLongPress ở task-card, lib/confirm; nút "Xoá việc đã hoàn thành" tắt khi chưa có việc xong; snackbar báo kết quả |
| 4 Chi tiết, quá hạn | task-detail-screen, overdue-badge, services/task-selectors (isOverdue, dueLabel) |
| 5 Lọc/tìm/sắp xếp | task-filter-bar (kèm số lượng từ getFilterCounts), search-bar, sort-toggle + segmented-buttons, use-task-list-controls (lọc → tìm → sắp xếp) |
| 6 Lưu trữ | lib/storage, services/task-storage, services/seed-data, tasks-context |
| 7 Giao diện | theme/*, StyleSheet.create, icon, fab, snackbar, empty-state, loading-state, screen-container (safe area, keyboard), trạng thái pressed/disabled, viền đỏ khi lỗi. Quy chiếu thiết kế: [material-3.md](material-3.md) mục 10 |

## 6. Công cụ và quyết định kỹ thuật

- **Package manager:** npm (`package-lock.json`). Script: `npm start`, `npm run android`, `npm run ios`, `npm run lint`, `npm test`.
- **Import:** tương đối, không alias (lý do ở mục 4).
- **Icon:** `react-native-vector-icons` với font **MaterialIcons** (bọc trong `components/ui/icon.tsx`).
  - Android: `android/app/build.gradle` có `apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")` để đóng gói font.
  - iOS: `Info.plist` khai báo `UIAppFonts` chứa `MaterialIcons.ttf`.
- **Jest** (`jest.config.js`):
  - Múi giờ **ghim `TZ = Europe/Berlin`** trong `jest.global-setup.js` để test ngày ổn định và có DST.
  - AsyncStorage mock qua `jest.setup.js` với đường dẫn **`'@react-native-async-storage/async-storage/jest'`** (đúng cho v3).
  - `transformIgnorePatterns` cho phép biến đổi `react-native`, `@react-native*`, `@react-native-async-storage`, `@react-navigation`, `react-native-screens`, `react-native-safe-area-context` và **`react-native-vector-icons`**.
- **Gói đã cài:** `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `@react-native-async-storage/async-storage`, `react-native-safe-area-context`, `react-native-vector-icons`.

## 7. Cách chạy

```
npm install
npm test
npm run lint
npx tsc --noEmit
npx react-native start
npm run android
```

Khi cổng Metro 8081 bị chiếm:

```
npx react-native start --port 8082
cd android && ./gradlew installDebug -PreactNativeDevServerPort=8082
adb reverse tcp:8082 tcp:8082
```

Lưu ý: ở một số shell, `react-native run-android` không tìm thấy `gradlew.bat`; khi đó dùng lệnh Gradle trực tiếp như trên.

## 8. Rủi ro đã xử lý và còn mở

- **Hai package manager:** đã chốt npm.
- **RN 0.88 rất mới:** kiểm tra peer warning và chạy thử trên thiết bị sau mỗi lần đổi dependency.
- **Jest:** `__tests__/App.test.tsx` cần mock AsyncStorage và `transformIgnorePatterns` (đã có, xem mục 6).
- **Hydration:** không ghi storage trước khi load xong; chỉ seed khi giá trị là `null`, không seed khi là mảng rỗng; không bao giờ ghi đè dữ liệu đã lưu khi đọc lỗi (commit `6671983`).
- **Ngày:** so sánh theo 00:00 giờ địa phương; quy tắc "không trước hôm nay" chỉ áp dụng khi thêm mới; 31/02 bị loại bằng cách dựng lại `Date` rồi so sánh.
- **Quá hạn** = chưa xong và hạn < hôm nay; sắp xếp theo ưu tiên thì phá hoà bằng hạn.

## 9. Việc còn lại / nợ kỹ thuật

Các mục nhỏ đã hoãn lại có chủ đích:

- [ ] Hiển thị `Alert` khi ghi AsyncStorage thất bại (hiện chỉ `console.warn` một lần, người dùng không thấy gì).
- [ ] Chuẩn hoá NFC (`normalize('NFC')`) tiêu đề trước khi lưu, tránh hai chuỗi trông giống nhau nhưng khác mã.
- [ ] `removeDoneTasks` đọc số lượng từ closure của lần render (có thể lệch nếu state vừa đổi); nên tính từ state mới nhất.
- [ ] Bổ sung test cho provider: ghi liên tiếp nhanh (rapid writes), unmount giữa lúc ghi, cảnh báo chỉ in một lần (warn-once).
- [ ] Test DST cho `todayDay` và `addDaysToToday` (TZ đã ghim Europe/Berlin nên có thể viết case ngày chuyển giờ).
- [ ] Cưỡng chế ranh giới thư mục bằng `no-restricted-imports` trong `.eslintrc.js`; thử một import sai có chủ đích để chắc lint bắt được.
- [ ] Xoá phụ thuộc `theme/colors.ts` → `features/tasks/types` (mục 4).
- [ ] Ngoài phạm vi công việc này: `android/build.gradle` và `android/gradle.properties` đang có thay đổi **chưa commit**, không do công việc này tạo ra; cần người dùng xem lại trước khi commit.

## 10. Thứ tự dựng và cách kiểm chứng

1. Cài gói → `npm run android` chạy được (xem mục 7 nếu cổng 8081 bị chiếm).
2. Theme + lib có test → `npm test`.
3. Types, seed, storage, context → `npx tsc --noEmit`.
4. Component dùng chung → `npm run lint`.
5. Màn hình + navigation → duyệt tay Câu 1–5.
6. Tắt/mở lại app → dữ liệu còn (Câu 6).
7. Quy tắc ESLint → một import sai làm lint fail (chưa làm, xem mục 9).
