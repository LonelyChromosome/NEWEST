# Bài làm giữa kỳ - Express MVC NCKH

> Project: **research-topic-midterm**  
> Công nghệ: **Node.js, Express, EJS, SQLite**  
> Mô hình: **MVC**

---

## Phần 1. Phân tích project - 20 điểm

### Câu 1 - File xử lý chức năng hiển thị danh sách đề tài

| Thành phần | File | Hàm / đoạn xử lý |
|---|---|---|
| Route | `routes/topicRoutes.js` | `router.get('/', topicController.index)` |
| Controller | `controllers/topicController.js` | `index(req, res)` |
| Model | `models/topicModel.js` | `getAllTopics(keyword)` |
| View | `views/topics/index.ejs` | Hiển thị danh sách đề tài |

### Câu 2 - Luồng xử lý khi truy cập GET /topics

1. Trình duyệt gửi request `GET /topics`.
2. Trong `app.js`, câu lệnh `app.use('/topics', topicRoutes)` chuyển request vào `routes/topicRoutes.js`.
3. Route `router.get('/', topicController.index)` được khớp.
4. Controller gọi hàm `index(req, res)`.
5. Controller lấy từ khóa bằng `req.query.keyword`.
6. Controller gọi `topicModel.getAllTopics(keyword)`.
7. Model truy vấn bảng `topics` trong SQLite.
8. Model trả danh sách đề tài về controller.
9. Controller gọi `res.render('topics/index', { topics, keyword })`.
10. `views/topics/index.ejs` tạo HTML và Express trả kết quả cho trình duyệt.

### Câu 3 - Vai trò của routes, controllers, models và views

- **Routes:** khai báo URL, HTTP method và chuyển request đến controller tương ứng.
- **Controllers:** nhận request, xử lý luồng nghiệp vụ, gọi model và trả response hoặc render view.
- **Models:** làm việc trực tiếp với dữ liệu SQLite, thực hiện SELECT, INSERT, UPDATE, DELETE.
- **Views:** các file EJS nhận dữ liệu từ controller và tạo giao diện HTML cho người dùng.

### Câu 4 - Nếu bỏ express.urlencoded({ extended: true })

Dòng hiện tại nằm tại **`app.js`, dòng 12**:

```js
app.use(express.urlencoded({ extended: true }));
```

Nếu bỏ middleware này, dữ liệu gửi từ các form HTML dạng URL-encoded sẽ không được parse đúng vào `req.body`.

Ít nhất hai chức năng bị ảnh hưởng:

1. **Thêm đề tài:** POST `/topics/create` cần đọc `code`, `title`, `student_name`, `field`, `advisor` từ `req.body`.
2. **Sửa đề tài:** POST `/topics/edit/:id` cần đọc `title`, `student_name`, `field`, `advisor` từ `req.body`.

---

## Phần 2. Tìm và sửa lỗi project - 15 điểm

### Lỗi 1 - Cannot GET /topics/create

**Nguyên nhân:** thiếu hoặc khai báo sai route GET dùng để mở form thêm đề tài.

**Vị trí sửa:** `routes/topicRoutes.js`, **dòng 8**.

```js
router.get('/create', topicController.showCreate);
```

Controller hiển thị form:

```js
function showCreate(req, res) {
  res.render('topics/create', { error: null, values: {} });
}
```

Sau khi sửa, truy cập:

```text
GET /topics/create
```

sẽ mở được form thêm đề tài.

**Ảnh minh chứng cần chụp khi nộp:**
- đoạn route đã sửa;
- trang form `/topics/create` mở thành công.

### Lỗi 2 - Submit form thêm đề tài báo lỗi

Luồng thêm đề tài đã được hoàn thiện ở các vị trí:

- `app.js`, dòng **12**: parse dữ liệu form.
- `routes/topicRoutes.js`, dòng **9**: route POST.
- `controllers/topicController.js`, từ dòng **21**: hàm `create`.
- `models/topicModel.js`, từ dòng **53**: hàm `createTopic`.
- `views/topics/create.ejs`: form POST đến `/topics/create`.

Route:

```js
router.post('/create', topicController.create);
```

Controller nhận dữ liệu:

```js
const { code, title, student_name, field, advisor } = req.body;
```

Model thêm dữ liệu thật vào SQLite:

```js
function createTopic(topic) {
  return run(
    `INSERT INTO topics (code, title, student_name, field, advisor)
     VALUES (?, ?, ?, ?, ?)`,
    [topic.code, topic.title, topic.student_name, topic.field, topic.advisor]
  );
}
```

Sau khi thêm thành công:

```js
res.redirect('/topics');
```

**Ảnh minh chứng cần chụp khi nộp:**
- code route/controller/model đã sửa;
- form trước khi submit;
- danh sách sau khi thêm thành công.

### Lỗi 3 - Có keyword trên URL nhưng danh sách chưa lọc

**Nguyên nhân:** giao diện đã gửi `keyword`, nhưng controller/model chưa sử dụng từ khóa để lọc dữ liệu.

**Các vị trí cần hoàn thiện trong source hiện tại:**

- `controllers/topicController.js`, dòng **5-6**:
  - lấy `req.query.keyword`;
  - truyền keyword vào model.
- `models/topicModel.js`, từ dòng **30**:
  - hàm `getAllTopics(keyword)`.
- `models/topicModel.js`, từ dòng **40**:
  - điều kiện `LIKE` cho các trường tìm kiếm.
- `views/topics/index.ejs`, dòng **22-24**:
  - input `keyword`;
  - giữ lại từ khóa sau khi tìm.

Code controller:

```js
const keyword = req.query.keyword || '';
const topics = await topicModel.getAllTopics(keyword);
```

---

## Phần 3. Hoàn thiện chức năng tìm kiếm - 15 điểm

Chức năng tìm kiếm đã hỗ trợ đúng 4 trường:

- `code`
- `title`
- `student_name`
- `field`

Model dùng cùng một từ khóa cho bốn điều kiện:

```sql
SELECT * FROM topics
WHERE code LIKE ?
   OR title LIKE ?
   OR student_name LIKE ?
   OR field LIKE ?
ORDER BY id DESC
```

Ví dụ:

```text
/topics?keyword=AI
```

Nếu có kết quả thì hiển thị các đề tài phù hợp.

Nếu không có kết quả, tại `views/topics/index.ejs`, **dòng 32**, giao diện kiểm tra:

```ejs
<% if (topics.length === 0) { %>
  <div class="empty">Khong tim thay de tai phu hop.</div>
<% } %>
```

Ô tìm kiếm giữ lại từ khóa đã nhập tại **dòng 24**:

```ejs
value="<%= keyword %>"
```

**Ảnh minh chứng cần chụp khi nộp:**
1. code controller/model/view phục vụ tìm kiếm;
2. danh sách trước khi tìm;
3. kết quả sau khi tìm;
4. trường hợp không tìm thấy kết quả.

---

## Phần 4. Hoàn thiện chức năng sửa đề tài - 20 điểm

### Routes

Trong `routes/topicRoutes.js`:

- dòng **11**:

```js
router.get('/edit/:id', topicController.showEdit);
```

- dòng **12**:

```js
router.post('/edit/:id', topicController.update);
```

### Hiển thị dữ liệu hiện tại

Controller `showEdit` nằm từ **dòng 49** của `controllers/topicController.js`.

Controller lấy đúng đề tài theo id:

```js
const topic = await topicModel.getTopicById(req.params.id);
```

sau đó render:

```js
res.render('topics/edit', { topic, error: null });
```

Trong `views/topics/edit.ejs`, các input dùng dữ liệu hiện tại của `topic`.

### Dữ liệu được phép sửa

- `title`
- `student_name`
- `field`
- `advisor`

Không sửa `code`.

### Update dữ liệu thật trong SQLite

Controller `update` bắt đầu tại **dòng 63**.

Model `updateTopic` bắt đầu tại **dòng 61** của `models/topicModel.js`:

```js
function updateTopic(id, topic) {
  return run(
    `UPDATE topics
     SET title = ?, student_name = ?, field = ?, advisor = ?
     WHERE id = ?`,
    [topic.title, topic.student_name, topic.field, topic.advisor, id]
  );
}
```

Sau khi sửa thành công:

```js
res.redirect('/topics');
```

**Ảnh minh chứng cần chụp khi nộp:**
1. route sửa;
2. controller/model update;
3. dữ liệu trước khi sửa;
4. form edit có dữ liệu hiện tại;
5. danh sách sau khi sửa.

---

## Phần 5. Hoàn thiện chức năng xóa đề tài - 15 điểm

Route nằm tại `routes/topicRoutes.js`, **dòng 14**:

```js
router.post('/delete/:id', topicController.destroy);
```

Đề yêu cầu không dùng GET để xóa nên route sử dụng đúng `POST`.

Trong `views/topics/index.ejs`, form xóa nằm từ khoảng **dòng 59**:

```ejs
<form
  class="inline"
  action="/topics/delete/<%= topic.id %>"
  method="POST"
>
```

Controller `destroy` bắt đầu tại **dòng 91**:

```js
async function destroy(req, res) {
  try {
    await topicModel.deleteTopic(req.params.id);
    res.redirect('/topics');
  } catch (error) {
    res.status(500).send(error.message);
  }
}
```

Model `deleteTopic` bắt đầu tại **dòng 70**:

```js
function deleteTopic(id) {
  return run('DELETE FROM topics WHERE id = ?', [id]);
}
```

Dữ liệu bị xóa thật khỏi SQLite, sau đó redirect về danh sách.

**Ảnh minh chứng cần chụp khi nộp:**
1. route/controller/model xóa;
2. danh sách trước khi xóa;
3. danh sách sau khi xóa.

---

## Phần 6. Đọc hiểu code và giải thích - 15 điểm

Đoạn code:

```js
router.post('/delete/:id', topicController.destroy);

async function destroy(req, res) {
  await topicModel.deleteTopic(req.params.id);
  res.redirect('/topics');
}
```

### Câu 1 - :id trong route có ý nghĩa gì?

`:id` là **route parameter**, tức là một phần động của URL dùng để truyền id của đề tài cần thao tác.

Ví dụ:

```text
/topics/delete/5
```

thì `:id` có giá trị là `5`.

### Câu 2 - req.params.id nhận giá trị từ đâu?

`req.params.id` nhận giá trị từ phần `:id` của URL đã khớp với route.

Ví dụ:

```text
POST /topics/delete/5
```

thì:

```js
req.params.id === '5'
```

### Câu 3 - Vì sao đổi thành req.body.id có thể không hoạt động?

Trong chức năng xóa hiện tại, id được truyền trực tiếp trên URL:

```text
/topics/delete/:id
```

Form không gửi một input tên `id` trong request body. Vì vậy:

```js
req.body.id
```

có thể là `undefined`, trong khi:

```js
req.params.id
```

lấy đúng id từ URL.

### Câu 4 - Tại sao dùng POST thay vì GET để xóa?

GET được dùng cho thao tác đọc dữ liệu và không nên làm thay đổi trạng thái hệ thống.

Xóa dữ liệu làm thay đổi database nên sử dụng POST phù hợp hơn. Nếu dùng GET, URL xóa có thể bị truy cập ngoài ý muốn thông qua link, history, crawler hoặc cơ chế prefetch/cache của trình duyệt.

### Câu 5 - res.redirect('/topics') có tác dụng gì?

Sau khi model xóa xong dữ liệu:

```js
res.redirect('/topics');
```

yêu cầu trình duyệt gửi một request mới đến `/topics`.

Nhờ đó trang danh sách được tải lại và người dùng thấy dữ liệu mới sau khi bản ghi đã bị xóa.

---

## Kiểm tra project

Chạy:

```bash
npm install
npm start
```

Truy cập:

```text
http://localhost:3000/topics
```

Các chức năng cần kiểm tra lần lượt:

1. Hiển thị danh sách đề tài.
2. Mở `/topics/create`.
3. Thêm đề tài.
4. Tìm kiếm bằng `?keyword=...`.
5. Sửa đề tài.
6. Xóa đề tài bằng POST.
7. Refresh lại trang để xác nhận SQLite đã thay đổi thật.

> Khi nộp bài, bổ sung ảnh chụp code và ảnh kết quả chạy thực tế vào file bài làm theo đúng các vị trí yêu cầu của đề.
