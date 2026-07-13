# 创建数据库
create database bilibili1112;
show databases;
# 切换数据库
use bilibili1112;

# 创建表
# 1 用户表
drop table if exists `user`;
create table `user` (
    `id` int not null auto_increment comment '用户id',
    `username` varchar(50) not null default '' comment '用户账户',
    `password` varchar(50) not null default '' comment '用户密码',
    `nickname` varchar(50) not null default '' comment '用户昵称',
    `avatar` varchar(200) not null default '' comment '用户头像',
    `phone` varchar(20) not null default '' comment '用户手机号',
    `email` varchar(100) not null default '' comment '用户邮箱',
    `created_at` datetime default current_timestamp comment '创建时间',
    primary key (`id`) using btree
) ENGINE = InnoDB  COMMENT = '用户表' ;

# 2 视频表
drop table if exists `video`;
create table `video` (
    `id` int not null auto_increment comment '视频id',
    `name` varchar(100) not null default '' comment '视频名称',
    `author` varchar(50) not null default '' comment '视频作者',
    `url` varchar(200) not null default '' comment '视频地址',
    `category_id` int not null default 0 comment '分类id',
    `views` int not null default 0 comment '播放量',
    `likes` int not null default 0 comment '点赞数',
    `upload_time` datetime default current_timestamp comment '上传时间',
    primary key (`id`) using btree
) ENGINE = InnoDB  COMMENT = '视频表' ;

# 3 轮播图表
drop table if exists `carousel`;
create table `carousel` (
    `id` int not null auto_increment comment '轮播图id',
    `adv` varchar(100) not null default '' comment '宣传语',
    `pic` varchar(200) not null default '' comment '图片地址',
    `vid` int not null default 0 comment '关联视频id',
    `sort` int not null default 0 comment '排序',
    primary key (`id`) using btree
) ENGINE = InnoDB  COMMENT = '轮播图表' ;

# 4 视频分类表
drop table if exists `category`;
create table `category` (
    `id` int not null auto_increment comment '分类id',
    `name` varchar(50) not null default '' comment '分类名称',
    `icon` varchar(200) not null default '' comment '分类图标',
    `sort` int not null default 0 comment '排序',
    primary key (`id`) using btree
) ENGINE = InnoDB  COMMENT = '视频分类表' ;

# 5 视频评论表
drop table if exists `comment`;
create table `comment` (
    `id` int not null auto_increment comment '评论id',
    `user_id` int not null default 0 comment '评论用户id',
    `video_id` int not null default 0 comment '评论视频id',
    `content` text not null comment '评论内容',
    `reply_count` int not null default 0 comment '回复数',
    `created_at` datetime default current_timestamp comment '评论时间',
    primary key (`id`) using btree
) ENGINE = InnoDB  COMMENT = '视频评论表' ;

# 6 点赞记录表
drop table if exists `like_record`;
create table `like_record` (
    `id` int not null auto_increment comment '点赞记录id',
    `user_id` int not null default 0 comment '点赞用户id',
    `video_id` int not null default 0 comment '点赞视频id',
    `created_at` datetime default current_timestamp comment '点赞时间',
    primary key (`id`) using btree,
    unique key `uk_user_video` (`user_id`, `video_id`)
) ENGINE = InnoDB  COMMENT = '点赞记录表' ;

# 7 充电订单表
drop table if exists `order_record`;
create table `order_record` (
    `id` int not null auto_increment comment '订单id',
    `order_no` varchar(50) not null default '' comment '订单编号',
    `user_id` int not null default 0 comment '下单用户id',
    `amount` decimal(10,2) not null default 0.00 comment '订单金额',
    `status` tinyint not null default 0 comment '订单状态:0待支付,1已支付,2已取消',
    `created_at` datetime default current_timestamp comment '下单时间',
    primary key (`id`) using btree,
    unique key `uk_order_no` (`order_no`)
) ENGINE = InnoDB  COMMENT = '充电订单表' ;

# 8 用户评价表
drop table if exists `review`;
create table `review` (
    `id` int not null auto_increment comment '评价id',
    `user_id` int not null default 0 comment '评价用户id',
    `content` text not null comment '评价内容',
    `score` tinyint not null default 5 comment '评分:1-5',
    `created_at` datetime default current_timestamp comment '评价时间',
    primary key (`id`) using btree
) ENGINE = InnoDB  COMMENT = '用户评价表' ;
