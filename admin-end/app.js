const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbconfig = require('./dbconfig');

const app = express();
const port = 8091;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 数据库连接
const connection = mysql.createConnection(dbconfig);

connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('数据库连接成功');
});

// 静态文件服务
app.use(express.static('public'));

// ========== 参数校验辅助函数 ==========
function validateId(id) {
  const num = parseInt(id, 10);
  return !isNaN(num) && num > 0;
}

// ========== 统计数据 ==========
app.get('/api/dashboard', (req, res) => {
  const userCountQuery = 'SELECT COUNT(*) as userCount FROM user';
  const videoCountQuery = 'SELECT COUNT(*) as videoCount FROM video';
  const carouselCountQuery = 'SELECT COUNT(*) as carouselCount FROM carousel';
  const commentCountQuery = 'SELECT COUNT(*) as commentCount FROM comment';
  const orderCountQuery = 'SELECT COUNT(*) as orderCount FROM order_record';
  const categoryCountQuery = 'SELECT COUNT(*) as categoryCount FROM category';
  const reviewCountQuery = 'SELECT COUNT(*) as reviewCount FROM review';

  connection.query(userCountQuery, (err, userResult) => {
    if (err) { res.status(500).json({ error: '获取统计数据失败' }); return; }
    connection.query(videoCountQuery, (err, videoResult) => {
      if (err) { res.status(500).json({ error: '获取统计数据失败' }); return; }
      connection.query(carouselCountQuery, (err, carouselResult) => {
        if (err) { res.status(500).json({ error: '获取统计数据失败' }); return; }
        connection.query(commentCountQuery, (err, commentResult) => {
          if (err) { res.status(500).json({ error: '获取统计数据失败' }); return; }
          connection.query(orderCountQuery, (err, orderResult) => {
            if (err) { res.status(500).json({ error: '获取统计数据失败' }); return; }
            connection.query(categoryCountQuery, (err, categoryResult) => {
              if (err) { res.status(500).json({ error: '获取统计数据失败' }); return; }
              connection.query(reviewCountQuery, (err, reviewResult) => {
                if (err) { res.status(500).json({ error: '获取统计数据失败' }); return; }
                res.json({
                  userCount: userResult[0].userCount,
                  videoCount: videoResult[0].videoCount,
                  carouselCount: carouselResult[0].carouselCount,
                  commentCount: commentResult[0].commentCount,
                  orderCount: orderResult[0].orderCount,
                  categoryCount: categoryResult[0].categoryCount,
                  reviewCount: reviewResult[0].reviewCount
                });
              });
            });
          });
        });
      });
    });
  });
});

// ========== 用户管理 ==========
app.get('/api/users', (req, res) => {
  connection.query('SELECT * FROM user ORDER BY id ASC', (err, results) => {
    if (err) { res.status(500).json({ error: '获取用户列表失败' }); return; }
    res.json(results);
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '用户id格式错误' }); return; }
  connection.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
    if (err) { res.status(500).json({ error: '获取用户信息失败' }); return; }
    if (results.length === 0) { res.status(404).json({ error: '用户不存在' }); return; }
    res.json(results[0]);
  });
});

app.post('/api/users', (req, res) => {
  const { username, password, nickname, phone, email } = req.body;
  if (!username || !password) { res.status(400).json({ error: '用户名和密码不能为空' }); return; }
  connection.query('INSERT INTO user (username, password, nickname, phone, email) VALUES (?, ?, ?, ?, ?)',
    [username, password, nickname || username, phone || '', email || ''], (err, result) => {
    if (err) { res.status(500).json({ error: '添加用户失败' }); return; }
    res.json({ message: '添加用户成功', id: result.insertId });
  });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '用户id格式错误' }); return; }
  const { nickname, phone, email } = req.body;
  connection.query('UPDATE user SET nickname = ?, phone = ?, email = ? WHERE id = ?',
    [nickname || '', phone || '', email || '', id], (err, result) => {
    if (err) { res.status(500).json({ error: '更新用户失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '用户不存在' }); return; }
    res.json({ message: '更新用户成功', id });
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '用户id格式错误' }); return; }
  connection.query('DELETE FROM user WHERE id = ?', [id], (err, result) => {
    if (err) { res.status(500).json({ error: '删除用户失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '用户不存在' }); return; }
    res.json({ message: '用户删除成功' });
  });
});

// ========== 视频管理 ==========
app.get('/api/videos', (req, res) => {
  connection.query('SELECT v.*, c.name as category_name FROM video v LEFT JOIN category c ON v.category_id = c.id ORDER BY v.upload_time DESC', (err, results) => {
    if (err) { res.status(500).json({ error: '获取视频列表失败' }); return; }
    res.json(results);
  });
});

app.get('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '视频id格式错误' }); return; }
  connection.query('SELECT v.*, c.name as category_name FROM video v LEFT JOIN category c ON v.category_id = c.id WHERE v.id = ?', [id], (err, results) => {
    if (err) { res.status(500).json({ error: '获取视频信息失败' }); return; }
    if (results.length === 0) { res.status(404).json({ error: '视频不存在' }); return; }
    res.json(results[0]);
  });
});

app.post('/api/videos', (req, res) => {
  const { name, author, url, category_id } = req.body;
  if (!name || name.length > 100) { res.status(400).json({ error: '视频名称不能为空且不超过100字符' }); return; }
  connection.query('INSERT INTO video (name, author, url, category_id) VALUES (?, ?, ?, ?)',
    [name, author || '匿名', url || '', category_id || 0], (err, result) => {
    if (err) { res.status(500).json({ error: '添加视频失败' }); return; }
    res.json({ message: '添加视频成功', id: result.insertId });
  });
});

app.put('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '视频id格式错误' }); return; }
  const { name, author, url, category_id } = req.body;
  connection.query('UPDATE video SET name = ?, author = ?, url = ?, category_id = ? WHERE id = ?',
    [name, author, url, category_id, id], (err, result) => {
    if (err) { res.status(500).json({ error: '更新视频失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '视频不存在' }); return; }
    res.json({ message: '更新视频成功', id });
  });
});

app.delete('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '视频id格式错误' }); return; }
  connection.query('DELETE FROM video WHERE id = ?', [id], (err, result) => {
    if (err) { res.status(500).json({ error: '删除视频失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '视频不存在' }); return; }
    res.json({ message: '视频删除成功' });
  });
});

// ========== 轮播图管理 ==========
app.get('/api/carousels', (req, res) => {
  connection.query('SELECT * FROM carousel ORDER BY sort ASC', (err, results) => {
    if (err) { res.status(500).json({ error: '获取轮播图列表失败' }); return; }
    res.json(results);
  });
});

app.post('/api/carousels', (req, res) => {
  const { adv, pic, vid, sort } = req.body;
  if (!adv || adv.length > 100) { res.status(400).json({ error: '宣传语不能为空且不超过100字符' }); return; }
  connection.query('INSERT INTO carousel (adv, pic, vid, sort) VALUES (?, ?, ?, ?)',
    [adv, pic || '', vid || 0, sort || 0], (err, result) => {
    if (err) { res.status(500).json({ error: '添加轮播图失败' }); return; }
    res.json({ message: '添加轮播图成功', id: result.insertId });
  });
});

app.put('/api/carousels/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '轮播图id格式错误' }); return; }
  const { adv, pic, vid, sort } = req.body;
  connection.query('UPDATE carousel SET adv = ?, pic = ?, vid = ?, sort = ? WHERE id = ?',
    [adv, pic, vid, sort, id], (err, result) => {
    if (err) { res.status(500).json({ error: '更新轮播图失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '轮播图不存在' }); return; }
    res.json({ message: '更新轮播图成功', id });
  });
});

app.delete('/api/carousels/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '轮播图id格式错误' }); return; }
  connection.query('DELETE FROM carousel WHERE id = ?', [id], (err, result) => {
    if (err) { res.status(500).json({ error: '删除轮播图失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '轮播图不存在' }); return; }
    res.json({ message: '轮播图删除成功' });
  });
});

// ========== 分类管理 ==========
app.get('/api/categories', (req, res) => {
  connection.query('SELECT * FROM category ORDER BY sort ASC', (err, results) => {
    if (err) { res.status(500).json({ error: '获取分类列表失败' }); return; }
    res.json(results);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, icon, sort } = req.body;
  if (!name || name.length > 50) { res.status(400).json({ error: '分类名称不能为空且不超过50字符' }); return; }
  connection.query('INSERT INTO category (name, icon, sort) VALUES (?, ?, ?)',
    [name, icon || '', sort || 0], (err, result) => {
    if (err) { res.status(500).json({ error: '添加分类失败' }); return; }
    res.json({ message: '添加分类成功', id: result.insertId });
  });
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '分类id格式错误' }); return; }
  connection.query('DELETE FROM category WHERE id = ?', [id], (err, result) => {
    if (err) { res.status(500).json({ error: '删除分类失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '分类不存在' }); return; }
    res.json({ message: '删除分类成功' });
  });
});

// ========== 评论管理 ==========
app.get('/api/comments', (req, res) => {
  connection.query('SELECT c.*, u.nickname, u.username FROM comment c LEFT JOIN user u ON c.user_id = u.id ORDER BY c.created_at DESC', (err, results) => {
    if (err) { res.status(500).json({ error: '获取评论列表失败' }); return; }
    res.json(results);
  });
});

app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '评论id格式错误' }); return; }
  connection.query('DELETE FROM comment WHERE id = ?', [id], (err, result) => {
    if (err) { res.status(500).json({ error: '删除评论失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '评论不存在' }); return; }
    res.json({ message: '评论删除成功' });
  });
});

// ========== 订单管理 ==========
app.get('/api/orders', (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT o.*, u.nickname FROM order_record o LEFT JOIN user u ON o.user_id = u.id WHERE 1=1';
  const params = [];
  if (status !== undefined && status !== '') {
    sql += ' AND o.status = ?';
    params.push(status);
  }
  sql += ' ORDER BY o.created_at DESC';
  connection.query(sql, params, (err, results) => {
    if (err) { res.status(500).json({ error: '获取订单列表失败' }); return; }
    res.json(results);
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '订单id格式错误' }); return; }
  const { status } = req.body;
  if (status !== 0 && status !== 1 && status !== 2) { res.status(400).json({ error: '订单状态只能是0待支付,1已支付,2已取消' }); return; }
  connection.query('UPDATE order_record SET status = ? WHERE id = ?', [status, id], (err, result) => {
    if (err) { res.status(500).json({ error: '更新订单状态失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '订单不存在' }); return; }
    res.json({ message: '更新订单状态成功', id, status });
  });
});

// ========== 评价管理 ==========
app.get('/api/reviews', (req, res) => {
  connection.query('SELECT r.*, u.nickname, u.username FROM review r LEFT JOIN user u ON r.user_id = u.id ORDER BY r.created_at DESC', (err, results) => {
    if (err) { res.status(500).json({ error: '获取评价列表失败' }); return; }
    res.json(results);
  });
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) { res.status(400).json({ error: '评价id格式错误' }); return; }
  connection.query('DELETE FROM review WHERE id = ?', [id], (err, result) => {
    if (err) { res.status(500).json({ error: '删除评价失败' }); return; }
    if (result.affectedRows === 0) { res.status(404).json({ error: '评价不存在' }); return; }
    res.json({ message: '删除评价成功' });
  });
});

// ========== 点赞管理 ==========
app.get('/api/likes', (req, res) => {
  connection.query('SELECT l.*, u.nickname, v.name as video_name FROM like_record l LEFT JOIN user u ON l.user_id = u.id LEFT JOIN video v ON l.video_id = v.id ORDER BY l.created_at DESC', (err, results) => {
    if (err) { res.status(500).json({ error: '获取点赞列表失败' }); return; }
    res.json(results);
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
