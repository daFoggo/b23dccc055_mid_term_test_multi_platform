# Phong cách giao diện: M3 kết hợp "phẳng" kiểu wattprint

Mục tiêu: giữ hệ vai trò màu, thang chữ và component của Material 3 ([material-3.md](material-3.md)), nhưng áp dụng phong cách sạch, phẳng của wattprint (`D:\Dev_Projects\wattprint-expo\docs\design-system\wattprint-design-system.html`). Chỉ lấy các phần liên quan, không sao chép cả theme.

## Lấy từ wattprint

| Nguyên tắc wattprint | Áp dụng trong app |
| --- | --- |
| Phân tầng bằng chênh màu: nền trang xám nhạt, thẻ trắng | `surface` `#F4F4F4`, thẻ dùng `surfaceContainerLow` `#FFFFFF` |
| Thẻ bo lớn (24), điều khiển bo 16, chip/badge dạng pill | `radius.card` 24, `radius.control` 16, `radius.full` cho chip, badge, search, segmented |
| Ô nhập nền xám đặc, không viền lúc nghỉ; viền khi focus hoặc lỗi | `TextField`: nền `surfaceContainerHigh`, viền trong suốt 2px, focus `primary`, lỗi `error` |
| Chỉ hai độ đậm chữ (600 và 700) | Inter SemiBold cho tiêu đề và nhãn, Bold cho headline và badge, Regular cho nội dung |
| Phần tử bấm cao tối thiểu 48dp | Button 48, chip 48, ô nhập 52 |
| Hiệu ứng nhấn thu nhỏ nhẹ (scale 0,97), disabled mờ 40% | `Button`, `Chip`, `Fab`, `SegmentedButtons` |
| Header không bóng, không viền | `headerShadowVisible: false` |
| Không đổ bóng, không viền thẻ | Bỏ viền thẻ; FAB và nút không có bóng |

## Giữ lại từ M3

- 26 vai trò màu (primary, secondary container, error, surface container, outline...), seed `#6750A4`.
- Component: segmented button, search bar, extended FAB, snackbar, chip có dấu tick khi chọn.
- Icon Material (`react-native-vector-icons`).

## Bố cục danh sách (gọn một hàng)

- **Hàng lọc**: 4 ô chia đều trên một hàng, số lượng (SemiBold 16) ở trên, nhãn (12) ở dưới. Ô đang chọn nền `secondaryContainer`; số "Quá hạn" đỏ khi có việc quá hạn. Thay cho hàng chip xuống dòng.
- **Thẻ công việc 2 dòng**: dòng 1 là tên (tối đa 2 dòng) và nhãn ưu tiên căn phải; dòng 2 là danh mục, hạn, và nhãn "Quá hạn" (khi có). Checkbox căn giữa theo chiều dọc.
- **FAB** phẳng, nền `primary`, ghi đúng "+ Thêm việc".

## Ngoại lệ có chủ ý: đổ bóng nhẹ trên thẻ danh sách

Bảng chấm Câu 7, tiêu chí Bố cục (0,5 điểm), yêu cầu thẻ "có bo góc, đổ bóng (elevation/shadow)". Style phẳng của wattprint không dùng bóng, nên app giữ **một lớp elevation 1 rất nhạt** (`shadowOpacity` ≈ 0,05) chỉ cho thẻ công việc. Mọi chỗ khác không dùng bóng. Snackbar vẫn có elevation 6 theo M3.

## Font

- Inter 18pt (Regular, SemiBold, Bold) nằm trong `android/app/src/main/assets/fonts/`, nguồn OFL.
- Android chọn độ đậm theo tên file nên token dùng `fontFamily` riêng cho mỗi độ đậm (`src/theme/fonts.ts`), không dùng `fontWeight`.
- **Chưa làm cho iOS**: cần thêm file font vào Xcode project và `UIAppFonts` trong `Info.plist`. Hiện `Info.plist` chỉ khai báo font icon `MaterialIcons.ttf`.
- Không có Inter Medium (500): nhãn và tiêu đề M3 vốn là 500 nay dùng SemiBold.

## Chưa áp dụng từ wattprint

- Màu nhấn xanh lá và bộ màu năng lượng (không liên quan).
- Dark mode, tab bar nổi, danh sách gom nhóm trong thẻ có đường kẻ.
- Chip cao 24 / badge dạng tint nền (badge ưu tiên giữ màu đậm hơn để người chấm thấy rõ đỏ, vàng, xanh theo Câu 1).
