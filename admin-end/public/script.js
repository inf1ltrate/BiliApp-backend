// 公共函数

// 显示加载状态
function showLoading(element) {
  element.innerHTML = '<div class="loading">加载中...</div>';
}

// 显示错误信息
function showError(element, message) {
  element.innerHTML = `<div class="error">${message}</div>`;
}

// 显示成功信息
function showSuccess(element, message) {
  element.innerHTML = `<div class="success">${message}</div>`;
}

// 发送API请求
async function fetchApi(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error('API请求失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// 初始化导航菜单
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath.includes(linkPath)) {
      link.classList.add('active');
    }
  });
}

// 初始化模态框
function initModal() {
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      modal.style.display = 'none';
    });
  });
  
  window.addEventListener('click', (event) => {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModal();
  });
} else {
  initNavigation();
  initModal();
}

// 导出公共函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showLoading,
    showError,
    showSuccess,
    fetchApi,
    initNavigation,
    initModal
  };
}