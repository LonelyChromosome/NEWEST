# Bài làm giữa kỳ - Express MVC NCKH

## Phần 1. Phân tích project

### Câu 1. File xử lý chức năng hiển thị danh sách đề tài

| Thành phần | File | Hàm / nhiệm vụ |
|---|---|---|
| Route | `routes/topicRoutes.js` | `router.get('/', topicController.index)` |
| Controller | `controllers/topicController.js` | `index(req, res)` |
| Model | `models/topicModel.js` | `getAllTopics(keyword)` |
| View | `views/topics/index.ejs` | Hiển thị danh sách đề tài |

### Câu 2. Luồng xử lý GET /topics

1. Trình duyệt gửi request `GET /topics`.
2. `app.js` chuyển request vào `topicRoutes` qua `app.use('/topics', topicRoutes)`.
3. `routes/topicRoutes.js` khớp route `GET /` và gọi `topicController.index`.
4. Controller lấy `req.query.keyword`, sau đó gọi `topicModel.getAllTopics(keyword)`.
5. Model truy vấn bảng `topics` trong SQLite.
6. Model trả danh sách bản ghi về controller.
7. Controller gọi `res.render('topics/index', { topics, keyword })`.
8. EJS tạo HTML và Express trả response cho trình duyệt.

### Câu 3. Vai trò của routes, controllers, models, views

- **Routes:** xác định URL và HTTP method, sau đó chuyển request đến controller phù hợp.
- **Controllers:** nhận request, điều phối xử lý, gọi model và chọn response/view.
- **Models:** làm việc với dữ liệu và SQLite; chứa các truy vấn lấy, thêm, sửa, xóa.
- **Views:** giao diện EJS nhận dữ liệu từ controller và tạo HTML hiển thị cho người dùng.

### Câu 4. Ảnh hưởng khi bỏ express.urlencoded

Nếu bỏ:

```js
app.use(express.urlencoded({ extended: true }));
```

ít nhất hai thao tác bị ảnh hưởng:

1. **Thêm đề tài:** form POST `/topics/create` gửi dữ liệu dạng URL-encoded nhưng Express không parse, nên `req.body` không có các trường cần thiết.
2. **Sửa đề tài:** form POST `/topics/edit/:id` cũng gửi URL-encoded nên controller không đọc được `title`, `student_name`, `field`, `advisor`.

## Phần 2. Các lỗi đã sửa

### Lỗi 1 - Cannot GET /topics/create

Nguyên nhân: thiếu hoặc sai route GET mở form tạo mới.

Sửa tại `routes/topicRoutes.js`:

```js
router.get('/create', topicController.showCreate);
```

### Lỗi 2 - Submit form thêm đề tài báo lỗi

Các phần cần đúng đồng thời:
- `app.js` có middleware `express.urlencoded(...)`.
- form dùng `method="POST"`, action `/topics/create`.
- route POST gọi đúng `topicController.create`.
- controller truyền đúng dữ liệu cho `topicModel.createTopic`.
- model thực hiện câu lệnh INSERT.

Sau khi thêm thành công:

```js
res.redirect('/topics');
```

### Lỗi 3 - URL có keyword nhưng danh sách chưa lọc

Vị trí hoàn thiện:
- `controllers/topicController.js`: hàm `index` lấy `req.query.keyword`.
- `models/topicModel.js`: hàm `getAllTopics(keyword)` thêm điều kiện LIKE cho `code`, `title`, `student_name`, `field`.
- `views/topics/index.ejs`: giữ lại giá trị keyword trong ô tìm kiếm và hiển thị thông báo khi không có kết quả.

## Phần 3. Tìm kiếm

Đã hỗ trợ tìm theo:
- `code`
- `title`
- `student_name`
- `field`

Ví dụ:

`/topics?keyword=AI`

Nếu không có kết quả, giao diện hiển thị:

> Khong tim thay de tai phu hop.

Ô tìm kiếm giữ lại từ khóa qua:

```ejs
value="<%= keyword %>"
```

## Phần 4. Sửa đề tài

Routes:

```js
router.get('/edit/:id', topicController.showEdit);
router.post('/edit/:id', topicController.update);
```

Form hiển thị dữ liệu hiện tại. Các trường được sửa:
- `title`
- `student_name`
- `field`
- `advisor`

Model chạy lệnh `UPDATE` thật trên SQLite và sau khi thành công redirect về `/topics`.

## Phần 5. Xóa đề tài

Route:

```js
router.post('/delete/:id', topicController.destroy);
```

Không dùng GET. Model chạy:

```sql
DELETE FROM topics WHERE id = ?
```

Sau khi xóa redirect về `/topics`.

## Phần 6. Đọc hiểu code

### Câu 1

`:id` là route parameter, đại diện cho id động của đề tài cần xóa.

### Câu 2

`req.params.id` lấy giá trị từ phần `:id` trên URL.

Ví dụ request:

`POST /topics/delete/5`

thì:

```js
req.params.id === '5'
```

### Câu 3

Nếu đổi thành `req.body.id`, chức năng có thể không hoạt động vì form xóa hiện truyền id trong URL, không gửi input `id` trong body. Vì vậy `req.body.id` có thể là `undefined`.

### Câu 4

Xóa làm thay đổi dữ liệu nên dùng POST thay vì GET. GET nên dành cho thao tác đọc dữ liệu và có thể bị trình duyệt, crawler hoặc cache gọi lại ngoài ý muốn.

### Câu 5

`res.redirect('/topics')` gửi phản hồi redirect cho trình duyệt để tải lại trang danh sách. Khi đó người dùng thấy danh sách mới sau khi bản ghi đã bị xóa.

## Chạy project

```bash
npm install
npm start
```

Mở:

`http://localhost:3000/topics`

File `data/database.sqlite` sẽ được tạo tự động ở lần chạy đầu tiên.
