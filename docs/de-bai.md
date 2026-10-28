# ĐỀ SỐ 3 – ỨNG DỤNG QUẢN LÝ KẾ HOẠCH CÁ NHÂN

Nguồn: `De3_QuanLyKeHoachCaNhan.docx` (chuyển nguyên văn sang markdown để tra cứu).

**HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG / VIỆN KHOA HỌC KỸ THUẬT BƯU ĐIỆN**
ĐỀ KIỂM TRA – Môn: Phát triển ứng dụng di động đa nền tảng – Thời gian làm bài: 90 phút

Họ và tên: ................................ MSSV: .................. Lớp: ..........

## QUY ĐỊNH CHUNG

- Tạo project bằng React Native CLI (không dùng Expo):
  `npx @react-native-community/cli init PlannerApp`
- Chạy ứng dụng bằng `npx react-native run-android` (hoặc `run-ios`) trên máy ảo hoặc thiết bị thật.
- Thư viện được phép dùng:
  - `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`
  - `@react-native-async-storage/async-storage`
  - `react-native-vector-icons` (không bắt buộc)
- Không dùng thư viện UI dựng sẵn (NativeBase, React Native Paper, UI Kitten…). Không sao chép code của bạn khác.
- Mọi thao tác xoá phải hỏi xác nhận bằng `Alert`.
- Nộp bài: nén thư mục project, bỏ các thư mục `node_modules`, `android/build`, `android/app/build`, `ios/Pods`; đặt tên `HoTen_MSSV_DeX.zip`.

## MÔ TẢ BÀI TOÁN

Một sinh viên cần ứng dụng di động để lập kế hoạch và theo dõi các công việc hằng ngày. Mỗi Công việc có các thông tin sau:

| Trường | Kiểu | Ghi chú |
| --- | --- | --- |
| id | string | Tự sinh |
| title | string | Tên công việc, bắt buộc, tối đa 50 ký tự |
| note | string | Ghi chú, không bắt buộc |
| category | string | Một trong: Học tập, Công việc, Sức khoẻ, Cá nhân |
| priority | string | Cao, Trung bình hoặc Thấp |
| dueDate | string | Hạn hoàn thành, định dạng dd/mm/yyyy |
| done | boolean | Đã hoàn thành hay chưa, mặc định false |

Lần chạy đầu tiên phải khởi tạo sẵn ít nhất 6 công việc mẫu, trong đó có ít nhất 1 việc đã hoàn thành và 1 việc đã quá hạn.

## YÊU CẦU

### Câu 1 – Màn hình Danh sách công việc (1,5 điểm)

- Hiển thị danh sách bằng `FlatList`. Mỗi dòng gồm tên công việc, danh mục, hạn hoàn thành và nhãn mức ưu tiên có màu riêng: đỏ (Cao), vàng (Trung bình), xanh (Thấp).
- Mỗi dòng có ô đánh dấu (checkbox tự làm bằng `Pressable`); nhấn vào để chuyển trạng thái hoàn thành. Việc đã hoàn thành hiển thị tên bị gạch ngang và mờ đi.
- Đầu màn hình hiển thị tiến độ, ví dụ "Đã hoàn thành 3/8 công việc", kèm một thanh tiến độ tự vẽ bằng `View`.

### Câu 2 – Thêm / Sửa công việc (1,5 điểm)

- Có nút "+ Thêm việc" mở màn hình form (dùng Stack Navigation).
- Cùng một form dùng cho cả thêm và sửa; khi sửa, các ô được điền sẵn dữ liệu cũ. Chọn danh mục và mức ưu tiên bằng nút bấm.
- Kiểm tra dữ liệu: tên không trống và không quá 50 ký tự; hạn hoàn thành đúng định dạng dd/mm/yyyy và là ngày có thật (ví dụ 31/02/2026 là sai); khi thêm mới, hạn không được trước ngày hôm nay. Thông báo lỗi hiển thị ngay dưới ô nhập.

### Câu 3 – Xoá công việc (1 điểm)

- Nhấn giữ một dòng (`onLongPress`) để xoá, có hỏi xác nhận.
- Có nút "Xoá việc đã hoàn thành" để xoá tất cả việc đã xong cùng lúc, có hỏi xác nhận kèm số lượng sẽ xoá. Nút bị vô hiệu hoá khi chưa có việc nào hoàn thành.

### Câu 4 – Chi tiết và cảnh báo quá hạn (1,5 điểm)

- Nhấn vào một dòng để mở màn hình Chi tiết với đầy đủ thông tin, có nút "Sửa" và nút "Đánh dấu hoàn thành / Chưa hoàn thành".
- Việc chưa hoàn thành mà đã qua hạn hiển thị nhãn "Quá hạn" màu đỏ ở cả danh sách và màn hình chi tiết.
- Màn hình chi tiết hiển thị số ngày còn lại, ví dụ "Còn 3 ngày", "Hạn hôm nay" hoặc "Quá hạn 2 ngày".

### Câu 5 – Lọc, tìm kiếm và sắp xếp (1,5 điểm)

- Hàng nút lọc theo trạng thái: Tất cả / Chưa xong / Đã xong / Quá hạn; nút đang chọn được làm nổi bật.
- Ô tìm kiếm theo tên công việc, không phân biệt chữ hoa/thường.
- Nút chuyển đổi sắp xếp theo hạn hoàn thành (gần nhất lên đầu) hoặc theo mức ưu tiên (Cao → Thấp). Lọc, tìm kiếm và sắp xếp hoạt động đồng thời.

### Câu 6 – Lưu trữ (1 điểm)

- Lưu dữ liệu bằng AsyncStorage; tắt rồi mở lại ứng dụng dữ liệu vẫn còn.

### Câu 7 – Giao diện (2 điểm)

Chấm theo tiêu chí ở bảng dưới đây.

**TIÊU CHÍ CHẤM GIAO DIỆN – CÂU 7 (2 điểm)**

| Tiêu chí | Điểm | Yêu cầu |
| --- | --- | --- |
| Thống nhất | 0,5 | Có bảng màu chung (khai báo trong một file theme/colors); font và cỡ chữ nhất quán giữa các màn hình. Dùng `StyleSheet.create`, hạn chế style inline. |
| Bố cục | 0,5 | Khoảng cách (padding, margin) đều; mỗi dòng danh sách trình bày dạng thẻ (card) có bo góc, đổ bóng (elevation/shadow); thông tin chính nổi bật hơn thông tin phụ. |
| Phản hồi thao tác | 0,5 | Nút có hiệu ứng khi nhấn; nút bị vô hiệu hoá trông khác biệt; có trạng thái danh sách rỗng; ô nhập sai có viền đỏ. |
| Trải nghiệm | 0,5 | Bàn phím không che ô nhập (`KeyboardAvoidingView`/`ScrollView`); dùng đúng loại bàn phím (`numeric`, `phone-pad`); hiển thị đúng trong vùng an toàn (tai thỏ, thanh trạng thái). |

## THANG ĐIỂM

| Câu | Nội dung | Điểm |
| --- | --- | --- |
| 1 | Danh sách | 1,5 |
| 2 | Thêm / Sửa | 1,5 |
| 3 | Xoá | 1,0 |
| 4 | Chi tiết và nghiệp vụ | 1,5 |
| 5 | Lọc, tìm kiếm và sắp xếp | 1,5 |
| 6 | Lưu trữ AsyncStorage | 1,0 |
| 7 | Giao diện | 2,0 |
|  | **Tổng** | **10** |

**Trừ điểm:**

- Ứng dụng bị crash khi thao tác: trừ 1 điểm mỗi lỗi, tối đa 2 điểm.
- Toàn bộ code trong một file, không tách component/màn hình: trừ 0,5 điểm.
- Không chạy được bằng React Native CLI (ví dụ dùng Expo): không chấm bài.

— HẾT —
