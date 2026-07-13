<template>
  <div class="reviews">
    <div class="page-header">
      <button class="back-btn" @click="$router.back()">← 返回</button>
      <h2>用户评价</h2>
    </div>
    <div class="review-form" v-if="isLoggedIn">
      <textarea v-model="newReview" placeholder="分享你的使用体验..." rows="3"></textarea>
      <div class="rating">
        <span v-for="i in 5" :key="i" :class="['star', i <= selectedRating ? 'active' : '']" @click="selectedRating = i">★</span>
      </div>
      <button class="submit-btn" @click="submitReview">提交评价</button>
    </div>
    <div class="review-list">
      <div class="review-item" v-for="review in reviews" :key="review.id">
        <div class="review-header">
          <img :src="review.avatar || 'https://picsum.photos/40/40?random=' + review.user_id" class="avatar" />
          <span class="nickname">{{ review.nickname || '用户' + review.user_id }}</span>
          <div class="rating-stars">
            <span v-for="i in 5" :key="i" :class="i <= review.score ? 'active' : ''">★</span>
          </div>
        </div>
        <div class="review-content">{{ review.content }}</div>
        <div class="review-time">{{ formatTime(review.created_at) }}</div>
      </div>
      <div class="empty" v-if="reviews.length === 0">暂无评价</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reviews',
  data() {
    return { reviews: [], newReview: '', selectedRating: 5, isLoggedIn: true }
  },
  mounted() { this.fetchReviews(); },
  methods: {
    async fetchReviews() {
      try {
        const res = await fetch('http://localhost:8080/reviews');
        const data = await res.json();
        this.reviews = data.list || data;
      } catch (e) { console.error('获取评价失败:', e); }
    },
    async submitReview() {
      if (!this.newReview.trim()) return;
      try {
        await fetch('http://localhost:8080/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 1, content: this.newReview, score: this.selectedRating })
        });
        this.newReview = '';
        this.fetchReviews();
      } catch (e) { console.error('提交评价失败:', e); }
    },
    formatTime(t) { return t ? new Date(t).toLocaleString('zh-CN') : ''; }
  }
}
</script>

<style scoped>
.reviews { padding: 20px; max-width: 800px; margin: 0 auto; }
.page-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.back-btn { padding: 8px 16px; background: none; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; }
.review-form { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.review-form textarea { width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; resize: vertical; }
.rating { display: flex; gap: 5px; margin: 10px 0; font-size: 24px; color: #ddd; cursor: pointer; }
.rating .star.active { color: #ff6699; }
.submit-btn { padding: 10px 24px; background: #ff6699; color: white; border: none; border-radius: 4px; cursor: pointer; }
.review-list { margin-top: 20px; }
.review-item { padding: 15px; border-bottom: 1px solid #f0f0f0; }
.review-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.avatar { width: 40px; height: 40px; border-radius: 50%; }
.nickname { font-weight: 500; }
.rating-stars { display: flex; gap: 2px; font-size: 14px; color: #ff6699; margin-left: auto; }
.review-content { line-height: 1.6; margin-bottom: 8px; }
.review-time { font-size: 12px; color: #999; }
.empty { text-align: center; padding: 40px; color: #999; }
</style>