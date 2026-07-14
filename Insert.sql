-- 插入用户表测试数据
INSERT INTO `user` (`username`, `password`, `nickname`, `avatar`, `phone`, `email`) VALUES
('admin', '123456', '哔哩哔哩管理员', 'https://picsum.photos/80/80?random=1', '13800138001', 'admin@bilibili.com'),
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

-- 插入视频表测试数据 (本地视频文件)
INSERT INTO `video` (`name`, `author`, `url`, `thumb`, `category_id`, `views`, `likes`, `upload_time`) VALUES
('大耳朵兔子大冒险', '动画UP主', 'http://localhost:8080/video/1.mp4', 'https://picsum.photos/400/225?random=1', 1, 125000, 8900, '2026-01-15 10:30:00'),
('大象之梦动画短片', 'Blender工作室', 'http://localhost:8080/video/2.mp4', 'https://picsum.photos/400/225?random=2', 1, 234000, 15600, '2026-02-20 14:00:00'),
('辛特尔动画 - 少女与龙', '奇幻动画', 'http://localhost:8080/video/3.mp4', 'https://picsum.photos/400/225?random=3', 2, 98000, 6700, '2026-03-10 09:15:00'),
('科技实验：火焰的艺术', '科学探索', 'http://localhost:8080/video/4.mp4', 'https://picsum.photos/400/225?random=4', 6, 156000, 11200, '2026-04-05 16:45:00'),
('极限逃脱大挑战', '冒险频道', 'http://localhost:8080/video/5.mp4', 'https://picsum.photos/400/225?random=5', 7, 87000, 5400, '2026-05-12 11:20:00'),
('趣味科技短片合集', '科技UP主', 'http://localhost:8080/video/6.mp4', 'https://picsum.photos/400/225?random=6', 3, 201000, 13800, '2026-06-18 13:30:00'),
('自驾风景大片', '旅行频道', 'http://localhost:8080/video/7.mp4', 'https://picsum.photos/400/225?random=7', 7, 143000, 9800, '2026-07-22 15:10:00'),
('汽车测评：越野之旅', '汽车频道', 'http://localhost:8080/video/8.mp4', 'https://picsum.photos/400/225?random=8', 6, 76000, 4200, '2026-08-30 10:00:00'),
('钢铁之泪科幻短片', '科幻动画', 'http://localhost:8080/video/9.mp4', 'https://picsum.photos/400/225?random=9', 2, 112000, 7600, '2026-09-14 14:30:00'),
('汽车评测大合集', '汽车UP主', 'http://localhost:8080/video/10.mp4', 'https://picsum.photos/400/225?random=10', 8, 65000, 3500, '2026-10-08 12:00:00');

-- 插入轮播图表测试数据
INSERT INTO `carousel` (`adv`, `pic`, `vid`, `sort`) VALUES
('🔥 2026年度最佳动画，不容错过', 'https://picsum.photos/800/400?random=100', 1, 1),
('🎬 开源动画大片 Elephant Dream', 'https://picsum.photos/800/400?random=101', 2, 2),
('⚡ 超燃科技实验短片合集', 'https://picsum.photos/800/400?random=102', 4, 3),
('🎵 趣味音乐视频推荐', 'https://picsum.photos/800/400?random=103', 6, 4);

-- 插入视频评论表测试数据
INSERT INTO `comment` (`user_id`, `video_id`, `content`, `reply_count`) VALUES
(2, 1, '非常精彩的动画，制作太用心了！', 5),
(3, 1, 'UP主加油，期待下一期内容', 3),
(4, 2, '这个短片的视效太震撼了', 8),
(5, 3, 'Sintel的剧情真的很感人', 2),
(6, 4, '科技实验类视频很涨知识', 4),
(7, 5, '节奏紧凑，看得停不下来', 1),
(8, 6, '音乐和画面配合得恰到好处', 6),
(9, 7, '自驾游的视频太治愈了', 3),
(10, 1, '每年必看的经典动画', 7),
(2, 2, '开源动画的代表作，支持！', 12);

-- 插入点赞记录表测试数据
INSERT INTO `like_record` (`user_id`, `video_id`) VALUES
(2, 1), (3, 1), (4, 1), (5, 2), (6, 2),
(7, 3), (8, 3), (9, 4), (10, 4), (2, 5),
(3, 6), (4, 6), (5, 7), (6, 7), (7, 8),
(8, 9), (9, 10), (10, 2), (2, 6), (3, 4);

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
