# NOVRA Wellness

Website spa và wellness gồm 25 màn hình, dùng React, TypeScript, Vite và GSAP. Dự án được tổ chức theo từng tính năng; mở `/screens` để xem danh sách đầy đủ, `/motion-lab` để thử hiệu ứng chuyển động.

Demo trực tuyến: [novra-spa.netlify.app](https://novra-spa.netlify.app).

## Chạy dự án

Dùng Node.js 22.12 trở lên. Tại thư mục chứa `package.json`:

```bash
npm ci
npm run dev
```

Mở `http://127.0.0.1:5173`. Trên Windows có thể chạy `START_HERE.bat`. Không cần tạo lại dự án Vite.

## Kiểm tra

```bash
npm run typecheck
npm run test:routes
npm run format:check
npm run build
npm run preview
```

Build tạo thư mục `dist/`; có thể tạo lại bất cứ lúc nào. Khi triển khai, cấu hình hosting trả về `index.html` cho các đường dẫn của ứng dụng.

### Triển khai Netlify

Dự án có sẵn `netlify.toml`: dùng Node.js 22, chạy `npm run build` và xuất bản thư mục `dist`. File `public/_redirects` chuyển các đường dẫn như `/services` và `/booking` về ứng dụng React để tải lại trang không bị lỗi 404.

Khi kết nối repository với Netlify, chọn nhánh `main` và giữ các thiết lập build trên. Cũng có thể upload nội dung thư mục `dist` sau khi build. Không upload ZIP mã nguồn hoặc bộ ảnh marketplace làm bản website.

Khi dev server đang chạy, kiểm tra tự động trên Chrome hoặc Edge:

```powershell
npm run test:motion -- "C:\Program Files\Google\Chrome\Application\chrome.exe"
npm run test:ui -- "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

`test:ui` chạy kiểm tra motion, 25 màn hình ở desktop/mobile, các breakpoint bổ sung và luồng booking. Ảnh và báo cáo được tạo trong `qa/artifacts/`; đây là đầu ra tạm, không cần đưa vào mã nguồn. Chi tiết kiểm tra thủ công: [docs/SMOKE_TESTS.md](docs/SMOKE_TESTS.md).

## Cấu trúc

```text
src/
  app/          Router, danh mục màn hình, trang 404 và xử lý lỗi
  content/      Dữ liệu dịch vụ, gói, địa điểm và nội dung biên tập
  features/     Trang, component và logic riêng của từng tính năng
  shared/       Layout, hook, UI, motion và CSS dùng chung
  main.tsx      Điểm khởi chạy React
public/         Biểu tượng thương hiệu và robots.txt
docs/           Hướng dẫn tùy chỉnh, motion và QA
scripts/        Kiểm tra route và trình duyệt
```

`src/app/screen-directory.ts` chứa 25 mục trong danh sách; `src/app/routes.tsx` khai báo route và tải trang khi cần. Booking có ba bước tại `/booking?step=1`, `?step=2`, `?step=3`; tạo xác nhận demo qua wizard để xem màn hình cuối tại `/booking/confirmation`.

## Motion

Phiên bản showcase hiện tại bắt đầu với motion bật. Nút **MOTION ON/OFF** ở footer tạm dừng hoặc tiếp tục hiệu ứng trong lần mở hiện tại, giữ nguyên lựa chọn trên trang. Tải lại trình duyệt sẽ bật motion trở lại. Xem [hướng dẫn motion](docs/ANIMATION_GUIDE.md) để biết các file liên quan và cách chẩn đoán.

## Phạm vi demo

- Thương hiệu, nhân sự, địa điểm, giá và lịch trống đều là dữ liệu mẫu.
- Booking chạy ở frontend, lưu lựa chọn và xác nhận mẫu trong `sessionStorage`; không lưu tên, email hay số điện thoại vào xác nhận.
- Chưa có backend, thanh toán, lịch hẹn thật hoặc gửi email. Form liên hệ và gift card chỉ là bản xem trước.
- Ảnh Unsplash tải từ URL bên ngoài, không phải bộ ảnh được đóng gói để phân phối lại.

Xem [hướng dẫn tùy chỉnh](docs/CUSTOMIZATION.md) và [checklist phát hành](docs/QA_RELEASE_CHECKLIST.md) trước khi triển khai thực tế.
