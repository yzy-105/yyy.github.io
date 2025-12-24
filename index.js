// 全局变量
        let currentUser = null; // 当前登录用户
        let cart = []; // 购物车数据
        let carouselIndex = 0; // 轮播图当前索引
        let carouselTimer = null; // 轮播图定时器

        // DOM元素
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const loginModal = document.getElementById('loginModal');
        const closeLogin = document.getElementById('closeLogin');
        const submitLogin = document.getElementById('submitLogin');
        const userName = document.getElementById('userName');
        const cartItemsEl = document.getElementById('cartItems');
        const cartTotalEl = document.getElementById('cartTotal');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const addCartBtns = document.querySelectorAll('.add-cart-btn');
        const checkoutModal = document.getElementById('checkoutModal');
        const closeCheckout = document.getElementById('closeCheckout');
        const submitOrder = document.getElementById('submitOrder');
        const checkoutSummary = document.getElementById('checkoutSummary');
        const toast = document.getElementById('toast');
        // 首页/商城切换元素
        const homePage = document.getElementById('homePage');
        const shopPage = document.getElementById('shopPage');
        const homeNav = document.getElementById('homeNav');
        const shopNav = document.getElementById('shopNav');
        const logo = document.getElementById('logo');
        // 轮播图元素
        const carousel = document.getElementById('carousel');
        const carouselItems = document.querySelectorAll('.carousel-item');
        const carouselDots = document.querySelectorAll('.carousel-dot');

        // 模拟用户数据（实际项目中从后端获取）
        const mockUsers = [
            { username: '叶镇瑜', password: '123456', name: '叶镇瑜' },
            { username: 'user2', password: '654321', name: '李四' }
        ];

        // 初始化
        function init() {
            // 检查本地存储的登录状态
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateUserUI();
                // 加载该用户的购物车
                loadCart();
            }
            
            // 绑定事件
            bindEvents();

            // 初始化轮播图
            initCarousel();
        }

        // 绑定所有事件
        function bindEvents() {
            // 登录按钮
            loginBtn.addEventListener('click', () => {
                loginModal.classList.add('active');
            });

            // 关闭登录弹窗
            closeLogin.addEventListener('click', () => {
                loginModal.classList.remove('active');
                clearLoginForm();
            });

            // 提交登录
            submitLogin.addEventListener('click', handleLogin);

            // 退出登录
            logoutBtn.addEventListener('click', handleLogout);

            // 加入购物车
            addCartBtns.forEach(btn => {
                btn.addEventListener('click', addToCart);
            });

            // 清空购物车
            clearCartBtn.addEventListener('click', clearCart);

            // 去结算
            checkoutBtn.addEventListener('click', showCheckoutModal);

            // 关闭结算弹窗
            closeCheckout.addEventListener('click', () => {
                checkoutModal.classList.remove('active');
            });

            // 提交订单
            submitOrder.addEventListener('click', submitOrderHandler);

            // 点击弹窗外部关闭
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) loginModal.classList.remove('active');
            });
            checkoutModal.addEventListener('click', (e) => {
                if (e.target === checkoutModal) checkoutModal.classList.remove('active');
            });

            // 首页/商城切换
            homeNav.addEventListener('click', () => {
                switchPage('home');
            });
            shopNav.addEventListener('click', () => {
                switchPage('shop');
            });
            logo.addEventListener('click', () => {
                switchPage('home');
            });

            // 轮播图圆点点击
            carouselDots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    changeCarousel(index);
                });
            });
        }

        // 切换页面（首页/商城）
        function switchPage(type) {
            if (type === 'home') {
                homePage.style.display = 'block';
                shopPage.style.display = 'none';
                homeNav.classList.add('active');
                shopNav.classList.remove('active');
            } else if (type === 'shop') {
                homePage.style.display = 'none';
                shopPage.style.display = 'block';
                homeNav.classList.remove('active');
                shopNav.classList.add('active');
            }
        }

        // 切换到商品商城（分类点击调用）
        function switchToShop() {
            switchPage('shop');
        }

        // 初始化轮播图
        function initCarousel() {
            // 自动轮播
            carouselTimer = setInterval(() => {
                carouselIndex = (carouselIndex + 1) % carouselItems.length;
                changeCarousel(carouselIndex);
            }, 3000);

            // 鼠标悬停暂停轮播
            carousel.addEventListener('mouseenter', () => {
                clearInterval(carouselTimer);
            });

            // 鼠标离开恢复轮播
            carousel.addEventListener('mouseleave', () => {
                carouselTimer = setInterval(() => {
                    carouselIndex = (carouselIndex + 1) % carouselItems.length;
                    changeCarousel(carouselIndex);
                }, 3000);
            });
        }

        // 切换轮播图
        function changeCarousel(index) {
            // 移除所有active
            carouselItems.forEach(item => item.classList.remove('active'));
            carouselDots.forEach(dot => dot.classList.remove('active'));
            // 添加当前active
            carouselItems[index].classList.add('active');
            carouselDots[index].classList.add('active');
            // 更新索引
            carouselIndex = index;
        }

        // 处理登录
        function handleLogin() {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                showToast('请输入用户名和密码！');
                return;
            }

            // 验证用户
            const user = mockUsers.find(u => u.username === username && u.password === password);
            if (!user) {
                showToast('用户名或密码错误！');
                return;
            }

            // 登录成功
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            loginModal.classList.remove('active');
            clearLoginForm();
            updateUserUI();
            loadCart(); // 加载购物车
            showToast(`欢迎回来，${user.name}！`);
        }

        // 处理退出登录
        function handleLogout() {
            if (confirm('确定要退出登录吗？')) {
                currentUser = null;
                localStorage.removeItem('currentUser');
                if (userName.dataset.user) {
                    localStorage.removeItem(`cart_${userName.dataset.user}`); // 清除购物车
                }
                updateUserUI();
                cart = [];
                updateCartUI();
                showToast('已退出登录！');
            }
        }

        // 更新用户相关UI
        function updateUserUI() {
            if (currentUser) {
                // 已登录
                userName.textContent = currentUser.name;
                userName.dataset.user = currentUser.username;
                loginBtn.style.display = 'none';
                logoutBtn.style.display = 'inline-block';
                checkoutBtn.style.display = 'inline-block';
                // 启用购物车相关按钮
                addCartBtns.forEach(btn => btn.disabled = false);
                clearCartBtn.disabled = cart.length === 0;
            } else {
                // 未登录
                userName.textContent = '未登录';
                userName.removeAttribute('data-user');
                loginBtn.style.display = 'inline-block';
                logoutBtn.style.display = 'none';
                checkoutBtn.style.display = 'none';
                // 禁用购物车相关按钮
                addCartBtns.forEach(btn => btn.disabled = true);
                clearCartBtn.disabled = true;
            }
        }

        // 加载购物车（从本地存储）
        function loadCart() {
            if (!currentUser) return;
            const savedCart = localStorage.getItem(`cart_${currentUser.username}`);
            cart = savedCart ? JSON.parse(savedCart) : [];
            updateCartUI();
        }

        // 保存购物车（到本地存储）
        function saveCart() {
            if (!currentUser) return;
            localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
        }

        // 加入购物车
        function addToCart(e) {
            if (!currentUser) {
                showToast('请先登录！');
                return;
            }

            const btn = e.target;
            const productId = btn.dataset.id;
            const productName = btn.dataset.name;
            const productPrice = parseFloat(btn.dataset.price);

            // 检查商品是否已在购物车中
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                // 已存在则数量+1
                existingItem.quantity += 1;
            } else {
                // 不存在则添加新商品
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }

            // 保存并更新UI
            saveCart();
            updateCartUI();
            showToast(`${productName} 已加入购物车！`);
        }

        // 更新购物车UI
        function updateCartUI() {
            // 清空购物车列表
            cartItemsEl.innerHTML = '';
            
            // 计算总金额
            let total = 0;

            if (cart.length === 0) {
                // 购物车为空
                cartItemsEl.innerHTML = '<li class="empty-cart">购物车为空</li>';
                clearCartBtn.disabled = true;
                checkoutBtn.disabled = true;
            } else {
                // 遍历购物车商品生成列表
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;

                    const li = document.createElement('li');
                    li.className = 'cart-item';
                    li.innerHTML = `
                        <div>
                            <span>${item.name}</span>
                            <span> × ${item.quantity}</span>
                            <span> ¥${itemTotal.toFixed(2)}</span>
                        </div>
                        <button class="remove-item-btn" data-id="${item.id}">删除</button>
                    `;
                    cartItemsEl.appendChild(li);

                    // 绑定删除按钮事件
                    li.querySelector('.remove-item-btn').addEventListener('click', () => removeCartItem(item.id));
                });
                clearCartBtn.disabled = false;
                checkoutBtn.disabled = false;
            }

            // 更新总计金额
            cartTotalEl.textContent = `总计：¥${total.toFixed(2)}`;
        }

        // 删除购物车商品
        function removeCartItem(productId) {
            // 过滤掉要删除的商品
            cart = cart.filter(item => item.id !== productId);
            // 保存并更新UI
            saveCart();
            updateCartUI();
            showToast('商品已从购物车移除！');
        }

        // 清空购物车
        function clearCart() {
            if (cart.length === 0) {
                showToast('购物车已为空！');
                return;
            }
            if (confirm('确定要清空购物车吗？')) {
                cart = [];
                saveCart();
                updateCartUI();
                showToast('购物车已清空！');
            }
        }

        // 显示结算弹窗
        function showCheckoutModal() {
            if (cart.length === 0) {
                showToast('购物车为空，无法结算！');
                return;
            }

            // 生成结算摘要
            let summaryHtml = '';
            let total = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                summaryHtml += `
                    <div class="summary-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>¥${itemTotal.toFixed(2)}</span>
                    </div>
                `;
            });

            summaryHtml += `
                <div class="summary-item summary-total">
                    <span>订单总计</span>
                    <span>¥${total.toFixed(2)}</span>
                </div>
            `;

            checkoutSummary.innerHTML = summaryHtml;
            checkoutModal.classList.add('active');
        }

        // 提交订单
        function submitOrderHandler() {
            const receiveName = document.getElementById('receiveName').value.trim();
            const receiveAddress = document.getElementById('receiveAddress').value.trim();

            if (!receiveName || !receiveAddress) {
                showToast('请填写收货人姓名和地址！');
                return;
            }

            // 模拟提交订单（实际项目中调用后端接口）
            const orderId = 'ORD' + Date.now(); // 生成随机订单号
            showToast(`订单提交成功！订单号：${orderId}`);
            
            // 清空购物车
            cart = [];
            saveCart();
            updateCartUI();
            
            // 关闭结算弹窗
            checkoutModal.classList.remove('active');
            // 清空表单
            document.getElementById('receiveName').value = '';
            document.getElementById('receiveAddress').value = '';
        }

        // 显示提示消息
        function showToast(message) {
            toast.textContent = message;
            toast.classList.add('active');
            setTimeout(() => {
                toast.classList.remove('active');
            }, 3000);
        }

        // 清空登录表单
        function clearLoginForm() {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }

        // 初始化执行
        init();