/**
 * 懸浮方向盤 JavaScript 插件
 * 支援滑鼠與觸控拖曳旋轉、自動回正、自訂回調函數
 */
class FloatingSteeringWheel {
    constructor(options = {}) {
        // 預設參數設定
        this.options = {
            emoji: options.emoji || '🛞',          // 預設使用輪胎/方向盤 Emoji
            size: options.size || 120,             // 方向盤容器大小 (px)
            emojiSize: options.emojiSize || 85,    // Emoji 字體大小 (px)
            bottom: options.bottom || '20px',      // 距離底部距離
            right: options.right || '20px',        // 距離右側距離
            autoReturn: options.autoReturn !== false, // 是否放開後自動回正
            onRotate: options.onRotate || null,     // 旋轉時的 Callback 回調函數
            elid:options.elid || '1:steering-wheel',
            display:options.display || 'flex'
        };

        this.isDragging = false;
        this.startAngle = 0;
        this.currentRotation = 0;

        this.init();
    }

    init() {
        this.createElements();
        this.bindEvents();
    }

    createElements() {
        // 1. 建立最外層懸浮容器
        this.container = document.createElement('div');
        this.container.id=this.options.elid
        //this.container.classList.add('hide');
        Object.assign(this.container.style, {
            position: 'fixed',
            bottom: this.options.bottom,
            right: this.options.right,
            width: `${this.options.size}px`,
            height: `${this.options.size}px`,
            //backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: this.options.display,
            justifyContent: 'center', // 標準 JavaScript 寫法
            alignItems: 'center',     // 標準 JavaScript 寫法 (修正原本的 align-items 錯誤)
            cursor: 'grab',
            zIndex: '999999', // 確保在最頂層
            userSelect: 'none',
            webkitUserSelect: 'none',
            touchAction: 'none' // 防止手機瀏覽器預設手勢干擾
        });

        // 2. 建立內層方向盤本體 (Emoji)
        this.wheel = document.createElement('span');
        this.wheel.innerText = this.options.emoji;
        Object.assign(this.wheel.style, {
            fontSize: `${this.options.emojiSize}px`,
            lineHeight: '1',
            display: 'inline-block',
            
            textAlign: 'center',
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
            willChange: 'transform'
        });

        // 組裝並渲染到網頁的 body
        this.container.appendChild(this.wheel);
        document.body.appendChild(this.container);
    }

    getCenter() {
        const rect = this.container.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    getAngle(clientX, clientY) {
        const center = this.getCenter();
        const x = clientX - center.x;
        const y = clientY - center.y;
        
        return Math.atan2(y, x) * (180 / Math.PI);
       
    }

    startDrag(e) {
        this.isDragging = true;
        this.container.style.cursor = 'grabbing';
        this.wheel.style.transition = 'none'; // 拖曳時關閉過渡動畫

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        this.startAngle = this.getAngle(clientX, clientY) - this.currentRotation;
    }

    onDrag(e) {
        if (!this.isDragging) return;
        if (e.cancelable) e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        //window.__steeringwheel_MENU__=e

        this.currentRotation = this.getAngle(clientX, clientY) - this.startAngle;

        this.wheel.style.transform = `rotate(${this.currentRotation}deg)`;

        // 如果有設定回調函數，將當前角度傳出去 (四捨五入整數)
        if (typeof this.options.onRotate === 'function') {
            this.options.onRotate(Math.round(this.currentRotation));
        }
    }

    stopDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.container.style.cursor = 'grab';

        if (this.options.autoReturn) {
            // 啟用彈性回正動畫
            this.wheel.style.transition = 'transform 0.6s cubic-bezier(0.25, 1.1, 0.4, 1.1)';
            this.currentRotation = 0;
            this.wheel.style.transform = `rotate(0deg)`;
            
            if (typeof this.options.onRotate === 'function') {
                this.options.onRotate(0);
            }
        }
    }

    bindEvents() {
        // 電腦滑鼠事件
        this.container.addEventListener('mousedown', (e) => this.startDrag(e));
        window.addEventListener('mousemove', (e) => this.onDrag(e));
        window.addEventListener('mouseup', () => this.stopDrag());

        // 手機觸控事件
        this.container.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        window.addEventListener('touchend', () => this.stopDrag());
    }
}
