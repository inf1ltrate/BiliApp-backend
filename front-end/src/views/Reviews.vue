<template>
  <div class="page">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>用户评价</h2>
    </div>
    <div class="review-form">
      <textarea v-model="newReview" placeholder="分享你的使用体验..." rows="3"></textarea>
      <div class="rating">
        <span v-for="i in 5" :key="i" :class="['star', i <= score ? 'active' : '']" @click="score = i">★</span>
      </div>
      <button class="submit-btn" @click="submit">提交</button>
    </div>
    <div class="review-list">
      <div class="review-item" v-for="r in reviews" :key="r.id">
        <div class="r-header">
          <img :src="r.avatar || 'https://picsum.photos/40/40?random=' + r.user_id" class="r-avatar" />
          <span class="r-nick">{{ r.nickname || '用户' }}</span>
          <div class="r-stars"><span v-for="i in 5" :key="i" :class="i <= r.score ? 'active' : ''">★</span></div>
        </div>
        <p class="r-content">{{ r.content }}</p>
        <span class="r-time">{{ format(r.created_at) }}</span>
      </div>
      <div class="empty" v-if="reviews.length === 0">暂无评价</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Reviews',
  data() { return { reviews: [], newReview: '', score: 5 } },
  mounted() { this.fetch(); },
  methods: {
    async fetch() { try { const r = await fetch('http://localhost:8080/reviews'); const d = await r.json(); this.reviews = d.list || d; } catch (e) {} },
    async submit() {
      if (!this.newReview.trim()) return;
      try {
        await fetch('http://localhost:8080/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: 1, content: this.newReview, score: this.score }) });
        this.newReview = ''; this.fetch();
      } catch (e) {}
    },
    format(t) { return t ? new Date(t).toLocaleString('zh-CN') : ''; }
  }
}
</script>
<style scoped>
.page { background: #f4f4f4; }
.page-header { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: white; }
.back-btn { background: none; border: none; font-size: 16px; cursor: pointer; color: #333; }
.page-header h2 { font-size: 16px; }
.review-form { background: white; margin: 12px; padding: 12px; border-radius: 10px; }
.review-form textarea { width: 100%; padding: 10px; border: 1px solid #eee; border-radius: 8px; font-size: 14px; resize: none; }
.rating { display: flex; gap: 4px; margin: 10px 0; font-size: 20px; color: #ddd; cursor: pointer; }
.rating .star.active { color: #ff6699; }
.submit-btn { padding: 10px 24px; background: #ff6699; color: white; border: none; border-radius: 20px; float: right; }
.review-list { margin: 12px; }
.review-item { background: white; padding: 12px; border-radius: 10px; margin-bottom: 8px; }
.r-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.r-avatar { width: 32px; height: 32px; border-radius: 50%; }
.r-nick { font-size: 13px; font-weight: 500; }
.r-stars { display: flex; gap: 1px; font-size: 12px; color: #ddd; margin-left: auto; }
.r-stars span.active { color: #ff6699; }
.r-content { font-size: 14px; line-height: 1.6; margin-bottom: 6px; }
.r-time { font-size: 11px; color: #999; }
.empty { text-align: center; padding: 40px; color: #999; }
</style>