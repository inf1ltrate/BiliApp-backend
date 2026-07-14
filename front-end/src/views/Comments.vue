<template>
  <div class="page">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>评论</h2>
    </div>
    <div class="comment-form">
      <textarea v-model="newComment" placeholder="写下你的评论..." rows="3"></textarea>
      <button class="submit-btn" @click="submitComment">发布</button>
    </div>
    <div class="comment-list">
      <div class="comment-item" v-for="c in comments" :key="c.id">
        <div class="c-header">
          <img :src="c.avatar || 'https://picsum.photos/40/40?random=' + c.user_id" class="c-avatar" />
          <div class="c-info">
            <span class="c-nick">{{ c.nickname || '用户' }}</span>
            <span class="c-time">{{ formatTime(c.created_at) }}</span>
          </div>
        </div>
        <p class="c-content">{{ c.content }}</p>
        <span class="c-replies">{{ c.reply_count }} 回复</span>
      </div>
      <div class="empty" v-if="comments.length === 0">暂无评论</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Comments',
  data() { return { comments: [], newComment: '' } },
  mounted() { this.fetchComments(); },
  methods: {
    async fetchComments() {
      try { const r = await fetch('http://localhost:8080/comments'); const d = await r.json(); this.comments = d.list || d; } catch (e) {}
    },
    async submitComment() {
      if (!this.newComment.trim()) return;
      try {
        await fetch('http://localhost:8080/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: 1, video_id: 1, content: this.newComment }) });
        this.newComment = ''; this.fetchComments();
      } catch (e) {}
    },
    formatTime(t) { return t ? new Date(t).toLocaleString('zh-CN') : ''; }
  }
}
</script>
<style scoped>
.page { background: #f4f4f4; }
.page-header { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: white; }
.back-btn { background: none; border: none; font-size: 16px; cursor: pointer; color: #333; }
.page-header h2 { font-size: 16px; }
.comment-form { background: white; margin: 12px; padding: 12px; border-radius: 10px; }
.comment-form textarea { width: 100%; padding: 10px; border: 1px solid #eee; border-radius: 8px; font-size: 14px; resize: none; }
.submit-btn { margin-top: 10px; padding: 10px 30px; background: #ff6699; color: white; border: none; border-radius: 20px; float: right; }
.comment-list { margin: 12px; }
.comment-item { background: white; padding: 12px; border-radius: 10px; margin-bottom: 8px; }
.c-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.c-avatar { width: 32px; height: 32px; border-radius: 50%; }
.c-info { flex: 1; }
.c-nick { display: block; font-size: 13px; font-weight: 500; }
.c-time { display: block; font-size: 11px; color: #999; }
.c-content { font-size: 14px; line-height: 1.6; margin-bottom: 8px; }
.c-replies { font-size: 12px; color: #999; }
.empty { text-align: center; padding: 40px; color: #999; }
</style>