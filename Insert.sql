-- 插入用户表测试数据
INSERT INTO `user` (`username`, `password`, `nickname`, `avatar`, `phone`, `email`) VALUES
('admin', '123456', '管理员', 'https://picsum.photos/80/80?random=1', '13800138001', 'admin@bilibili.com'),
('user1', 'password1', '哔哩哔哩用户1', 'https://picsum.photos/80/80?random=2', '13800138002', 'user1@bilibili.com'),
('user2', 'password2', '哔哩哔哩用户2', 'https://picsum.photos/80/80?random=3', '13800138003', 'user2@bilibili.com'),
('user3', 'password3', '哔哩哔哩用户3', 'https://picsum.photos/80/80?random=4', '13800138004', 'user3@bilibili.com'),
('user4', 'password4', '哔哩哔哩用户4', 'https://picsum.photos/80/80?random=5', '13800138005', 'user4@bilibili.com'),
('user5', 'password5', '哔哩哔哩用户5', 'https://picsum.photos/80/80?random=6', '13800138006', 'user5@bilibili.com'),
('user6', 'password6', '哔哩哔哩用户6', 'https://picsum.photos/80/80?random=7', '13800138007', 'user6@bilibili.com'),
('user7', 'password7', '哔哩哔哩用户7', 'https://picsum.photos/80/80?random=8', '13800138008', 'user7@bilibili.com'),
('user8', 'password8', '哔哩哔哩用户8', 'https://picsum.photos/80/80?random=9', '13800138009', 'user8@bilibili.com'),
('user9', 'password9', '哔哩哔哩用户9', 'https://picsum.photos/80/80?random=10', '13800138010', 'user9@bilibili.com'),
('user10', 'password10', '哔哩哔哩用户10', 'https://picsum.photos/80/80?random=11', '13800138011', 'user10@bilibili.com');

-- 插入视频分类表测试数据
INSERT INTO `category` (`name`, `icon`, `sort`) VALUES
('番剧', 'https://picsum.photos/60/60?random=101', 1),
('国创', 'https://picsum.photos/60/60?random=102', 2),
('音乐', 'https://picsum.photos/60/60?random=103', 3),
('舞蹈', 'https://picsum.photos/60/60?random=104', 4),
('知识', 'https://picsum.photos/60/60?random=105', 5),
('科技', 'https://picsum.photos/60/60?random=106', 6),
('生活', 'https://picsum.photos/60/60?random=107', 7),
('游戏', 'https://picsum.photos/60/60?random=108', 8);

-- 插入视频表测试数据
INSERT INTO `video` (`name`, `author`, `url`, `category_id`, `views`, `likes`, `upload_time`) VALUES
('2026年度总结', '张三', 'video/1.mp4', 7, 125000, 8900, '2026-01-15 10:30:00'),
('前端开发入门教程', '李四', 'video/2.mp4', 6, 234000, 15600, '2026-02-20 14:00:00'),
('React hooks详解', '王五', 'video/3.mp4', 6, 98000, 6700, '2026-03-10 09:15:00'),
('Node.js实战', '赵六', 'video/4.mp4', 6, 156000, 11200, '2026-04-05 16:45:00'),
('MySQL数据库优化', '钱七', 'video/5.mp4', 6, 87000, 5400, '2026-05-12 11:20:00'),
('Vue3新特性', '孙八', 'video/6.mp4', 6, 201000, 13800, '2026-06-18 13:30:00'),
('TypeScript基础', '周九', 'video/7.mp4', 6, 143000, 9800, '2026-07-22 15:10:00'),
('前端性能优化', '吴十', 'video/8.mp4', 6, 76000, 4200, '2026-08-30 10:00:00'),
('RESTful API设计', '郑一', 'video/9.mp4', 6, 112000, 7600, '2026-09-14 14:30:00'),
('微服务架构', '王二', 'video/10.mp4', 6, 65000, 3500, '2026-10-08 12:00:00'),
('新番推荐第一期', '动漫 UP主', 'video/1.mp4', 1, 340000, 22000, '2026-04-01 18:00:00'),
('热门音乐盘点', '音乐 UP主', 'video/2.mp4', 3, 450000, 31000, '2026-05-20 20:00:00');

-- 插入轮播图表测试数据
INSERT INTO `carousel` (`adv`, `pic`, `vid`, `sort`) VALUES
('2026年度总结，回顾一年的收获与成长', 'image/1.jpg', 1, 1),
('前端开发入门教程，零基础也能学', 'image/2.jpg', 2, 2),
('React hooks详解，让你的代码更简洁', 'image/3.jpg', 3, 3),
('Node.js实战，从入门到精通', 'image/4.jpg', 4, 4),
('MySQL数据库优化，提升系统性能', 'image/5.jpg', 5, 5);

-- 插入视频评论表测试数据
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `reply_count`) VALUES
(2, 1, '非常精彩的总结，学到了很多新东西！', 5),
(3, 1, 'UP主加油，期待下一期内容', 3),
(4, 2, '教程讲得很清楚，适合初学者', 8),
(5, 3, 'React hooks确实是必备技能', 2),
(6, 4, 'Node.js实战项目很实用', 4),
(7, 5, '数据库优化的技巧很干货', 1),
(8, 6, 'Vue3 Composition API太好用了', 6),
(9, 7, 'TypeScript从入门到精通', 3),
(10, 1, '年度总结非常有意义', 7),
(2, 11, '番剧推荐都很不错，已经追起来了', 12);

-- 插入点赞记录表测试数据
INSERT INTO `like_record` (`user_id`, `video_id`) VALUES
(2, 1), (3, 1), (4, 1), (5, 2), (6, 2),
(7, 3), (8, 3), (9, 4), (10, 4), (2, 5),
(3, 6), (4, 6), (5, 7), (6, 7), (7, 8),
(8, 9), (9, 10), (10, 11), (2, 12), (3, 12);

-- 插入充电订单表测试数据
INSERT INTO `order_record` (`order_no`, `user_id`, `amount`, `status`) VALUES
('BL20260101001', 2, 19.00, 1),
('BL20260101002', 3, 39.00, 1),
('BL20260101003', 4, 99.00, 0),
('BL20260101004', 5, 29.00, 2),
('BL20260101005', 6, 59.00, 1),
('BL20260101006', 7, 19.00, 1),
('BL20260101007', 8, 39.00, 0),
('BL20260101008', 9, 199.00, 1),
('BL20260101009', 10, 29.00, 2),
('BL20260101010', 2, 99.00, 1);

-- 插入用户评价表测试数据
INSERT INTO `review` (`user_id`, `content`, `score`) VALUES
(2, 'B站内容质量越来越高，强烈推荐！', 5),
(3, '界面越来越好用，功能也很完善', 4),
(4, '弹幕文化很有趣，互动性很强', 5),
(5, '视频分类很清晰，找视频很方便', 4),
(6, '充电功能很实用，支持喜欢的UP主', 5),
(7, '整体体验很好，会继续使用', 4),
(8, '社区氛围很友好，大家很有素质', 5),
(9, '功能越来越多，希望继续保持', 4),
(10, '手机端体验很棒，随时随地看视频', 5),
(2, 'B站是我学习编程的重要平台', 5);
