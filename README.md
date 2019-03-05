# Đồ án phân tích thiết kế hệ thống thông tin - nghe nhạc trực tuyến

## Hướng dẫn cài đặt
  - Yêu cầu môi trường: NodeJs, npm (node package manager), PostgresSQL
  - Cài đặt các thư viện cần thiết: trong cmd/terminal ở thư thư mục chứa project
      ```
        npm install  
        cd client    
        npm install
      ```
  - Thiết lập cơ sở dữ liệu:
      * tạo 1 file text có tên .env trong thư mục của project với nội dung:
      ```
      DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database_name>
      ```
      * trong đó:
        * username: tên đăng nhập của postgres sql
        * password: mật khẩu đăng nhập postgres sql
        * host: địa chỉ host của postgres sql
        * port: số cổng của host
        * database_name: tên csdl bạn muốn lưu dữ liệu cho project, bạn cần tạo trước csdl trên postgres sql
        
      * thêm dữ liệu mẫu vào trong csdl (migrate, seed): trong cmd/terminal ở thư thư mục chứa project chạy các lệnh:
      ```
      node database/migrate.js
      node database/seed/seeder.js
      ```
  - Chạy project:
    * Chạy với chế độ nhà phát triển (development): tại cửa sổ cmd/terminal:  `npm run dev`
    * Chạy với chế độ hoản chỉnh (production): tại cửa sổ cmd/terminal:  `npm run production` , sau đó mở localhost:5000 trên cửa sổ trình duyệt để sử dụng
 
