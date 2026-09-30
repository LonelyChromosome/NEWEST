# Bài làm giữa kỳ - Express MVC NCKH

Project sử dụng Node.js, Express, EJS và SQLite, theo mô hình MVC.

## Phần 1. Phân tích project

### Câu 1. File xử lý chức năng hiển thị danh sách đề tài

| Thành phần | File | Hàm / nhiệm vụ |
|---|---|---|
| Route | `routes/topicRoutes.js` | `router.get('/', topicController.index)` |
| Controller | `controllers/topicController.js` | `exports.index` |
| Model | `models/topicModel.js` | `getAll(keyword)` |
| View | `views/topics/index.ejs` | Hiển thị danh sách đề tài |

### Câu 2. Luồng xử lý GET /topics

1. Trình duyệt gửi `GET /topics`.
2. `app.js` chuyển request vào `topicRoutes` bằng `app.use('/topics', topicRoutes)`.
3. `routes/topicRoutes.js` khớp route `GET /` và gọi `topicController.index`.
4. Controller lấy `req.query.keyword`, sau đó gọi `topicModel.getAll(keyword)`.
5. Model truy vấn bảng `topics` trong SQLite.
6. Model trả danh sách về controller.
7. Controller gọi `res.render('topics/index', { topics, keyword })`.
8. EJS tạo HTML và Express trả kết quả cho trình duyệt.

### Câu 3. Vai trò của routes, controllers, models và views

- **Routes:** xác định URL và HTTP method, sau đó chuyển request đến controller phù hợp.
- **Controllers:** nhận request, điều phối xử lý, gọi model và trả response.
- **Models:** làm việc trực tiếp với dữ liệu SQLite.
- **Views:** nhận dữ liệu từ controller và tạo giao diện HTML bằng EJS.

### Câu 4. Nếu bỏ express.urlencoded({ extended: true })

Nếu bỏ:

```js
app.use(express.urlencoded({ extended: true }));
```

dữ liệu gửi từ form HTML sẽ không được parse đúng vào `req.body`.

Hai thao tác bị ảnh hưởng trực tiếp:
- Thêm đề tài: `POST /topics/create`.
- Sửa đề tài: `POST /topics/edit/:id`.

## Phần 2. Tìm và sửa lỗi project

### Lỗi 1. Cannot GET /topics/create

**Nguyên nhân:** route ban đầu dùng `/new`, trong khi nút "Thêm đề tài" ở `index.ejs` trỏ tới `/topics/create`.

**Sửa tại `routes/topicRoutes.js`:**

```js
router.get('/create', topicController.showCreate);
router.post('/create', topicController.create);
```

**Sửa tại `views/topics/create.ejs`:**

```ejs
<form method="post" action="/topics/create">
```

### Lỗi 2. Submit form thêm đề tài báo lỗi

**Nguyên nhân:** sau khi INSERT thành công, controller cũ gọi:

```js
res.render('topics/list');
```

nhưng project không có file `views/topics/list.ejs`.

**Sửa tại `controllers/topicController.js`:**

```js
await topicModel.create({
  code: code.trim(),
  title: title.trim(),
  student_name: student_name.trim(),
  field: field.trim(),
  advisor: advisor.trim()
});

res.redirect('/topics');
```

Sau khi thêm thành công, trình duyệt quay về trang danh sách.

### Lỗi 3. URL có keyword nhưng danh sách chưa được lọc

**Nguyên nhân:** controller đã truyền `keyword` vào model, nhưng `getAll(keyword)` trước đó không dùng keyword và luôn lấy toàn bộ bảng.

**Sửa tại `models/topicModel.js`:**

```sql
SELECT * FROM topics
WHERE code LIKE ?
   OR title LIKE ?
   OR student_name LIKE ?
   OR field LIKE ?
ORDER BY id DESC
```

Từ khóa được chuyển thành:

```js
const pattern = `%${value}%`;
```

## Phần 3. Hoàn thiện chức năng tìm kiếm

Chức năng tìm kiếm hỗ trợ:
- `code`
- `title`
- `student_name`
- `field`

Ví dụ:

```text
/topics?keyword=AI
```

Nếu không có kết quả, `views/topics/index.ejs` hiển thị:

```ejs
<% if (!topics.length) { %>
  <p>Không tìm thấy đề tài phù hợp.</p>
<% } %>
```

Ô tìm kiếm giữ lại từ khóa nhờ:

```ejs
value="<%= keyword %>"
```

## Phần 4. Hoàn thiện chức năng sửa đề tài

Routes:

```js
router.get('/edit/:id', topicController.showEdit);
router.post('/edit/:id', topicController.update);
```

Controller lấy dữ liệu hiện tại bằng:

```js
const topic = await topicModel.getById(req.params.id);
```

Form `views/topics/edit.ejs` hiển thị dữ liệu hiện tại.

Các trường được sửa:
- `title`
- `student_name`
- `field`
- `advisor`

Model cập nhật thật trong SQLite:

```sql
UPDATE topics
SET title = ?, student_name = ?, field = ?, advisor = ?
WHERE id = ?
```

Sau khi sửa thành công:

```js
res.redirect('/topics');
```

## Phần 5. Hoàn thiện chức năng xóa đề tài

Route:

```js
router.post('/delete/:id', topicController.destroy);
```

Model xóa thật trong SQLite:

```sql
DELETE FROM topics WHERE id = ?
```

Sau khi xóa:

```js
res.redirect('/topics');
```

## Phần 6. Đọc hiểu code và giải thích

### Câu 1. :id trong route có ý nghĩa gì?

`:id` là route parameter, đại diện cho id động của đề tài cần xóa.

### Câu 2. req.params.id nhận giá trị từ đâu?

Nó nhận giá trị từ phần `:id` trên URL.

Ví dụ:

```text
POST /topics/delete/5
```

thì:

```js
req.params.id === '5'
```

### Câu 3. Nếu đổi req.params.id thành req.body.id thì vì sao có thể không hoạt động?

Form xóa truyền id trong URL, không gửi một input `id` trong body. Vì vậy `req.body.id` có thể là `undefined`.

### Câu 4. Tại sao dùng POST thay vì GET để xóa?

Xóa làm thay đổi dữ liệu. GET nên dùng để đọc dữ liệu, còn thao tác thay đổi dữ liệu trong bài này sử dụng POST.

### Câu 5. res.redirect('/topics') có tác dụng gì?

Sau khi model xử lý xong, trình duyệt được chuyển về `/topics` để tải lại danh sách mới.

## Kiểm tra project

```bash
npm install
npm start
```

Mở:

```text
http://localhost:3000/topics
```

Kiểm tra lần lượt:
1. Hiển thị danh sách.
2. Mở `/topics/create`.
3. Thêm đề tài.
4. Tìm kiếm bằng `?keyword=...`.
5. Sửa đề tài.
6. Xóa đề tài bằng POST.
7. Refresh lại trang để xác nhận SQLite đã thay đổi thật.
