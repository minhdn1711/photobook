# Hướng Dẫn Sử Dụng Dành Cho Quản Trị Viên (Admin)

Giao diện Admin (`/admin`) được thiết kế riêng biệt để quản lý luồng công việc in ấn, quản lý mẫu thiết kế và thống kê kinh doanh.

---

### 1. Đăng nhập và Dashboard Tổng quan
- Truy cập vào đường dẫn `/admin/dashboard` (Yêu cầu tài khoản có quyền Admin).
- Tại đây hiển thị các **Thẻ KPI (Chỉ số)** quan trọng như: Đơn hàng chờ xử lý, Doanh thu ước tính trong tháng, Số lượng khách hàng.
- Nút **Dark/Light Mode** ở góc dưới cùng bên trái thanh Sidebar giúp bạn đổi màu giao diện cho phù hợp với môi trường làm việc (Sáng hoặc Tối).

### 2. Quản lý Đơn hàng (Orders)
1. Truy cập mục **Đơn hàng** từ menu bên trái.
2. Danh sách đơn hàng được hiển thị dưới dạng bảng. Bạn có thể bấm vào các tab (Tất cả, Đang chờ, Đang in, Hoàn thành) để lọc đơn.
3. Bấm vào nút **Xử lý** hoặc **Xem** ở cuối một hàng để vào trang Chi tiết đơn hàng.

### 3. Chi tiết Đơn hàng & Xử lý Render In ấn (Render Pipeline)
Đây là tính năng quan trọng nhất dành cho bộ phận kỹ thuật xưởng in:
1. Trong trang **Chi tiết đơn hàng** (`/admin/orders/:id`), Admin có thể xem toàn bộ thông tin thanh toán, số tiền đã cọc và địa chỉ giao hàng của khách.
2. Mục **Tệp thiết kế (Design Files)** sẽ báo cáo tình trạng file (VD: Đã sẵn sàng).
3. Bấm nút **Bắt đầu Render**.
4. Hệ thống sẽ kết nối với Render Worker và mô phỏng tiến trình kết xuất PDF chuẩn in (Render Queue) với một thanh tiến trình chạy từ 0 - 100%.
5. Khi tiến trình hoàn tất, màn hình sẽ hiển thị trạng thái **Thành công** kèm theo nút **Tải xuống PDF (Hệ màu CMYK)**.
6. Sau khi tải file mang đi in, Admin có thể cập nhật trạng thái đơn hàng sang "Đang in ấn" hoặc "Đã giao hàng".

### 4. Quản lý Mẫu thiết kế (Templates)
- Truy cập mục **Mẫu thiết kế** từ menu.
- Tại đây hiển thị danh sách các mẫu đang có trên hệ thống (đã phân loại theo chuyên mục).
- Admin có thể xem trạng thái của mẫu (ACTIVE, DRAFT) và số lượng lượt sử dụng để đánh giá độ "Hot" của mẫu.
- Các tính năng hỗ trợ: Chỉnh sửa thông tin, Tạm ẩn mẫu, Công bố mẫu thiết kế từ bản nháp.

---

**Cần hỗ trợ kỹ thuật?**
Nếu có bất kỳ lỗi nào xảy ra trong quá trình sử dụng hệ thống quản trị, vui lòng kiểm tra kết nối mạng. Đối với các vấn đề sâu hơn về cấu hình hệ thống, vui lòng liên hệ với nhà phát triển hoặc bộ phận Server.
