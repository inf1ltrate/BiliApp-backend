const express = require('express');
const connection = require('./dbconfig');
const app = express();
const port = 8080;

app.use(express.json());

// 处理跨域
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// ========== 参数校验辅助函数 ==========
function validateId(id) {
  const num = parseInt(id, 10);
  return !isNaN(num) && num > 0;
}

// ========== 用户表接口 ==========
// 用户登录
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: '用户名或密码错误' });
      return;
    }
    const user = results[0];
    res.json({ message: '登录成功', user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar } });
  });
});

// 用户注册
app.post('/register', (req, res) => {
  const { username, password, nickname, phone, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  if (username.length < 2 || username.length > 50) {
    return res.status(400).json({ error: '用户名长度需在2-50个字符之间' });
  }
  if (password.length < 6 || password.length > 50) {
    return res.status(400).json({ error: '密码长度需在6-50个字符之间' });
  }
  connection.query('INSERT INTO user (username, password, nickname, phone, email) VALUES (?, ?, ?, ?, ?)',
    [username, password, nickname || username, phone || '', email || ''], (err, results) => {
    if (err) {
      res.status(500).json({ error: '注册失败，用户名可能已存在' });
      return;
    }
    res.json({ message: '注册成功', id: results.insertId, username });
  });
});

// 获取所有用户
app.get('/users', (req, res) => {
  connection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// 获取单个用户
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '用户id格式错误' });
  }
  connection.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json(results[0]);
  });
});

// 新增用户
app.post('/users', (req, res) => {
  const { username, password, nickname, phone, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  connection.query('INSERT INTO user (username, password, nickname, phone, email) VALUES (?, ?, ?, ?, ?)',
    [username, password, nickname || username, phone || '', email || ''], (err, results) => {
    if (err) {
      res.status(500).json({ error: '添加用户失败' });
      return;
    }
    res.json({ message: '添加用户成功', id: results.insertId, username });
  });
});

// 更新用户
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '用户id格式错误' });
  }
  const { nickname, phone, email } = req.body;
  connection.query('UPDATE user SET nickname = ?, phone = ?, email = ? WHERE id = ?',
    [nickname || '', phone || '', email || '', id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '更新用户失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json({ message: '更新用户成功', id });
  });
});

// 删除用户
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '用户id格式错误' });
  }
  connection.query('DELETE FROM user WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '删除用户失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    res.json({ message: '删除用户成功' });
  });
});

// ========== 视频表接口 ==========
// 获取视频列表（支持分页和分类筛选）
app.get('/videos', (req, res) => {
  const { page = 1, limit = 10, category_id } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  if (category_id && validateId(category_id)) {
    const countSql = 'SELECT COUNT(*) as total FROM video WHERE category_id = ?';
    const listSql = 'SELECT v.*, c.name as category_name FROM video v LEFT JOIN category c ON v.category_id = c.id WHERE v.category_id = ? ORDER BY v.upload_time DESC LIMIT ? OFFSET ?';
    connection.query(countSql, [category_id], (err, countResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const total = countResult[0].total;
      connection.query(listSql, [category_id, limitNum, offset], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ total, page: pageNum, limit: limitNum, list: results });
      });
    });
  } else {
    const countSql = 'SELECT COUNT(*) as total FROM video';
    const listSql = 'SELECT v.*, c.name as category_name FROM video v LEFT JOIN category c ON v.category_id = c.id ORDER BY v.upload_time DESC LIMIT ? OFFSET ?';
    connection.query(countSql, (err, countResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const total = countResult[0].total;
      connection.query(listSql, [limitNum, offset], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ total, page: pageNum, limit: limitNum, list: results });
      });
    });
  }
});

// 获取单个视频
app.get('/videos/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '视频id格式错误' });
  }
  // 增加播放量
  connection.query('UPDATE video SET views = views + 1 WHERE id = ?', [id]);
  connection.query('SELECT v.*, c.name as category_name FROM video v LEFT JOIN category c ON v.category_id = c.id WHERE v.id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: '视频不存在' });
      return;
    }
    res.json(results[0]);
  });
});

// 新增视频
app.post('/videos', (req, res) => {
  const { name, author, url, category_id } = req.body;
  if (!name || name.length > 100) {
    return res.status(400).json({ error: '视频名称不能为空且不超过100字符' });
  }
  if (!url) {
    return res.status(400).json({ error: '视频地址不能为空' });
  }
  connection.query('INSERT INTO video (name, author, url, category_id) VALUES (?, ?, ?, ?)',
    [name, author || '匿名', url, category_id || 0], (err, results) => {
    if (err) {
      res.status(500).json({ error: '添加视频失败' });
      return;
    }
    res.json({ message: '添加视频成功', id: results.insertId, name, author, url });
  });
});

// 更新视频
app.put('/videos/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '视频id格式错误' });
  }
  const { name, author, url, category_id } = req.body;
  if (name && (name.length > 100)) {
    return res.status(400).json({ error: '视频名称不能超过100字符' });
  }
  connection.query('UPDATE video SET name = ?, author = ?, url = ?, category_id = ? WHERE id = ?',
    [name, author, url, category_id, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '更新视频失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '视频不存在' });
      return;
    }
    res.json({ message: '更新视频成功', id });
  });
});

// 删除视频
app.delete('/videos/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '视频id格式错误' });
  }
  connection.query('DELETE FROM video WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '删除视频失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '视频不存在' });
      return;
    }
    res.json({ message: '删除视频成功' });
  });
});

// ========== 轮播图表接口 ==========
// 获取所有轮播图
app.get('/carousels', (req, res) => {
  connection.query('SELECT * FROM carousel ORDER BY sort ASC', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// 获取单个轮播图
app.get('/carousels/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '轮播图id格式错误' });
  }
  connection.query('SELECT * FROM carousel WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: '轮播图不存在' });
      return;
    }
    res.json(results[0]);
  });
});

// 新增轮播图
app.post('/carousels', (req, res) => {
  const { adv, pic, vid, sort } = req.body;
  if (!adv || adv.length > 100) {
    return res.status(400).json({ error: '宣传语不能为空且不超过100字符' });
  }
  connection.query('INSERT INTO carousel (adv, pic, vid, sort) VALUES (?, ?, ?, ?)',
    [adv, pic || '', vid || 0, sort || 0], (err, results) => {
    if (err) {
      res.status(500).json({ error: '添加轮播图失败' });
      return;
    }
    res.json({ message: '添加轮播图成功', id: results.insertId });
  });
});

// 更新轮播图
app.put('/carousels/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '轮播图id格式错误' });
  }
  const { adv, pic, vid, sort } = req.body;
  if (adv && adv.length > 100) {
    return res.status(400).json({ error: '宣传语不能超过100字符' });
  }
  connection.query('UPDATE carousel SET adv = ?, pic = ?, vid = ?, sort = ? WHERE id = ?',
    [adv, pic, vid, sort, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '更新轮播图失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '轮播图不存在' });
      return;
    }
    res.json({ message: '更新轮播图成功', id });
  });
});

// 删除轮播图
app.delete('/carousels/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '轮播图id格式错误' });
  }
  connection.query('DELETE FROM carousel WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '删除轮播图失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '轮播图不存在' });
      return;
    }
    res.json({ message: '删除轮播图成功' });
  });
});

// ========== 视频分类接口 ==========
// 获取所有分类
app.get('/categories', (req, res) => {
  connection.query('SELECT * FROM category ORDER BY sort ASC', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// 获取单个分类
app.get('/categories/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '分类id格式错误' });
  }
  connection.query('SELECT * FROM category WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: '分类不存在' });
      return;
    }
    res.json(results[0]);
  });
});

// 新增分类
app.post('/categories', (req, res) => {
  const { name, icon, sort } = req.body;
  if (!name || name.length > 50) {
    return res.status(400).json({ error: '分类名称不能为空且不超过50字符' });
  }
  connection.query('INSERT INTO category (name, icon, sort) VALUES (?, ?, ?)',
    [name, icon || '', sort || 0], (err, results) => {
    if (err) {
      res.status(500).json({ error: '添加分类失败' });
      return;
    }
    res.json({ message: '添加分类成功', id: results.insertId, name });
  });
});

// 更新分类
app.put('/categories/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '分类id格式错误' });
  }
  const { name, icon, sort } = req.body;
  if (name && name.length > 50) {
    return res.status(400).json({ error: '分类名称不能超过50字符' });
  }
  connection.query('UPDATE category SET name = ?, icon = ?, sort = ? WHERE id = ?',
    [name, icon, sort, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '更新分类失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '分类不存在' });
      return;
    }
    res.json({ message: '更新分类成功', id });
  });
});

// 删除分类
app.delete('/categories/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '分类id格式错误' });
  }
  connection.query('DELETE FROM category WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '删除分类失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '分类不存在' });
      return;
    }
    res.json({ message: '删除分类成功' });
  });
});

// ========== 评论接口 ==========
// 获取视频评论列表
app.get('/comments', (req, res) => {
  const { video_id, page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  if (video_id && validateId(video_id)) {
    const countSql = 'SELECT COUNT(*) as total FROM comment WHERE video_id = ?';
    const listSql = 'SELECT c.*, u.nickname, u.avatar FROM comment c LEFT JOIN user u ON c.user_id = u.id WHERE c.video_id = ? ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    connection.query(countSql, [video_id], (err, countResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const total = countResult[0].total;
      connection.query(listSql, [video_id, limitNum, offset], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ total, page: pageNum, limit: limitNum, list: results });
      });
    });
  } else {
    const countSql = 'SELECT COUNT(*) as total FROM comment';
    const listSql = 'SELECT c.*, u.nickname, u.avatar FROM comment c LEFT JOIN user u ON c.user_id = u.id ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    connection.query(countSql, (err, countResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const total = countResult[0].total;
      connection.query(listSql, [limitNum, offset], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ total, page: pageNum, limit: limitNum, list: results });
      });
    });
  }
});

// 新增评论
app.post('/comments', (req, res) => {
  const { user_id, video_id, content } = req.body;
  if (!validateId(user_id)) {
    return res.status(400).json({ error: '用户id格式错误' });
  }
  if (!validateId(video_id)) {
    return res.status(400).json({ error: '视频id格式错误' });
  }
  if (!content || content.length > 500) {
    return res.status(400).json({ error: '评论内容不能为空且不超过500字符' });
  }
  connection.query('INSERT INTO comment (user_id, video_id, content) VALUES (?, ?, ?)',
    [user_id, video_id, content], (err, results) => {
    if (err) {
      res.status(500).json({ error: '添加评论失败' });
      return;
    }
    res.json({ message: '评论成功', id: results.insertId });
  });
});

// 删除评论
app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '评论id格式错误' });
  }
  connection.query('DELETE FROM comment WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '删除评论失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '评论不存在' });
      return;
    }
    res.json({ message: '删除评论成功' });
  });
});

// ========== 点赞接口 ==========
// 点赞视频
app.post('/likes', (req, res) => {
  const { user_id, video_id } = req.body;
  if (!validateId(user_id)) {
    return res.status(400).json({ error: '用户id格式错误' });
  }
  if (!validateId(video_id)) {
    return res.status(400).json({ error: '视频id格式错误' });
  }
  // 检查是否已点赞
  connection.query('SELECT id FROM like_record WHERE user_id = ? AND video_id = ?',
    [user_id, video_id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length > 0) {
      res.status(400).json({ error: '已点赞过该视频' });
      return;
    }
    // 添加点赞记录并增加视频点赞数
    connection.query('INSERT INTO like_record (user_id, video_id) VALUES (?, ?)',
      [user_id, video_id], (err, result) => {
      if (err) {
        res.status(500).json({ error: '点赞失败' });
        return;
      }
      connection.query('UPDATE video SET likes = likes + 1 WHERE id = ?', [video_id], (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: '点赞成功', id: result.insertId });
      });
    });
  });
});

// 取消点赞
app.delete('/likes/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '点赞记录id格式错误' });
  }
  // 先获取视频id
  connection.query('SELECT video_id FROM like_record WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: '点赞记录不存在' });
      return;
    }
    const videoId = results[0].video_id;
    connection.query('DELETE FROM like_record WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: '取消点赞失败' });
        return;
      }
      connection.query('UPDATE video SET likes = likes - 1 WHERE id = ?', [videoId]);
      res.json({ message: '取消点赞成功' });
    });
  });
});

// ========== 充电订单接口 ==========
// 获取订单列表
app.get('/orders', (req, res) => {
  const { user_id, status } = req.query;
  let sql = 'SELECT o.*, u.nickname FROM order_record o LEFT JOIN user u ON o.user_id = u.id WHERE 1=1';
  const params = [];
  if (user_id && validateId(user_id)) {
    sql += ' AND o.user_id = ?';
    params.push(user_id);
  }
  if (status !== undefined && status !== '') {
    sql += ' AND o.status = ?';
    params.push(status);
  }
  sql += ' ORDER BY o.created_at DESC';
  connection.query(sql, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// 新增订单
app.post('/orders', (req, res) => {
  const { order_no, user_id, amount } = req.body;
  if (!order_no || order_no.length > 50) {
    return res.status(400).json({ error: '订单编号不能为空且不超过50字符' });
  }
  if (!validateId(user_id)) {
    return res.status(400).json({ error: '用户id格式错误' });
  }
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: '订单金额必须大于0' });
  }
  connection.query('INSERT INTO order_record (order_no, user_id, amount) VALUES (?, ?, ?)',
    [order_no, user_id, amountNum], (err, results) => {
    if (err) {
      res.status(500).json({ error: '创建订单失败，订单编号可能已存在' });
      return;
    }
    res.json({ message: '创建订单成功', id: results.insertId, order_no });
  });
});

// 更新订单状态
app.put('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '订单id格式错误' });
  }
  const { status } = req.body;
  if (status !== 0 && status !== 1 && status !== 2) {
    return res.status(400).json({ error: '订单状态只能是0待支付,1已支付,2已取消' });
  }
  connection.query('UPDATE order_record SET status = ? WHERE id = ?',
    [status, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '更新订单状态失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '订单不存在' });
      return;
    }
    res.json({ message: '更新订单状态成功', id, status });
  });
});

// ========== 用户评价接口 ==========
// 获取评价列表
app.get('/reviews', (req, res) => {
  const { user_id, page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  if (user_id && validateId(user_id)) {
    const countSql = 'SELECT COUNT(*) as total FROM review WHERE user_id = ?';
    const listSql = 'SELECT r.*, u.nickname, u.avatar FROM review r LEFT JOIN user u ON r.user_id = u.id WHERE r.user_id = ? ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    connection.query(countSql, [user_id], (err, countResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const total = countResult[0].total;
      connection.query(listSql, [user_id, limitNum, offset], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ total, page: pageNum, limit: limitNum, list: results });
      });
    });
  } else {
    const countSql = 'SELECT COUNT(*) as total FROM review';
    const listSql = 'SELECT r.*, u.nickname, u.avatar FROM review r LEFT JOIN user u ON r.user_id = u.id ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    connection.query(countSql, (err, countResult) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const total = countResult[0].total;
      connection.query(listSql, [limitNum, offset], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ total, page: pageNum, limit: limitNum, list: results });
      });
    });
  }
});

// 新增评价
app.post('/reviews', (req, res) => {
  const { user_id, content, score } = req.body;
  if (!validateId(user_id)) {
    return res.status(400).json({ error: '用户id格式错误' });
  }
  if (!content || content.length > 500) {
    return res.status(400).json({ error: '评价内容不能为空且不超过500字符' });
  }
  const scoreNum = parseInt(score, 10);
  if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 5) {
    return res.status(400).json({ error: '评分必须在1-5之间' });
  }
  connection.query('INSERT INTO review (user_id, content, score) VALUES (?, ?, ?)',
    [user_id, content, scoreNum], (err, results) => {
    if (err) {
      res.status(500).json({ error: '添加评价失败' });
      return;
    }
    res.json({ message: '评价成功', id: results.insertId });
  });
});

// 删除评价
app.delete('/reviews/:id', (req, res) => {
  const { id } = req.params;
  if (!validateId(id)) {
    return res.status(400).json({ error: '评价id格式错误' });
  }
  connection.query('DELETE FROM review WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: '删除评价失败' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: '评价不存在' });
      return;
    }
    res.json({ message: '删除评价成功' });
  });
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
