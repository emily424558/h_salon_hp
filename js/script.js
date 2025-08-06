/**
 * 大泉学園介護サロン - JavaScriptメインファイル
 * NeoFlowアニメーションシステム
 * 
 * 機能構成:
 * 1. アニメーション管理
 * 2. UI相互作用
 * 3. フォーム機能
 * 4. ユーティリティ
 * 5. 初期化処理
 */

/* ========================================
   1. アニメーション管理
   ======================================== */

/**
 * アニメーションコントローラークラス
 * すべてのアニメーション機能を統合管理
 */
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };
        this.observer = null;
    }

    /**
     * アニメーション要素の初期化
     * CSSによる初期状態のみを信頼し、JavaScriptでの直接操作を避ける
     */
    initializeElements() {
        const animatedElements = document.querySelectorAll('[class*="animate-"]:not(.scroll-animate)');
        
        animatedElements.forEach(element => {
            // CSSアニメーションの開始を防ぐため、待機クラスを追加
            element.classList.add('animation-pending');
        });
    }

    /**
     * Intersection Observerを使用したスクロールアニメーション設定
     * クラスベースのアニメーション制御で安定性を向上
     */
    setupScrollObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // クリーンなクラスベースアニメーション制御
                    element.classList.remove('animation-pending');
                    element.classList.add('animate-visible');
                    
                    // 監視停止でパフォーマンス向上
                    this.observer.unobserve(element);
                }
            });
        }, this.observerOptions);

        // 監視対象要素の登録
        const animatedElements = document.querySelectorAll('[class*="animate-"], .scroll-animate');
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }

    /**
     * ヒーローセクションの動的テキストアニメーション
     * 時間差による段階的な表示効果
     */
    setupHeroAnimation() {
        const heroTextLines = document.querySelectorAll('.hero-text-line');
        const heroCta = document.querySelector('.hero-cta');
        
        // テキスト行の順次アニメーション
        heroTextLines.forEach((line, index) => {
            const delay = parseInt(line.getAttribute('data-delay')) || 0;
            
            setTimeout(() => {
                line.classList.add('visible');
            }, delay);
        });
        
        // CTAボタンのアニメーション
        if (heroCta) {
            const ctaDelay = parseInt(heroCta.getAttribute('data-delay')) || 2500;
            setTimeout(() => {
                heroCta.classList.add('visible');
            }, ctaDelay);
        }
    }

    /**
     * ヒーローメッセージのフェードイン・フェードアウト切り替え
     * 3つのメッセージを時間差で循環表示
     */
    setupHeroMessageRotation() {
        const messages = document.querySelectorAll('.hero-message');
        let currentIndex = 0;
        
        if (messages.length === 0) return;
        
        // 最初のメッセージを表示
        messages[currentIndex].classList.add('active');
        
        // メッセージ切り替えの間隔（ミリ秒）
        const messageInterval = 4000; // 4秒
        
        setInterval(() => {
            // 現在のメッセージを非表示
            messages[currentIndex].classList.remove('active');
            
            // 次のメッセージインデックスを計算
            currentIndex = (currentIndex + 1) % messages.length;
            
            // 次のメッセージを表示
            messages[currentIndex].classList.add('active');
        }, messageInterval);
    }

    /**
     * ヒーローセクションの進入アニメーション
     * ページ読み込み時の初期アニメーション
     */
    setupHeroEntry() {
        const heroSection = document.querySelector('.hero-section');
        const heroContent = document.querySelector('.hero-content-wrapper');
        
        if (!heroSection || !heroContent) return;
        
        // 初期状態設定
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px) scale(0.95)';
        
        // アニメーション開始
        setTimeout(() => {
            heroContent.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0) scale(1)';
            
            // テキストアニメーション開始
            this.setupHeroAnimation();
        }, 300);
    }

    /**
     * ヒーローセクションのパララックス効果
     * スクロールに応じた背景画像の動的移動
     */
    setupParallax() {
        const heroSection = document.querySelector('.hero-section');
        const heroImage = heroSection?.querySelector('img');
        
        if (!heroSection || !heroImage) return;
        
        const utility = new UtilityController();
        const handleScroll = utility.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heroImage.style.transform = `translate3d(0, ${rate}px, 0)`;
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }
}

/* ========================================
   2. UI相互作用
   ======================================== */

/**
 * UIインタラクションコントローラー
 * ユーザーとの相互作用機能を管理
 */
class UIController {
    /**
     * スムーズスクロール機能の設定
     * アンカーリンクのクリック時に滑らかなスクロール実行
     */
    setupSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * カードのホバーエフェクト設定
     * マウス移動に応じた3D効果の実装
     */
    setupCardHover() {
        const cards = document.querySelectorAll('.glass-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // マウス移動時の微細な3D効果
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `translateY(-5px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });
    }

    /**
     * ボタンのリップル効果設定
     * クリック時の波紋エフェクト
     */
    setupButtonRipple() {
        const buttons = document.querySelectorAll('a[class*="bg-gradient"], button[class*="bg-gradient"]');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    animation: ripple 0.6s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                
                this.appendChild(ripple);
                
                // リップル要素の自動削除
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    /**
     * スクロールインジケーターの設定
     * ヒーローセクション下部のスクロール誘導
     */
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.hero-section .animate-bounce');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const contentSection = document.getElementById('content');
                if (contentSection) {
                    contentSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }
}

/* ========================================
   3. フォーム機能
   ======================================== */

/**
 * フォーム管理コントローラー
 * バリデーションと送信処理を担当
 */
class FormController {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.elements = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            nameError: document.getElementById('nameError'),
            contactError: document.getElementById('contactError')
        };
    }

    /**
     * フォームバリデーション機能の設定
     * 名前必須 + メールか電話のどちらか必須の検証
     */
    setupValidation() {
        if (!this.form) return;

        // 送信時のバリデーション
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAndSubmit();
        });

        // リアルタイムバリデーション
        this.setupRealtimeValidation();
    }

    /**
     * バリデーション実行と送信処理
     */
    validateAndSubmit() {
        this.clearErrors();
        
        let isValid = true;
        
        // 名前のバリデーション
        if (!this.elements.name.value.trim()) {
            this.showError('name');
            isValid = false;
        }
        
        // 連絡先のバリデーション（メールか電話のどちらか必須）
        if (!this.elements.email.value.trim() && !this.elements.phone.value.trim()) {
            this.showError('contact');
            isValid = false;
        }
        
        if (isValid) {
            this.submitForm();
        }
    }

    /**
     * リアルタイムバリデーションの設定
     */
    setupRealtimeValidation() {
        // 名前フィールドのリアルタイム検証
        this.elements.name.addEventListener('input', () => {
            if (this.elements.name.value.trim()) {
                this.clearError('name');
            }
        });

        // 連絡先フィールドのリアルタイム検証
        const checkContactInfo = () => {
            if (this.elements.email.value.trim() || this.elements.phone.value.trim()) {
                this.clearError('contact');
            }
        };
        
        this.elements.email.addEventListener('input', checkContactInfo);
        this.elements.phone.addEventListener('input', checkContactInfo);
    }

    /**
     * エラー表示処理
     */
    showError(type) {
        if (type === 'name') {
            this.elements.nameError.classList.add('show');
            this.elements.name.classList.add('error');
        } else if (type === 'contact') {
            this.elements.contactError.classList.add('show');
            this.elements.email.classList.add('error');
            this.elements.phone.classList.add('error');
        }
    }

    /**
     * エラークリア処理
     */
    clearError(type) {
        if (type === 'name') {
            this.elements.nameError.classList.remove('show');
            this.elements.name.classList.remove('error');
        } else if (type === 'contact') {
            this.elements.contactError.classList.remove('show');
            this.elements.email.classList.remove('error');
            this.elements.phone.classList.remove('error');
        }
    }

    /**
     * 全エラーのクリア
     */
    clearErrors() {
        this.clearError('name');
        this.clearError('contact');
    }

    /**
     * フォーム送信処理
     */
    submitForm() {
        // 実際の送信処理はここに実装
        alert('お問い合わせを受け付けました。ありがとうございます。');
        this.form.reset();
    }
}

/* ========================================
   4. ユーティリティ
   ======================================== */

/**
 * ユーティリティ関数群
 * 共通機能と設定を提供
 */
class UtilityController {
    /**
     * パフォーマンス最適化のためのスロットル機能
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * レスポンシブ対応のための画面サイズ監視
     */
    setupResponsiveHandler() {
        const handleResize = this.throttle(() => {
            const isMobile = window.innerWidth <= 768;
            const splineContainer = document.querySelector('.spline-container');
            
            if (splineContainer) {
                splineContainer.style.display = isMobile ? 'none' : 'block';
            }
        }, 250);
        
        window.addEventListener('resize', handleResize);
        handleResize(); // 初期実行
    }

    /**
     * スクロール位置の復元機能
     * ページリロード時に前回のスクロール位置を記憶して復元
     */
    setupScrollRestoration() {
        // スクロール位置を保存
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('scrollPosition', window.pageYOffset.toString());
        });
        
        // ページロード時にスクロール位置を復元
        window.addEventListener('load', () => {
            const savedPosition = sessionStorage.getItem('scrollPosition');
            if (savedPosition) {
                window.scrollTo(0, parseInt(savedPosition));
                sessionStorage.removeItem('scrollPosition');
                
                // 復元後のアニメーション状態調整
                this.adjustAnimationsAfterRestore();
            }
        });
    }

    /**
     * スクロール復元後のアニメーション状態調整
     * クラスベースの制御で一貫性を保つ
     */
    adjustAnimationsAfterRestore() {
        setTimeout(() => {
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            const animatedElements = document.querySelectorAll('[class*="animate-"], .scroll-animate');
            
            animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollTop;
                
                // ビューポート内にある要素はクラスベースで表示状態に
                if (elementTop < scrollTop + viewportHeight) {
                    element.classList.remove('animation-pending');
                    element.classList.add('animate-visible');
                }
            });
        }, 100);
    }

    /**
     * エラーハンドリング機能
     * より包括的なエラー処理で表示の安定性を確保
     */
    setupErrorHandling() {
        // JavaScriptエラーの処理
        window.addEventListener('error', (e) => {
            console.warn('JavaScript error caught:', e.error);
            // エラーが発生してもページの基本機能は維持
        });
        
        // Promise拒否の処理
        window.addEventListener('unhandledrejection', (e) => {
            console.warn('Unhandled promise rejection:', e.reason);
            e.preventDefault();
        });
        
        // リソース読み込みエラーの処理
        window.addEventListener('error', (e) => {
            if (e.target !== window) {
                console.warn('Resource loading error:', e.target.src || e.target.href);
                // 外部リソースエラー時のフォールバック処理
                this.handleResourceError(e.target);
            }
        }, true);
    }
    
    /**
     * リソース読み込みエラー時のフォールバック処理
     */
    handleResourceError(element) {
        if (element.tagName === 'IMG') {
            // 画像読み込みエラー時の処理
            element.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.textContent = '画像を読み込めませんでした';
            element.parentNode?.insertBefore(fallback, element);
        } else if (element.tagName === 'SCRIPT' || element.tagName === 'LINK') {
            // CSS/JSファイルエラー時の処理
            console.warn(`External resource failed to load: ${element.src || element.href}`);
        }
    }

    /**
     * Lucideアイコンの初期化
     */
    initializeLucideIcons() {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    /**
     * リップルアニメーション用CSSの動的追加
     */
    addRippleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                from {
                    opacity: 1;
                    transform: scale(0);
                }
                to {
                    opacity: 0;
                    transform: scale(2);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ========================================
   5. 初期化処理
   ======================================== */

/**
 * アプリケーションメインコントローラー
 * 全体の初期化と統合管理を担当
 */
class App {
    constructor() {
        this.animationController = new AnimationController();
        this.uiController = new UIController();
        this.formController = new FormController();
        this.utilityController = new UtilityController();
    }

    /**
     * アプリケーション全体の初期化
     * DOM読み込み完了時に実行される統合初期化処理
     */
    initialize() {
        try {
            // アニメーション系初期化
            this.animationController.initializeElements();
            this.animationController.setupScrollObserver();
            this.animationController.setupHeroEntry();
            this.animationController.setupParallax();
            this.animationController.setupHeroMessageRotation();
            
            // UI系初期化
            this.uiController.setupSmoothScroll();
            this.uiController.setupCardHover();
            this.uiController.setupButtonRipple();
            this.uiController.setupScrollIndicator();
            
            // フォーム系初期化
            this.formController.setupValidation();
            
            // ユーティリティ系初期化
            this.utilityController.setupResponsiveHandler();
            this.utilityController.setupScrollRestoration();
            this.utilityController.setupErrorHandling();
            this.utilityController.initializeLucideIcons();
            this.utilityController.addRippleStyles();
            
            console.log('🎉 介護サロンWebサイト初期化完了');
        } catch (error) {
            console.warn('初期化エラー:', error);
        }
    }
}

// アプリケーション起動
const app = new App();

// DOM読み込み状態に応じた初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.initialize());
} else {
    app.initialize();
}

// ページ完全読み込み後の追加処理
window.addEventListener('load', () => {
    app.utilityController.initializeLucideIcons();
});