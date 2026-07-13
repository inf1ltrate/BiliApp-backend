<template>
  <div class="comments">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>评论列表</h2>
    </div>

    <div class="comment-form" v-if="isLoggedIn">
      <textarea v-model="newComment" placeholder="写下你的评论..." rows="3"></textarea>
      <button class="submit-btn" @click="submitComment">发表评论</button>
    </div>

    <div class="comment-list">
      <div class="comment-item" v-for="comment in comments" :key="comment.id">
        <div class="comment-user">
          <img :src="comment.avatar || 'https://picsum.photos/40/40?random=' + comment.user_id" class="user-avatar" />
          <span class="nickname">{{ comment.nickname || '用户' + comment.user_id }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <div class="comment-meta">
          <span class="time">{{ formatTime(comment.created_at) }}</span>
          <span class="replies">{{ comment.reply_count }} 回复</span>
        </div>
      </div>
      <div class="empty" v-if="comments.length === 0">暂无评论</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comments',
  data() {
    return {
      comments: [],
      newComment: '',
      isLoggedIn: false
    }
  },
  mounted() {
    this.fetchComments();
  },
  methods: {
    async fetchComments() {
      try {
        const response = await fetch('http://localhost:8080/comments');
        const data = await response.json();
        this.comments = data.list || data;
      } catch (error) {
        console.error('获取评论失败:', error);
      }
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      try {
        await fetch('http://localhost:8080/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 1, video_id: 1, content: this.newComment })
        });
        this.newComment = '';
        this.fetchComments();
      } catch (error) {
        console.error('发表评论失败:', error);
      }
    },
    formatTime(time) {
      if (!time) return '';
      return new Date(time).toLocaleString('zh-CN');
    }
  }
}
</script>

<style scoped>
.comments { padding: 20px; max-width: 800px; margin: 0 auto; }
.page-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.back-btn { padding: 8px 16px; background: none; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.comment-form { margin-bottom: 20px; }
.comment-form textarea { width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; resize: vertical; }
.submit-btn { margin-top: 10px; padding: 10px 20px; background: #ff6699; color: white; border: none; border-radius: 4px; cursor: pointer; }
.comment-list { margin-top: 20px; }
.comment-item { padding: 15px; border-bottom: 1px solid #f0f0f0; }
.comment-user { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.user-avatar { width: 40px; height: 40px; border-radius: 50%; }
.nickname { font-weight: 500; }
.comment-content { margin-bottom: 8px; line-height: 1.6; }
.comment-meta { display: flex; gap: 15px; color: #999; font-size: 12px; }
.empty { text-align: center; padding: 40px; color: #999; }
</style>