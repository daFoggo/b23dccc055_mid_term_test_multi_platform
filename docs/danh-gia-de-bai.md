# Đánh giá PlannerApp theo tiêu chí đề bài (Đề 3)

Cập nhật: 2026-10-28. Đối chiếu từng yêu cầu trong [de-bai.md](de-bai.md) với những gì app đã làm.

**Cách đọc cột "Bằng chứng":**

- **Máy ảo**: đã thao tác thật trên emulator `Medium_Phone_API_37.0` và xem ảnh chụp màn hình.
- **Test**: có unit test Jest (111 test, `npm test`).
- **Code**: chỉ xác nhận bằng đọc code, chưa chạy thử.
- **Chưa kiểm**: chưa kiểm chứng được.

## 1. Quy định chung

| Yêu cầu | Đã làm | Bằng chứng |
| --- | --- | --- |
| Dùng React Native CLI, không Expo | Project khởi tạo từ template CLI (`android/`, `ios/`, `index.js`), không có gói `expo` | Code |
| Thư viện được phép | `package.json` chỉ có: react-navigation (native, native-stack), react-native-screens, safe-area-context, async-storage, vector-icons. Còn `@react-native/new-app-screen` là gói có sẵn của template, không còn được dùng | Code |
| Không dùng UI kit | Mọi component tự dựng (`src/components/ui/*`). React Native Paper đã gỡ | Code |
| Mọi thao tác xoá hỏi xác nhận bằng `Alert` | `lib/confirm.ts` bọc `Alert.alert`, dùng cho cả xoá một việc và xoá hàng loạt | Test, Máy ảo |
| Dữ liệu mẫu ≥ 6 việc, có ≥ 1 đã xong và ≥ 1 quá hạn | 8 việc: 3 đã xong, 2 quá hạn, 1 hạn hôm nay | Test, Máy ảo |
| Chạy bằng `npx react-native run-android` | Build và chạy được bằng Gradle (`installDebug`). Trên máy này `run-android` gặp lỗi "gradlew.bat not recognized" và cổng 8081 bị chiếm, nên đã chạy bằng Gradle và Metro cổng 8082 | Máy ảo |
| Nộp bài `HoTen_MSSV_DeX.zip`, bỏ `node_modules`, `android/build`, `android/app/build`, `ios/Pods` | **Chưa làm** (việc cuối cùng trước khi nộp) | Chưa kiểm |

## 2. Câu 1 – Danh sách công việc (1,5 điểm)

| Yêu cầu | Đã làm | Bằng chứng |
| --- | --- | --- |
| Hiển thị bằng `FlatList` | `task-list-screen.tsx` | Code, Máy ảo |
| Mỗi dòng: tên, danh mục, hạn, nhãn ưu tiên có màu (đỏ/vàng/xanh) | `task-card.tsx` gồm 2 dòng: tên kèm nhãn ưu tiên bên phải, rồi danh mục · hạn · nhãn "Quá hạn". `priority-badge.tsx` (đỏ Cao, vàng Trung bình, xanh Thấp) | Máy ảo |
| Checkbox tự làm bằng `Pressable`, nhấn đổi trạng thái | `task-checkbox.tsx` | Máy ảo (tiến độ 3/10 → 4/10) |
| Việc xong: tên gạch ngang và mờ | `titleDone` trong `task-card.tsx` | Máy ảo |
| Đầu màn hình: "Đã hoàn thành X/Y công việc" và thanh tiến độ tự vẽ bằng `View` | `progress-header.tsx`, `getProgress` | Test, Máy ảo |

## 3. Câu 2 – Thêm / Sửa (1,5 điểm)

| Yêu cầu | Đã làm | Bằng chứng |
| --- | --- | --- |
| Nút "+ Thêm việc" mở form (Stack Navigation) | FAB ghi đúng "+ Thêm việc" ở góc dưới, mở `TaskForm` qua native-stack | Máy ảo |
| Một form cho cả thêm và sửa, sửa thì điền sẵn | `task-form-screen.tsx` dùng `route.params.taskId` | Máy ảo (Sửa điền sẵn đúng) |
| Chọn danh mục và ưu tiên bằng nút bấm | `Chip` cho 4 danh mục và 3 mức ưu tiên | Máy ảo |
| Tên không trống, không quá 50 ký tự | `validateTask` + bộ đếm `n/50` | Test, Máy ảo (trống) |
| Hạn đúng `dd/mm/yyyy` và là ngày có thật (31/02 sai) | `parseDate` kiểm tra vòng UTC | Test, Máy ảo (31/02/2026 báo "Ngày không tồn tại") |
| Thêm mới: hạn không trước hôm nay | `mode === 'create'` | Test, Máy ảo ("Hạn không được trước hôm nay") |
| Thông báo lỗi ngay dưới ô nhập | `TextField` | Máy ảo |

## 4. Câu 3 – Xoá (1 điểm)

| Yêu cầu | Đã làm | Bằng chứng |
| --- | --- | --- |
| `onLongPress` xoá một dòng, có xác nhận | `task-card.tsx` → `confirmDestructive`; hộp thoại "Bạn có chắc muốn xoá …?" | Máy ảo (hiện hộp thoại, bấm Huỷ) |
| Nút "Xoá việc đã hoàn thành" xoá hàng loạt, hỏi xác nhận kèm số lượng | "Xoá N công việc đã hoàn thành?" | Máy ảo (xoá 4 việc thật) |
| Nút vô hiệu hoá khi chưa có việc nào xong | `disabled={doneCount === 0}` + handler tự thoát khi bằng 0 | Máy ảo (nút mờ sau khi xoá hết) |

Chưa chạy thử xoá một việc đơn lẻ đến hết (mới thấy hộp thoại).

## 5. Câu 4 – Chi tiết và cảnh báo quá hạn (1,5 điểm)

| Yêu cầu | Đã làm | Bằng chứng |
| --- | --- | --- |
| Nhấn dòng mở Chi tiết đầy đủ thông tin, có nút "Sửa" và đổi trạng thái | `task-detail-screen.tsx` | Máy ảo |
| Chưa xong mà quá hạn: nhãn "Quá hạn" đỏ ở danh sách và chi tiết | `overdue-badge.tsx`, `isOverdue` | Test, Máy ảo (cả hai màn) |
| Số ngày còn lại: "Còn N ngày", "Hạn hôm nay", "Quá hạn N ngày" | `dueLabel` | Test; Máy ảo (thấy "Quá hạn 2 ngày") |

Nút "Đánh dấu hoàn thành / Chưa hoàn thành" ở màn Chi tiết hiện đúng chữ và đổi theo trạng thái; chưa chạm thử trên máy ảo (đã thử toggle ở danh sách).

## 6. Câu 5 – Lọc, tìm kiếm, sắp xếp (1,5 điểm)

| Yêu cầu | Đã làm | Bằng chứng |
| --- | --- | --- |
| Hàng nút lọc Tất cả / Chưa xong / Đã xong / Quá hạn, nút chọn nổi bật | `task-filter-bar.tsx`: một hàng 4 ô chia đều, số lượng ở trên, nhãn ở dưới, ô đang chọn nền tonal; số quá hạn màu đỏ khi lớn hơn 0 | Máy ảo |
| Tìm theo tên, không phân biệt hoa/thường | `searchTasks` (còn bỏ dấu tiếng Việt: "hoc" tìm được "Học") | Test, Máy ảo ("bai" → "Hoc bai moi") |
| Chuyển sắp xếp theo hạn (gần nhất trước) hoặc ưu tiên (Cao → Thấp) | `sort-toggle.tsx` (segmented button) | Test, Máy ảo |
| Lọc, tìm, sắp xếp đồng thời | `selectVisibleTasks` = lọc → tìm → sắp xếp | Test; Máy ảo (Quá hạn + ưu tiên) |
| Trạng thái rỗng khi không có kết quả | `empty-state.tsx` | Máy ảo ("zzz") |

## 7. Câu 6 – Lưu trữ (1 điểm)

| Yêu cầu | Đã làm | Bằng chứng |
| --- | --- | --- |
| Lưu bằng AsyncStorage, tắt mở lại vẫn còn | `task-storage.ts`, `tasks-context.tsx`; chỉ seed khi chưa có dữ liệu; lỗi đọc tạm thời không ghi đè dữ liệu thật | Test, Máy ảo (tắt hẳn app và mở lại, dữ liệu còn) |

## 8. Câu 7 – Giao diện (2 điểm)

| Tiêu chí | Yêu cầu | Đã làm | Bằng chứng |
| --- | --- | --- | --- |
| Thống nhất (0,5) | Bảng màu chung trong một file theme | `src/theme/colors.ts`, `metrics.ts`, `fonts.ts` | Code |
| | Font và cỡ chữ nhất quán | Font Inter, thang chữ `typography` dùng chung | Máy ảo |
| | Dùng `StyleSheet.create`, hạn chế style inline | Mọi file dùng `StyleSheet.create`; không có `style={{…}}`. Còn vài style động nhỏ trong mảng (độ rộng thanh tiến độ, màu theo biến thể) | Code |
| Bố cục (0,5) | Padding/margin đều | Thang `spacing` bội số của 4 | Code |
| | Thẻ có bo góc và đổ bóng | Bo 24, `elevation` 1 rất nhạt. **Lưu ý**: giữ lại bóng nhẹ dù phong cách "phẳng" của wattprint không dùng bóng, vì đề chấm yêu cầu | Máy ảo |
| | Thông tin chính nổi bật hơn phụ | Tên SemiBold 16, phụ Regular 14 màu nhạt | Máy ảo |
| Phản hồi thao tác (0,5) | Nút có hiệu ứng khi nhấn | Thu nhỏ 0,97 khi nhấn (`Button`, `Chip`, `Fab`, segmented) | Code (hiệu ứng ngắn, chưa chụp được) |
| | Nút disabled trông khác | Mờ 40% | Máy ảo |
| | Trạng thái danh sách rỗng | Có icon và thông điệp, tách hai trường hợp (chưa có việc / không khớp bộ lọc) | Máy ảo (trường hợp không khớp) |
| | Ô nhập sai có viền đỏ | `TextField` viền đỏ 2px | Máy ảo |
| Trải nghiệm (0,5) | Bàn phím không che ô nhập | `ScreenContainer scroll` dùng `KeyboardAvoidingView` + `ScrollView` | Code; **Chưa kiểm** với bàn phím mềm (emulator đang dùng bàn phím vật lý) |
| | Đúng loại bàn phím | Ô hạn `keyboardType="numeric"`, `maxLength={10}` | Code |
| | Hiển thị đúng vùng an toàn | `SafeAreaView` (`react-native-safe-area-context`) + header của navigator | Máy ảo (không có tai thỏ để thử) |

## 9. Điểm trừ cần tránh

| Điểm trừ | Tình trạng |
| --- | --- |
| Crash khi thao tác (−1 mỗi lỗi, tối đa −2) | Chưa gặp crash trong các luồng đã chạy. Có test cho dữ liệu hỏng (ngày sai, JSON hỏng, id lạ) |
| Toàn bộ code một file | Đã tách: `components/`, `features/tasks/{components,screens,hooks,services}`, `lib/`, `theme/`, `navigation/` |
| Không chạy bằng React Native CLI | Chạy bằng CLI, không Expo |

## 10. Việc còn lại trước khi nộp

1. Thử trên máy ảo với **bàn phím mềm** (tắt "Use hardware keyboard") để chắc ô nhập không bị che.
2. Thử xoá một việc đơn lẻ đến hết và nút "Đánh dấu hoàn thành" ở màn Chi tiết.
3. Xem lại thư viện còn thừa (`@react-native/new-app-screen`).
4. Nén project đúng quy định đặt tên và loại thư mục.
