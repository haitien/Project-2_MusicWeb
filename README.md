# Đồ án phân tích thiết kế hệ thống thông tin - nghe nhạc trực tuyến

## Hướng dẫn cài đặt
  - Yêu cầu môi trường: NodeJs, npm (node package manager), MySQL 
  - Cài đặt các thư viện cần thiết: trong cmd/terminal ở thư thư mục chứa project
      ```
        npm install  
        cd client    
        npm install
      ```
  - Thiết lập cơ sở dữ liệu:
      * tạo 1 file text có tên .env trong thư mục của project với nội dung giống như file .env.example
      DB_HOST=127.0.0.1
      DB_DATABASE=music
      DB_USERNAME=root
      DB_PASSWORD=
      * sau đó thay đổi nội dung file .env:
        * DB_USERNAME: tên đăng nhập của MySQL 
        * DB_PASSWORD: mật khẩu đăng nhập MySQL 
        * DB_HOST: địa chỉ host của MySQL
        * DB_DATABASE: tên csdl bạn muốn lưu dữ liệu cho project, bạn cần tạo trước csdl trên MySQL
        
      * thêm dữ liệu mẫu vào trong csdl (migrate, seed): trong cmd/terminal ở thư thư mục chứa project chạy các lệnh:
      ```
      npm run migrate
      ```
  - Chạy project:
    * Chạy với chế độ nhà phát triển (development): tại cửa sổ cmd/terminal:  `npm run dev`  , sau đó mở cửa sổ trình duyệt localhost:3000
    * Chạy với chế độ hoàn chỉnh (production): tại cửa sổ cmd/terminal:  `npm run production` , sau đó mở localhost:5000 trên cửa sổ trình duyệt để sử dụng
  - Đăng nhập: 
    * Với tài khoản admin:  name2 và mật khẩu 12345678
    * Với tài khoản thường: name1 và mật khẩu 12345678
  - Địa chỉ deploy của trang web: https://mussicc.herokuapp.com/

 
