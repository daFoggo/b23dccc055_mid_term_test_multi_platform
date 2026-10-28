# Thiết kế nghiệp vụ và logic – PlannerApp (Đề 3)

Trạng thái: **đề xuất, chờ duyệt**. Nguồn yêu cầu: [de-bai.md](de-bai.md). Cấu trúc thư mục: [architecture.md](architecture.md).
Mục tiêu: biến từng quy tắc của đề thành đặc tả rõ ràng, kiểm thử được, để việc cài đặt chỉ còn là làm theo và không sót điểm hay lỗi crash (mỗi lỗi crash trừ 1 điểm).
**Quy ước thư mục:** toàn bộ logic nghiệp vụ nằm trong `features/tasks/services/` (validation, selectors, storage, seed); `tasks-context.tsx` và hooks chỉ gọi vào đó. `lib/` giữ tiện ích chung (date, storage, id, confirm).
Chữ "**Quyết định**" đánh dấu chỗ diễn giải đề; các điểm còn mơ hồ nằm ở cuối tài liệu.

## 1. Mô hình dữ liệu (`features/tasks/types.ts`)

```ts
export const CATEGORIES = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'] as const;
export const PRIORITIES = ['Cao', 'Trung bình', 'Thấp'] as const;
export type Category = typeof CATEGORIES[number];
export type Priority = typeof PRIORITIES[number];
export const PRIORITY_RANK: Record<Priority, number> = { 'Cao': 0, 'Trung bình': 1, 'Thấp': 2 };
export interface Task { id: string; title: string; note: string; category: Category; priority: Priority; dueDate: string; done: boolean }
export type TaskInput = Omit<Task, 'id' | 'done'>;
export type TaskFilter = 'all' | 'pending' | 'done' | 'overdue';
export const FILTER_LABELS: Record<TaskFilter, string> = { all: 'Tất cả', pending: 'Chưa xong', done: 'Đã xong', overdue: 'Quá hạn' };
export type TaskSort = 'dueDate' | 'priority';
```

- Chuỗi giữ đúng như đề ("Sức khoẻ", "Xoá"), mọi literal dùng chung các hằng này, lưu dạng NFC.
- **Quyết định:** `dueDate` lưu dạng chuỗi `dd/mm/yyyy` đúng bảng của đề; chỉ suy ra số ngày khi cần tính toán. Không lưu `Date` hay timestamp.
- Màu ưu tiên đặt ở `theme/colors.ts` (`priority: Record<Priority, string>`), có fallback khi giá trị lạ.

## 2. `lib/date.ts`

```ts
export type DayNumber = number; // số ngày kể từ epoch, lịch dương, không giờ
export function parseDate(s: string): DayNumber | null;
export function isRealDate(s: string): boolean;                 // parseDate(s) !== null
export function todayDay(now: Date = new Date()): DayNumber;
export function diffDays(from: DayNumber, to: DayNumber): number; // to - from
export function formatDate(d: Date): string;                     // 'dd/mm/yyyy'
export function addDaysToToday(n: number, now?: Date): string;   // dùng cho seed
export function formatDateInput(raw: string): string;            // tự chèn '/'
```

- Regex `/^(\d{2})\/(\d{2})\/(\d{4})$/`. **Quyết định:** bắt buộc 2 chữ số ngày/tháng vì đề ghi chính xác "dd/mm/yyyy" và ô nhập tự định dạng nên người dùng không bị vướng.
- Ngày có thật: round-trip UTC. `t = Date.UTC(y, m-1, d)`, yêu cầu `new Date(t)` có `getUTCFullYear()===y`, `getUTCMonth()===m-1`, `getUTCDate()===d`. Loại được 31/02, 29/02/2026, tháng 13, ngày 00, năm < 100.
- `parseDate` trả `t / 86_400_000` (số nguyên). Không tự trim; lớp validation trim trước.
- `todayDay(now)` = `Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / MS_DAY`: lấy lịch địa phương rồi quy về số UTC nên không lệch do DST.
- Selector nhận `today: DayNumber` và không tự gọi `new Date()` (để test).

## 3. Validation (`features/tasks/services/task-validation.ts`)

```ts
export type TaskErrors = Partial<Record<'title' | 'dueDate', string>>;
export function validateTask(v: TaskInput, mode: 'create' | 'edit', today: DayNumber): TaskErrors;
export const hasErrors = (e: TaskErrors) => Object.keys(e).length > 0;
```

Mỗi trường dừng ở lỗi đầu tiên, theo thứ tự:

| Trường | Quy tắc | Thông báo |
| --- | --- | --- |
| title | sau trim, rỗng | Vui lòng nhập tên công việc |
| title | `trim().length > 50` | Tên không được quá 50 ký tự |
| dueDate | sau trim, rỗng | Vui lòng nhập hạn hoàn thành |
| dueDate | không khớp regex | Hạn phải có dạng dd/mm/yyyy |
| dueDate | khớp regex nhưng không phải ngày thật | Ngày không tồn tại |
| dueDate | `mode==='create'` và `day < today` | Hạn không được trước hôm nay |

- Note, category, priority không có lỗi (category/priority luôn có giá trị mặc định vì chọn bằng nút).
- **Quyết định:** khi sửa bỏ hẳn quy tắc "không trước hôm nay" (đề chỉ giới hạn khi thêm mới).
- **Quyết định:** độ dài tính trên `title.trim().normalize('NFC')`, bọc try/catch.

`hooks/use-task-form.ts`:

```ts
useTaskForm(opts: { mode: 'create'|'edit'; initial?: Task; onValid(v: TaskInput): void })
  => { values; errors; setField<K extends keyof TaskInput>(k: K, v: TaskInput[K]): void; submit(): void }
```

- Giá trị khởi tạo lấy qua initializer của `useState` (một lần). Edit lấy từ `initial`; create là `{ title:'', note:'', category:'Học tập', priority:'Trung bình', dueDate: formatDate(hôm nay) }` (điền sẵn ngày hôm nay, xem mục 11 #3).
- **Quyết định về thời điểm hiện lỗi:** chưa hiện gì trước lần bấm "Lưu" đầu tiên; sau đó mỗi lần `setField` validate lại để lỗi tự mất khi sửa đúng. Không validate khi blur. Lỗi hiện ngay dưới ô nhập kèm viền đỏ.
- `setField('dueDate', raw)` áp `formatDateInput(raw)`.
- Submit hợp lệ: trim title/note/dueDate, gọi `onValid`; màn hình gọi `addTask`/`updateTask` rồi `navigation.goBack()`. Cờ `useRef` chặn bấm hai lần.

## 4. Selectors (`features/tasks/services/task-selectors.ts`), hàm thuần

```ts
isOverdue(t: Task, today): boolean        // !t.done && d !== null && d < today
daysLeft(t: Task, today): number | null   // diffDays(today, d)
dueLabel(t: Task, today): string | null
getProgress(tasks): { done: number; total: number; ratio: number; text: string }
filterTasks(tasks, f, today); searchTasks(tasks, q); sortTasks(tasks, s)
selectVisibleTasks(tasks, { filter, query, sort }, today) = sortTasks(searchTasks(filterTasks(...)))
```

- `dueLabel` (việc chưa xong): n>0 "Còn n ngày", n===0 "Hạn hôm nay", n<0 "Quá hạn |n| ngày"; ngày hỏng trả `null`. **Quyết định:** việc đã xong trả "Đã hoàn thành", không đếm ngày.
- Hạn đúng hôm nay **không** là quá hạn.
- `getProgress`: `ratio = total === 0 ? 0 : done/total` (kẹp [0,1]); `text = "Đã hoàn thành ${done}/${total} công việc"`. **Quyết định:** tính trên toàn bộ danh sách, không theo kết quả lọc (nếu theo lọc thì chọn "Đã xong" luôn ra X/X).
- Lọc: `all` tất cả; `pending` là `!done`; `done` là `done`; `overdue` là `isOverdue`. **Quyết định:** "Chưa xong" gồm cả việc quá hạn.
- Tìm kiếm chỉ theo `title`: `q = fold(query.trim())`, rỗng thì trả nguyên danh sách; so `fold(title).includes(q)` (không dùng RegExp để ký tự đặc biệt không gây crash). `fold(s) = s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[đĐ]/g,'d').toLowerCase()` có try/catch (lỗi thì chỉ `toLowerCase()`). **Quyết định:** có bỏ dấu (là tập chứa yêu cầu "không phân biệt hoa/thường").
- Sắp xếp luôn trên bản sao `[...arr]`, gắn index gốc để ổn định; không bao giờ so sánh chuỗi ngày.
  - `dueDate`: tăng dần theo số ngày, ngày hỏng xuống cuối; hoà thì rank ưu tiên, rồi index.
  - `priority`: rank tăng dần (Cao trước); hoà thì ngày tăng dần, rồi index.
- Thứ tự áp dụng: lọc, rồi tìm, rồi sắp xếp, chạy đồng thời trong một `useMemo`.

`hooks/use-task-list-controls.ts`: state `{ filter:'all', query:'', sort:'dueDate' }`, các setter, `toggleSort()`, `visible = useMemo(() => selectVisibleTasks(tasks, controls, today), [...])`; `today = todayDay()` tính mỗi lần render.

Trạng thái rỗng:

- Chưa nạp xong dữ liệu: loading-state.
- `tasks.length === 0`: "Chưa có công việc nào. Nhấn "+ Thêm việc" để bắt đầu."
- Có task nhưng `visible.length === 0`: "Không có công việc phù hợp với bộ lọc/tìm kiếm".

## 5. State và lưu trữ

`tasks-context.tsx`:

```ts
type State = { status: 'loading' | 'ready'; tasks: Task[] };
type Action =
  | { type: 'hydrate'; tasks: Task[] } | { type: 'add'; task: Task }
  | { type: 'update'; id: string; input: TaskInput } | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string } | { type: 'removeDone' };
useTasks(): { tasks; isReady; getTask(id): Task | undefined; addTask(i: TaskInput): string;
              updateTask(id, i): void; toggleTask(id): void; removeTask(id): void; removeDoneTasks(): number }
```

- Reducer bất biến. Id không tồn tại thì trả lại đúng `state` cũ (không crash). `update` giữ `id` và `done`. `add` thêm vào cuối, `done:false`.
- `lib/id.ts`: `createId() = Date.now().toString(36) + '-' + (counter++).toString(36) + '-' + Math.random().toString(36).slice(2, 8)`. Id seed cố định `seed-1..8`.
- `lib/storage.ts`: `getJSON<T>(key): Promise<{ok:true; value:T|null} | {ok:false}>`, `setJSON(key, v): Promise<boolean>`. Bọc try/catch, không bao giờ throw.
- `services/task-storage.ts`: `TASKS_KEY = 'plannerApp.tasks.v1'`. `loadTasks(now)`:
  - `value === null` (chưa có key): trả seed và ghi seed xuống.
  - Là mảng: lọc qua `isTask` (đủ kiểu, category/priority thuộc enum). Không seed lại kể cả khi là `[]`.
  - JSON hỏng / không phải mảng / đọc lỗi: **Quyết định:** dùng seed và ghi đè (dữ liệu cũ không đọc được thì app vẫn phải chạy).
- Chặn ghi trước khi load xong: Provider chạy `loadTasks` trong effect rồi `hydrate`; effect lưu chỉ chạy khi `status==='ready'` và bỏ qua lần ngay sau hydrate (ref); ghi nối tiếp qua một promise chain (lần mới nhất thắng); lỗi ghi thì `console.warn` và hiện Alert "Không lưu được dữ liệu" tối đa một lần mỗi phiên. Lúc `loading` Provider render loading-state.

Dữ liệu mẫu (`services/seed-data.ts`, `createSeedTasks(now)`, hạn tính theo hôm nay, 8 việc, 3 việc xong để khớp ví dụ "3/8"):

| id | title | category | priority | hạn | done |
| --- | --- | --- | --- | --- | --- |
| seed-1 | Ôn tập giữa kỳ Lập trình di động | Học tập | Cao | +2 | false |
| seed-2 | Nộp báo cáo thực tập | Công việc | Cao | -2 | false (quá hạn) |
| seed-3 | Chạy bộ 30 phút | Sức khoẻ | Trung bình | 0 | false (hôm nay) |
| seed-4 | Mua quà sinh nhật mẹ | Cá nhân | Thấp | +7 | true |
| seed-5 | Đọc chương 3 giáo trình CSDL | Học tập | Trung bình | -1 | true |
| seed-6 | Họp nhóm đồ án | Công việc | Trung bình | +1 | false |
| seed-7 | Khám răng định kỳ | Sức khoẻ | Thấp | -5 | false (quá hạn) |
| seed-8 | Dọn phòng | Cá nhân | Thấp | -3 | true |

(Bản của `planner` ghi seed-4 là chưa xong nhưng chỉ có 2 việc xong; tôi đặt seed-4 là `true` để đủ 3/8. Đây là lựa chọn của tôi, có thể đổi.)

## 6. Xoá (`lib/confirm.ts`)

```ts
export function confirmDestructive(o: { title: string; message: string; confirmText?: string; onConfirm: () => void }): void
// Alert.alert(title, message, [{ text: 'Huỷ', style: 'cancel' }, { text: confirmText ?? 'Xoá', style: 'destructive', onPress: onConfirm }], { cancelable: true })
```

- Nhấn giữ một dòng: tiêu đề "Xoá công việc", nội dung `Bạn có chắc muốn xoá "${title}"?`, xác nhận thì `removeTask(id)`.
- "Xoá việc đã hoàn thành": `doneCount` lấy từ `getProgress`; nút `disabled={doneCount===0}` và handler tự return khi bằng 0; nội dung `Xoá ${doneCount} công việc đã hoàn thành?`; xác nhận thì `removeDoneTasks()`.
- **Quyết định:** màn Chi tiết không có nút xoá (đề không yêu cầu). Chi tiết và Form tra task bằng `getTask(taskId)`; nếu `undefined` thì hiện "Không tìm thấy công việc" kèm nút "Quay lại", không tự `goBack` trong effect.

## 7. Navigation

```ts
type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string } | undefined;
  TaskDetail: { taskId: string };
};
```

- Chỉ truyền id, không truyền object.
- "+ Thêm việc" nằm ở `headerRight` của TaskList (khai báo trong `root-navigator.tsx`), bấm thì `navigate('TaskForm')`.
- Tiêu đề Form: `route.params?.taskId ? 'Sửa công việc' : 'Thêm công việc'`.
- Bấm một dòng: `navigate('TaskDetail', { taskId })`. Nút "Sửa" ở Chi tiết: `navigate('TaskForm', { taskId })`.
- Chế độ sửa: `initial = getTask(taskId)`; không tìm thấy thì hiện fallback, không lặng lẽ chuyển sang chế độ thêm.
- Chi tiết luôn đọc lại từ context theo id. Nút toggle ghi "Đánh dấu hoàn thành" khi `!done`, "Đánh dấu chưa hoàn thành" khi `done`.

## 8. Ô nhập

- Hạn: **Quyết định:** `keyboardType="numeric"` kết hợp `formatDateInput` và `maxLength={10}` (tiêu chí chấm nêu tên `numeric`; bàn phím numeric không có '/', còn `numbers-and-punctuation` chỉ có trên iOS).
- `formatDateInput(raw)`: lấy các chữ số (tối đa 8) = d; ghép `d[0..2]`, nếu len>2 thêm `'/'+d[2..4]`, nếu len>4 thêm `'/'+d[4..8]`. Không bao giờ để '/' ở cuối nên backspace vẫn chạy; dán "15/03/2026" vẫn ra đúng. Rủi ro chấp nhận: sửa giữa chuỗi thì con trỏ nhảy về cuối.
- Tên: **Quyết định:** không đặt `maxLength`, hiện bộ đếm `n/50` chuyển đỏ khi vượt (để người chấm gõ được 51 ký tự và thấy lỗi).
- Ghi chú: `multiline`, `maxLength={500}`.
- Chỉ trim lúc submit, không trim khi `onChange`.

## 9. Danh sách rủi ro crash

| Tình huống | Cách chặn |
| --- | --- |
| `route.params` undefined (Form thêm mới) | `route.params?.taskId` |
| Task không tồn tại (Chi tiết/Form) | UI fallback; form không đọc `initial.x` khi undefined |
| Ngày hỏng hoặc null | `parseDate` trả null; selector trả null/false; không hiện NaN |
| Tổng = 0 | `ratio` 0, width `${ratio*100}%` hợp lệ |
| `{count && <X/>}` khi count=0 làm hiện "0" ngoài `<Text>` | chỉ dùng ternary hoặc boolean (`count > 0 ? … : null`) |
| JSON hỏng, không phải mảng, phần tử sai enum | try/catch, `Array.isArray`, `isTask`; màu ưu tiên có fallback |
| AsyncStorage reject | wrapper không throw |
| Ghi `[]` đè dữ liệu trước khi load xong | chặn bằng `status==='ready'` |
| Bấm Lưu hai lần | cờ ref |
| Alert xác nhận cho id đã bị xoá | reducer no-op |
| Sort làm đổi mảng state | sao chép trước khi sort |
| Query có ký tự regex | dùng `includes` |
| `normalize` không hỗ trợ | try/catch trong `fold` |
| Năm < 100 hoặc 31/02 | round-trip UTC |
| Id trùng gây lỗi key FlatList | `createId` có counter; `keyExtractor={t => t.id}` |
| Bấm "Xoá việc đã hoàn thành" khi 0 | `disabled` cộng guard trong handler |

## 10. Bảng kiểm thử (today = 15/03/2026, `now = new Date(2026, 2, 15, 10)`)

| # | Hàm / đầu vào | Kỳ vọng |
| --- | --- | --- |
| 1 | parseDate "15/03/2026" | số ngày của 2026-03-15 |
| 2 | "31/02/2026" | null |
| 3 | "29/02/2026" | null |
| 4 | "29/02/2028" | hợp lệ |
| 5 | "29/02/2100" / "29/02/2000" | null / hợp lệ |
| 6 | "5/3/2026" | null |
| 7 | "15-03-2026", "", "15/03/20261" | null |
| 8 | "00/03/2026", "15/13/2026", "15/03/0026" | null |
| 9 | diffDays(15/03/2026, 30/03/2026) với TZ Europe/Berlin (DST 29/03) | 15 |
| 10 | diffDays(15/03, 14/03) | -1 |
| 11 | todayDay(new Date(2026,2,15,23,59)) | bằng parseDate("15/03/2026") |
| 12 | formatDate(new Date(2026,2,5)) | "05/03/2026" |
| 13 | formatDateInput "15032026" / "150" / "15/" / "ab12" / "150320269999" | "15/03/2026" / "15/0" / "15" / "12" / "15/03/2026" |
| 14 | validate title "" hoặc "   " | "Vui lòng nhập tên công việc" |
| 15 | title 50 ký tự / 51 ký tự | ok / "Tên không được quá 50 ký tự" |
| 16 | title "  " + 50 ký tự + "  " | ok |
| 17 | dueDate "" | "Vui lòng nhập hạn hoàn thành" |
| 18 | dueDate "1/3/2026" | "Hạn phải có dạng dd/mm/yyyy" |
| 19 | dueDate "31/02/2026" (create và edit) | "Ngày không tồn tại" |
| 20 | create "14/03/2026" / "15/03/2026" | "Hạn không được trước hôm nay" / ok |
| 21 | edit "10/03/2026" | ok |
| 22 | isOverdue: chưa xong hạn 14/03; chưa xong hạn 15/03; đã xong hạn 10/03 | true; false; false |
| 23 | dueLabel 18/03, 16/03, 15/03, 13/03 | "Còn 3 ngày", "Còn 1 ngày", "Hạn hôm nay", "Quá hạn 2 ngày" |
| 24 | dueLabel đã xong, hạn 13/03 | "Đã hoàn thành" |
| 25 | getProgress([]) | 0/0, ratio 0, "Đã hoàn thành 0/0 công việc" |
| 26 | getProgress(seed) | 3/8, ratio 0.375 |
| 27 | filter pending trên [chưa xong quá hạn, chưa xong, xong] | 2 phần tử đầu |
| 28 | search "  HỌC " / "hoc" / "di" trên "Học nhóm", "Đi chợ" | ["Học nhóm"] / ["Học nhóm"] / ["Đi chợ"] |
| 29 | sort dueDate ["01/04/2026","20/03/2026","05/12/2025"] | 05/12/2025, 20/03/2026, 01/04/2026 (so chuỗi sẽ sai) |
| 30 | sort priority [Thấp 10/03, Cao 20/03, TB 01/03, Cao 16/03] | Cao 16/03, Cao 20/03, TB, Thấp |
| 31 | 2 task cùng ngày, cùng ưu tiên | giữ thứ tự gốc |
| 32 | pipeline pending + "họp" + priority trên seed | ["Họp nhóm đồ án"] |
| 33 | reducer toggle/remove với id lạ | trả lại đúng state cũ |
| 34 | loadTasks: null / "[]" / "{bad" | seed và ghi / [] / seed |

Test DST: đặt `process.env.TZ = 'Europe/Berlin'` trong `globalSetup` của `jest.config.js`. Kiểm chứng bằng `npm test`, `npx tsc --noEmit`, `npm run lint`.

### Kiểm thử tay theo từng câu

- **Câu 1:** lần đầu chạy thấy 8 việc, header "Đã hoàn thành 3/8 công việc", thanh tiến độ khoảng 37%, nhãn màu đỏ/vàng/xanh; bấm checkbox thì gạch ngang, mờ, tiến độ cập nhật.
- **Câu 2:** "+ Thêm việc" ở header; thử Lưu rỗng, 51 ký tự, 31022026, ngày hôm qua: mỗi lần đều có lỗi dưới ô và viền đỏ; sửa thì form được điền sẵn, đặt ngày quá khứ vẫn lưu được.
- **Câu 3:** nhấn giữ thì hiện Alert, Huỷ không mất gì; "Xoá việc đã hoàn thành" hỏi kèm số lượng, xoá xong nút bị vô hiệu.
- **Câu 4:** Chi tiết đủ trường, có "Còn/Hạn hôm nay/Quá hạn N ngày", nhãn "Quá hạn" đỏ ở cả danh sách và chi tiết; toggle ở Chi tiết thì nhãn đổi, quay lại danh sách cũng đổi.
- **Câu 5:** nút lọc đang chọn nổi bật; kết hợp Quá hạn + "nộp" + sắp xếp ưu tiên cùng lúc; lọc ra rỗng thì hiện thông báo "không phù hợp".
- **Câu 6:** thêm, sửa, toggle, xoá rồi kill app; mở lại dữ liệu y nguyên; xoá hết rồi mở lại vẫn rỗng, không seed lại.
- **Câu 7:** viền đỏ khi lỗi, nút disabled khác biệt, bàn phím số cho ô hạn, bàn phím không che ô, hiển thị đúng vùng an toàn.

## 11. Các điểm mơ hồ đã chốt (theo nhu cầu người dùng thực tế)

| # | Điểm mơ hồ | Chốt | Lý do |
| --- | --- | --- | --- |
| 1 | Khi sửa, có chặn ngày quá khứ mới không | Cho phép | Đề chỉ giới hạn khi thêm mới; người dùng cần ghi lại việc đã trễ |
| 2 | Tìm kiếm bỏ dấu | Có | "hoc" tìm được "Học"; vẫn thoả yêu cầu không phân biệt hoa/thường |
| 3 | Ô hạn khi thêm mới | **Điền sẵn ngày hôm nay** | Đa số việc cần làm gần; giảm thao tác gõ; người dùng vẫn xoá/sửa được. (Đổi so với đề xuất ban đầu là để trống) |
| 4 | Đẩy việc đã xong xuống cuối khi sắp xếp | Không | Đề yêu cầu sắp xếp thuần theo hạn/ưu tiên; có bộ lọc để ẩn việc đã xong |
| 5 | Nút xoá ở màn Chi tiết | Không | Đề không yêu cầu; xoá đã có ở danh sách (nhấn giữ) |
| 6 | JSON hỏng | Seed lại và ghi đè | App phải mở được; dữ liệu hỏng không đọc được nên không còn gì để giữ |
| 7 | Dữ liệu mẫu | 8 việc, 3 việc xong | Khớp ví dụ "3/8" của đề |

Với mặc định #3, `useTaskForm` ở chế độ thêm mới khởi tạo `dueDate = formatDate(hôm nay)` thay vì `''`; quy tắc validation không đổi.
