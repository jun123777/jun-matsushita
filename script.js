import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, updateDoc, onSnapshot, collection, query, where, getDocs,setDoc,deleteDoc, writeBatch} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase設定を直接記述
const firebaseConfig = {
  apiKey: "AIzaSyD0zbZLz_F4E8aXs1wA0aWqnMctkUWmPRw",
  authDomain: "nittei-tyousei3.firebaseapp.com",
  projectId: "nittei-tyousei3",
  storageBucket: "nittei-tyousei3.firebasestorage.app",
  messagingSenderId: "897767160060",
  appId: "1:897767160060:web:1e7fbc9cf1594f30603f79",
  measurementId: "G-2NVRY4YSZH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 言語とテーマの状態をlocalStorageから読み込む
let currentLang = localStorage.getItem('lang') || 'ja';
const currentTheme = localStorage.getItem('theme') || 'light';
const html = document.documentElement;

const translations = {
    ja: {
        appTitle: '日程調整3', // ✅ 修正: ロゴの翻訳キーを追加
        howToUse: '使い方',
        login: 'ログイン/登録',
        lang: 'JP / EN',
        heroTitle: 'サクッと 簡単・シンプル',
        homeSubtitle: '日程調整の種類を選択',
        dateCardTitle: '日にちで調整',
        dateCardDesc: '参加者の都合の良い日にちを複数選択してもらいます。',
        dateCardButton: '日にちで作成',
        dateCardNote: '投票結果は投票期限が過ぎたら公開されます',
        timeCardTitle: '時間帯で調整',
        timeCardDesc: '特定の日の時間帯で、都合の良い時間帯を複数選択してもらいます。',
        timeCardButton: '時間帯で作成',
        timeCardNote: '投票結果は投票期限が過ぎたら公開されます',
        createDateH2: '日にちで日程調整を作成',
        titleLabel: 'タイトル',
        titlePlaceholder: '例：チームランチの日程調整',
        descLabel: '説明',
        descPlaceholder: '例：チームランチの候補日を決めたいです。',
        deadlineLabel: '投票期限',
        datesLabel: '候補日を選択',
        createButton: '作成する',
        howToUseH2: '使い方',
        step1Title: 'ステップ1：日程調整の作成',
        step1Desc: 'サイトのトップページから、作成したい日程調整の種類を選択します。',
        step1Bullet1: '日にちで調整: 候補日を複数選択してアンケートを作成します。',
        step1Bullet2: '時間帯で調整: 日程日を一つ決めて、時間帯の候補を複数選択します。',
        step1Note: 'タイトルや説明文、投票期限を設定したら、「作成する」ボタンを押してください。',
        step2Title: 'ステップ2：URLの共有',
        step2Desc: '日程調整の作成が完了すると、専用のURLが発行されます。このURLをコピーして、LINEやメール、Slackなどで参加者に共有しましょう。',
        step3Title: 'ステップ3：投票',
        step3Desc: '共有されたURLにアクセスすると、投票ページが表示されます。',
        step3Bullet1: '自分の名前を入力します。',
        step3Bullet2: '都合の良い日にち、または時間帯を複数選択します。',
        step3Bullet3: '「投票する」ボタンを押して投票完了です。',
        step3NoteTitle: '注意点：',
        step3Note: '投票結果は、投票期限が過ぎるまで他の人には公開されません**。期限が過ぎると、すべての投票結果が自動で公開されます。',
        loginH2: 'ログイン / 登録',
        loginDesc: 'Googleアカウントで簡単・安全にログインできます。',
        loginButton: 'Googleアカウントでログイン',
        emailPlaceholder: 'メールアドレス',
        passwordPlaceholder: 'パスワード',
        loginButtonText: 'ログイン',
        registerButtonText: '新規登録',
        orSeparator: 'または',
        googleLoginText: 'Googleアカウントでログイン',
        resultsH2: '投票結果',
        resultsClosedMessage: '投票は締め切られました。',
        noVotes: 'まだ誰も投票していません。',
        voteH2: '投票ページ',
        voteDateH3: '投票日を選択',
        voteTimeH3: '候補時間帯を選択', // ✅ 修正: 投票ページの時間帯のタイトルを修正
        voterNameLabel: 'お名前',
        voterNamePlaceholder: '例：山田太郎',
        notAvailableLabel: '都合の良い日がない',
        commentLabel: 'コメント',
        commentPlaceholder: '例：月末であれば可能です。',
        submitVoteButton: '投票する',
        votedStatusH3: '投票状況',
        daysOfWeek: ['日', '月', '火', '水', '木', '金', '土'] // ✅ 修正: 曜日の翻訳キーを追加
    },
    en: {
        appTitle: 'Schedule 3', // ✅ 修正: ロゴの翻訳キーを追加
        howToUse: 'How to use',
        login: 'Login / Sign up',
        lang: 'EN / JP',
        heroTitle: 'Quick & Simple',
        homeSubtitle: 'Select a schedule type',
        dateCardTitle: 'By Date',
        dateCardDesc: 'Have participants select multiple convenient dates.',
        dateCardButton: 'Create by Date',
        dateCardNote: 'Results will be public after the voting deadline.',
        timeCardTitle: 'By Time',
        timeCardDesc: 'Have participants select convenient time slots for a specific date.',
        timeCardButton: 'Create by Time',
        timeCardNote: 'Results will be public after the voting deadline.',
        createDateH2: 'Create a schedule by date',
        titleLabel: 'Title',
        titlePlaceholder: 'e.g., Team Lunch Schedule',
        descLabel: 'Description',
        descPlaceholder: 'e.g., Let\'s decide the dates for our team lunch.',
        deadlineLabel: 'Voting Deadline',
        datesLabel: 'Select candidate dates',
        createButton: 'Create',
        howToUseH2: 'How to use',
        step1Title: 'Step 1: Create a Schedule',
        step1Desc: 'From the top page, select the type of schedule you want to create.',
        step1Bullet1: 'By Date: Create a poll by selecting multiple candidate dates.',
        step1Bullet2: 'By Time: Select a specific date and multiple time slots.',
        step1Note: 'After setting the title, description, and voting deadline, press the "Create" button.',
        step2Title: 'Step 2: Share the URL',
        step2Desc: 'Once the schedule is created, a unique URL will be issued. Copy this URL and share it with participants via LINE, email, Slack, etc.',
        step3Title: 'Step 3: Vote',
        step3Desc: 'When you access the shared URL, the voting page will be displayed.',
        step3Bullet1: 'Enter your name.',
        step3Bullet2: 'Select one or more convenient dates or time slots.',
        step3Bullet3: 'Press the "Vote" button to complete your vote.',
        step3NoteTitle: 'Note:',
        step3Note: 'Voting results will remain **private until the voting deadline has passed**. After the deadline, all voting results will be automatically published.',
        loginH2: 'Login / Sign Up',
        loginDesc: 'You can easily and securely log in with your Google account.',
        loginButton: 'Login with Google',
        emailPlaceholder: 'Email Address',
        passwordPlaceholder: 'Password',
        loginButtonText: 'Login',
        registerButtonText: 'Sign Up',
        orSeparator: 'or',
        googleLoginText: 'Login with Google',
        resultsH2: 'Voting Results',
        noVotes: 'No one has voted yet.',
        voteH2: 'Voting Page',
        voteDateH3: 'Select a voting date',
        voteTimeH3: 'Select candidate time slots', // ✅ 修正: 投票ページの時間帯のタイトルを修正
        voterNameLabel: 'Your Name',
        voterNamePlaceholder: 'e.g., John Doe',
        notAvailableLabel: 'Not available on any of the dates',
        commentLabel: 'Comment',
        commentPlaceholder: 'e.g., I am available at the end of the month.',
        submitVoteButton: 'Vote',
        votedStatusH3: 'Voting Status',
        daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] // ✅ 修正: 曜日の翻訳キーを追加
    }
};

const updateContent = (lang) => {
    const text = translations[lang];
    const elements = [
        { id: 'logo-text', prop: 'textContent', value: text.appTitle }, // ✅ 修正: ロゴのテキストを更新
        { id: 'how-to-use-link-pc', prop: 'textContent', value: text.howToUse },
        { id: 'login-link-pc', prop: 'textContent', value: text.login },
        { id: 'lang-text-pc', prop: 'textContent', value: text.lang },
        { id: 'how-to-use-link-mobile', prop: 'textContent', value: text.howToUse },
        { id: 'login-link-mobile', prop: 'textContent', value: text.login },
        { id: 'lang-text-mobile', prop: 'textContent', value: text.lang },
        { id: 'hero-title', prop: 'textContent', value: text.heroTitle },
        { id: 'home-subtitle', prop: 'textContent', value: text.homeSubtitle },
        { id: 'date-card-title', prop: 'textContent', value: text.dateCardTitle },
        { id: 'date-card-desc', prop: 'textContent', value: text.dateCardDesc },
        { id: 'create-date-button', prop: 'textContent', value: text.dateCardButton },
        { id: 'date-card-note', prop: 'textContent', value: text.dateCardNote },
        { id: 'time-card-title', prop: 'textContent', value: text.timeCardTitle },
        { id: 'time-card-desc', prop: 'textContent', value: text.timeCardDesc },
        { id: 'create-time-button', prop: 'textContent', value: text.timeCardButton },
        { id: 'time-card-note', prop: 'textContent', value: text.timeCardNote }
    ];

    elements.forEach(el => {
        const element = document.getElementById(el.id);
        if (element) {
            element[el.prop] = el.value;
        }
    });

    const sections = ['home-section', 'how-to-use-section', 'login-section', 'create-date-section', 'create-time-section', 'voting-page-section', 'voting-results-section', 'my-page-section'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const h2 = section.querySelector('h2');
            if (h2) {
                if (sectionId === 'how-to-use-section') h2.textContent = text.howToUseH2;
                if (sectionId === 'login-section') h2.textContent = text.loginH2;
                if (sectionId === 'create-date-section') h2.textContent = text.createDateH2;
                if (sectionId === 'create-time-section') h2.textContent = text.createDateH2;
                if (sectionId === 'voting-page-section') {
                     // voting-page.htmlでIDを付与したので、ここも更新
                     const votingTitle = document.getElementById('voting-title');
                     if(votingTitle) votingTitle.textContent = text.voteH2;
                }
                if (sectionId === 'voting-results-section') h2.textContent = text.resultsH2;
                if (sectionId === 'my-page-section') {
                    // my-page.html の h2 は既に「マイアンケート」なので、翻訳キーを使用
                    const myPageH2 = section.querySelector('#my-page-content-wrapper h2');
                    if (myPageH2) myPageH2.textContent = text.mySchedules || 'マイアンケート'; // 新しいキー mySchedules が無い場合は仮のテキストを維持
                }
            }
            
            if (sectionId === 'how-to-use-section') {
                const howToUseElements = [
                    { selector: '.space-y-8 > div:nth-child(1) > h3', prop: 'textContent', value: text.step1Title },
                    { selector: '.space-y-8 > div:nth-child(1) > p:nth-of-type(1)', prop: 'textContent', value: text.step1Desc },
                    { selector: '.space-y-8 > div:nth-child(1) > ul > li:nth-child(1)', prop: 'innerHTML', value: text.step1Bullet1 },
                    { selector: '.space-y-8 > div:nth-child(1) > ul > li:nth-child(2)', prop: 'innerHTML', value: text.step1Bullet2 },
                    { selector: '.space-y-8 > div:nth-child(1) > p:nth-of-type(2)', prop: 'textContent', value: text.step1Note },
                    { selector: '.space-y-8 > div:nth-child(2) > h3', prop: 'textContent', value: text.step2Title },
                    { selector: '.space-y-8 > div:nth-child(2) > p', prop: 'textContent', value: text.step2Desc },
                    { selector: '.space-y-8 > div:nth-child(3) > h3', prop: 'textContent', value: text.step3Title },
                    { selector: '.space-y-8 > div:nth-child(3) > p:nth-of-type(1)', prop: 'textContent', value: text.step3Desc },
                    { selector: '.space-y-8 > div:nth-child(3) > ul > li:nth-child(1)', prop: 'textContent', value: text.step3Bullet1 },
                    { selector: '.space-y-8 > div:nth-child(3) > ul > li:nth-child(2)', prop: 'textContent', value: text.step3Bullet2 },
                    { selector: '.space-y-8 > div:nth-child(3) > ul > li:nth-child(3)', prop: 'textContent', value: text.step3Bullet3 },
                    { selector: '.space-y-8 > div:nth-child(3) > p:nth-of-type(2)', prop: 'innerHTML', value: text.step3NoteTitle },
                    { selector: '.space-y-8 > div:nth-child(3) > p:nth-of-type(3)', prop: 'innerHTML', value: text.step3Note }
                ];
                howToUseElements.forEach(el => {
                    const element = document.querySelector(el.selector);
                    if (element) {
                        element[el.prop] = el.value;
                    }
                });
            }

            if (sectionId === 'create-date-section' || sectionId === 'create-time-section') {
                const titleLabel = document.querySelector(`#${sectionId} label[for^="schedule-title"]`);
                if (titleLabel) titleLabel.textContent = text.titleLabel;
                const scheduleTitle = document.querySelector(`#${sectionId} input[name^="schedule-title"]`);
                if (scheduleTitle) scheduleTitle.placeholder = text.titlePlaceholder;
                const descLabel = document.querySelector(`#${sectionId} label[for^="schedule-description"]`);
                if (descLabel) descLabel.textContent = text.descLabel;
                const scheduleDescription = document.querySelector(`#${sectionId} textarea[name^="schedule-description"]`);
                if (scheduleDescription) scheduleDescription.placeholder = text.descPlaceholder;
                const deadlineLabel = document.querySelector(`#${sectionId} label[for^="vote-deadline"]`);
                if (deadlineLabel) deadlineLabel.textContent = text.deadlineLabel;
                const datesLabel = document.querySelector(`#${sectionId} h3`);
                if (datesLabel) datesLabel.textContent = sectionId === 'create-date-section' ? text.datesLabel : text.voteTimeH3;
                const createDateSubmitButton = document.querySelector(`#${sectionId} button[type="submit"]`);
                if (createDateSubmitButton) createDateSubmitButton.textContent = text.createButton;
            }

            if (sectionId === 'voting-page-section') {
                // ✅ 修正: 投票ページの日付/時間帯のh3を翻訳
                const votingDateH3 = document.getElementById('voting-date-h3');
                if (votingDateH3) votingDateH3.textContent = text.voteDateH3;
                const votingTimeH3 = document.getElementById('voting-time-h3');
                if (votingTimeH3) votingTimeH3.textContent = text.voteTimeH3;

                const voterNameInput = document.getElementById('voter-name');
                if (voterNameInput) voterNameInput.placeholder = text.voterNamePlaceholder;
                const voterNameLabel = document.querySelector('label[for="voter-name"]');
                if (voterNameLabel) voterNameLabel.textContent = text.voterNameLabel;
                const notAvailableLabel = document.querySelector('#not-available-checkbox')?.nextElementSibling;
                if (notAvailableLabel) notAvailableLabel.textContent = text.notAvailableLabel;
                const submitVoteBtn = document.querySelector('#submit-vote-button');
                if (submitVoteBtn) submitVoteBtn.textContent = text.submitVoteButton;
                const votedUsersHeading = document.querySelector('#voted-users-list')?.previousElementSibling;
                if (votedUsersHeading) votedUsersHeading.textContent = text.votedStatusH3;
            }

            if (sectionId === 'login-section') {
                const loginEmailInput = document.getElementById('login-email');
                if (loginEmailInput) loginEmailInput.placeholder = text.emailPlaceholder;
                
                const loginPasswordInput = document.getElementById('login-password');
                if (loginPasswordInput) loginPasswordInput.placeholder = text.passwordPlaceholder;
                
                const emailLoginButton = document.getElementById('email-login-button');
                if (emailLoginButton) emailLoginButton.textContent = text.loginButtonText;
                
                const registerButtonTextElement = document.getElementById('register-button'); // IDは index.html の <button id="register-button"> に合わせます
                if (registerButtonTextElement) registerButtonTextElement.textContent = text.registerButtonText;

                const orSeparator = document.getElementById('or-separator');
                if (orSeparator) orSeparator.textContent = text.orSeparator;
                
                const googleLoginText = document.getElementById('google-login-text');
                if (googleLoginText) googleLoginText.textContent = text.googleLoginText;
            }

            if (sectionId === 'voting-results-section') {
                const resultsDesc = document.querySelector('#voting-results-section p');
                // このpタグは動的に更新されるため、ここでは何もしない
            }
        }
    });
};

const toggleMobileMenu = () => {
    // 複数のページで使用するため、要素が存在するか確認する
    const mobileMenuContent = document.getElementById('mobile-menu-content');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    if (mobileMenuContent && mobileMenuOverlay) {
        mobileMenuContent.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
    }
};

const handleLangToggle = () => {
    currentLang = currentLang === 'ja' ? 'en' : 'ja';
    localStorage.setItem('lang', currentLang);
    updateContent(currentLang);
    // カレンダーを表示している場合、言語切り替え後に再描画
    const calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer && !calendarContainer.classList.contains('hidden')) {
        renderCalendar(calendarContainer, currentMonth, currentYear, true, [], true); // 簡易的な再描画
    }
};

const handleThemeToggle = () => {
    html.classList.toggle('dark');
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme(document.getElementById('theme-toggle-pc')); 
    applyTheme(document.getElementById('theme-toggle-mobile'));
    };

const applyTheme = (element) => {
    const sunIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    const moonIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1m-16 0H3m15.827 6.327l-.707.707M5.879 5.879l-.707.707m12.728 0l-.707-.707M6.515 17.485l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path></svg>`;
    if (element) {
        element.innerHTML = currentTheme === 'dark' ? moonIcon : sunIcon;
    }
};

const mainAppLogic = async(user) => {
    
    // マイページに関する古いロジックは削除され、以下のページ判定ブロック内に移動しました

    const urlParams = new URLSearchParams(window.location.search);
    
    let scheduleId = urlParams.get('id'); 
        
        if (!scheduleId) {
            // パス形式 (/vote/xxxx など) からIDを取得を試みる
            const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
            // パスの最後のセグメントがIDであると仮定
            if (pathSegments.length > 0) {
                const lastSegment = pathSegments[pathSegments.length - 1];
                // 最後のセグメントがファイル名でない場合のみIDとして採用
                if (!lastSegment.includes('.')) {
                    scheduleId = lastSegment; 
                }
            }
        }
    
        const normalizedScheduleId = scheduleId ? scheduleId.toLowerCase() : null; 

        const homeSection = document.getElementById('home-section');
        const howToUseSection = document.getElementById('how-to-use-section');
        const loginSection = document.getElementById('login-section');
        const createDateSection = document.getElementById('create-date-section');
        const createTimeSection = document.getElementById('create-time-section');
        const creationCompleteSection = document.getElementById('creation-complete-section');
        const votingPageSection = document.getElementById('voting-page-section');
        const votingResultsSection = document.getElementById('voting-results-section');
        const myPageSection = document.getElementById('my-page-section');
        const createDateButton = document.getElementById('create-date-button');
        const createTimeButton = document.getElementById('create-time-button');
        
        // ナビゲーション関連の要素をPCとモバイルで分ける
        const howToUseLinkPC = document.getElementById('how-to-use-link-pc');
        const loginLinkPC = document.getElementById('login-link-pc');
        const mySchedulesLinkPC = document.getElementById('my-schedules-link-pc');
        const logoutLinkPC = document.getElementById('logout-link-pc');
        const userIconContainerPC = document.getElementById('user-icon-container-pc');
        
        const loginLinkMobile = document.getElementById('login-link-mobile');
        // --- 🔽 修正: howToUseLinkMobile の変数をここで宣言 🔽 ---
        const howToUseLinkMobile = document.getElementById('how-to-use-link-mobile');
        // --- 🔼 修正ここまで 🔼 ---
        const mySchedulesLinkMobile = document.getElementById('my-schedules-link-mobile');
        const logoutLinkMobile = document.getElementById('logout-link-mobile');
        const userIconContainerMobile = document.getElementById('user-icon-container-mobile');

        // 言語/テーマトグル
        const langTogglePC = document.getElementById('lang-toggle-pc'); 
        const themeTogglePC = document.getElementById('theme-toggle-pc');
        const langToggleMobile = document.getElementById('lang-toggle-mobile'); 
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');


        const backToHomeButtonPC = document.getElementById('back-to-home-button-pc');
        const backToHomeButtonMobile = document.getElementById('back-to-home-button-mobile');
        
        const calendarContainer = document.getElementById('calendar-container');
        const timeSlotsContainer = document.getElementById('time-slots-container');
        const votingCalendarContainer = document.getElementById('voting-calendar-container');
        const votingTimeSlotsContainer = document.getElementById('voting-time-slots-container');
        const votingTimeH3 = document.getElementById('voting-time-h3');
        const votedUsersList = document.getElementById('voted-users-list');
        const submitVoteButton = document.getElementById('submit-vote-button');
        const shareUrlElement = document.getElementById('share-url');
        const copyUrlButton = document.getElementById('copy-url-button');
        const resultsDisplay = document.getElementById('results-display');
        const notAvailableCheckbox = document.getElementById('not-available-checkbox');
        const notAvailableCommentContainer = document.getElementById('not-available-comment-container');
        const notAvailableComment = document.getElementById('not-available-comment');
        const dateScheduleForm = document.getElementById('date-schedule-form');
        const timeScheduleForm = document.getElementById('time-schedule-form');
        const votingDateH3 = document.getElementById('voting-date-h3');
        const googleLoginButton = document.getElementById('google-login-button');
        const emailLoginForm = document.getElementById('email-login-form');
        const registerButton = document.getElementById('register-button');

        let isHowToUseVisible = false;
        let selectedDates = new Set();
        let selectedTimeSlots = new Set();
        const today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        const bulkDeleteBtn = document.getElementById('bulk-delete-btn'); // mainAppLogic 内の取得箇所を使用
        if (bulkDeleteBtn && !bulkDeleteBtn.hasListener) {
            bulkDeleteBtn.onclick = () => {
                const selectedIds = Array.from(document.querySelectorAll('.schedule-checkbox:checked'))
                .map(cb => cb.dataset.id);
                bulkDeleteSchedules(selectedIds);
            };
            bulkDeleteBtn.hasListener = true; // 複数回設定されないためのフラグ
        }

        const renderMySchedules = (schedules, listElement) => {
            // [A] 初期化と要素の取得
            if (!listElement) return;

            listElement.innerHTML = '';

            // [B] データが存在しない場合の処理
            if (schedules.length === 0) {
                listElement.innerHTML = '<p class="text-gray-500 dark:text-gray-400 p-4">作成したアンケートはありません。</p>';
                return;
            }

            schedules.forEach(item => {
                const schedule = item.data;
                const scheduleId = item.id;
                const listItem = document.createElement('div');
                
                listItem.className = 'bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0';
                
                listItem.innerHTML = `
                     <div class="flex items-center space-x-3 w-full sm:w-auto">
                         <input type="checkbox" data-id="${scheduleId}" class="schedule-checkbox h-5 w-5 text-blue-600 dark:bg-gray-600 dark:border-gray-500 rounded focus:ring-blue-500">
                         
                         <div class="flex flex-col">
                            <span class="font-bold text-lg dark:text-white">${schedule.title}</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">${schedule.type === 'date' ? '日にち調整' : '時間帯調整'} / 期限: ${new Date(schedule.deadline).toLocaleDateString()}</span>
                         </div>
                     </div>

                     <div class="flex items-center space-x-3 mt-2 sm:mt-0">
                        <button data-id="${scheduleId}" class="delete-schedule-btn text-sm text-red-500 hover:text-red-700 transition-colors">削除</button>
                        <a href="voting-page.html?id=${scheduleId}" class="text-blue-500 hover:underline text-sm font-medium">詳細を見る</a>
                     </div>
                `;
                listElement.appendChild(listItem);
            });

         attachMyPageListeners(); 
         updateBulkDeleteButton();
        };

        const attachMyPageListeners = () => {
            // 1. 要素を取得
            const deleteButtons = document.querySelectorAll('.delete-schedule-btn');
            const schedulesCheckboxes = document.querySelectorAll('#my-schedules-list .schedule-checkbox'); 
            
            // 2. 個別削除ボタンのリスナー設定
            deleteButtons.forEach(button => {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                newButton.addEventListener('click', (e) => {
                    const scheduleIdToDelete = e.currentTarget.dataset.id;
                    deleteSchedule(scheduleIdToDelete);
                });
            });
            
            // 3. チェックボックスのリスナー設定
            schedulesCheckboxes.forEach(cb => {
                const newCheckbox = cb.cloneNode(true);
                cb.parentNode.replaceChild(newCheckbox, cb);
                newCheckbox.addEventListener('change', updateBulkDeleteButton);
            });
        };


        const updateBulkDeleteButton = () => {
            // #my-schedules-list 内のチェックボックスを取得
            const listElement = document.getElementById('my-schedules-list');
            if (!listElement) return 0;
            const checkboxes = listElement.querySelectorAll('.schedule-checkbox'); 

            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
            // bulkDeleteBtn が存在しない場合は処理を終了
            if (!bulkDeleteBtn) return;
            
            if (checkedCount > 0) {
            // チェックが1つ以上あれば表示
            bulkDeleteBtn.classList.remove('hidden');
            } else {
                // チェックが0であれば非表示
                bulkDeleteBtn.classList.add('hidden');
            }
        };

        const bulkDeleteSchedules = async (selectedIds) => {
            if (selectedIds.length === 0) {
                alert("削除する日程調整を選択してください。"); 
                return;
            }

            if (!confirm(`本当に選択された ${selectedIds.length} 件の日程調整を削除してもよろしいですか？この操作は元に戻せません。`)) {
                return; // キャンセルの場合はここで終了
            }
                
            try {
                // writeBatch が import されていないとここでエラーになります
                const batch = writeBatch(db); 
                selectedIds.forEach(id => {
                    const scheduleRef = doc(db, "schedules", id);
                    batch.delete(scheduleRef);
                });

                await batch.commit();
                alert("日程調整をまとめて削除しました。"); 
                window.location.reload(); 
            } catch (error) {
                    console.error("まとめて削除エラー:", error);
                    alert("削除に失敗しました: " + error.message); 
            }
        };        

        const deleteSchedule = async (scheduleId) => {
            if (confirm("本当にこの日程調整を削除してもよろしいですか？この操作は元に戻せません。")) {
                const scheduleRef = doc(db, "schedules", scheduleId);
                
                try {
                    await deleteDoc(scheduleRef);
                    alert("日程調整を削除しました。");        
                    
                    window.location.reload(); 
                } catch (error) {
                    console.error("削除エラー:", error);
                    alert("削除に失敗しました: " + error.message);
                }
            }
        };

        // ログイン状態に応じてアイコンとリンクの表示を切り替え
        const updateHeader = (user) => {
            // PC用
            if (document.getElementById('user-icon-container-pc')) {
                const userIconContainerPC = document.getElementById('user-icon-container-pc');
                const loginLinkPC = document.getElementById('login-link-pc');
                const mySchedulesLinkPC = document.getElementById('my-schedules-link-pc');
                const logoutLinkPC = document.getElementById('logout-link-pc');

                if (user && !user.isAnonymous) {
                    const photoURL = user.photoURL || 'https://via.placeholder.com/32';
                    userIconContainerPC.innerHTML = `<img src="${photoURL}" alt="User" class="w-full h-full rounded-full object-cover">`;
                    if (loginLinkPC) loginLinkPC.classList.add('hidden');
                    if (mySchedulesLinkPC) mySchedulesLinkPC.classList.remove('hidden');
                    if (logoutLinkPC) logoutLinkPC.classList.remove('hidden');
                } else {
                    userIconContainerPC.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    `;
                    if (loginLinkPC) loginLinkPC.classList.remove('hidden');
                    if (mySchedulesLinkPC) mySchedulesLinkPC.classList.add('hidden');
                    if (logoutLinkPC) logoutLinkPC.classList.add('hidden');
                }
            }

            // スマホ用
            if (document.getElementById('user-icon-container-mobile')) {
                 const userIconContainerMobile = document.getElementById('user-icon-container-mobile');
                 const loginLinkMobile = document.getElementById('login-link-mobile');
                 const mySchedulesLinkMobile = document.getElementById('my-schedules-link-mobile');
                 const logoutLinkMobile = document.getElementById('logout-link-mobile');

                if (user && !user.isAnonymous) {
                    const photoURL = user.photoURL || 'https://via.placeholder.com/32';
                    userIconContainerMobile.innerHTML = `<img src="${photoURL}" alt="User" class="w-full h-full rounded-full object-cover">`;
                    if (loginLinkMobile) loginLinkMobile.classList.add('hidden');
                    if (mySchedulesLinkMobile) mySchedulesLinkMobile.classList.remove('hidden');
                    if (logoutLinkMobile) logoutLinkMobile.classList.remove('hidden');
                } else {
                    userIconContainerMobile.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    `;
                    if (loginLinkMobile) loginLinkMobile.classList.remove('hidden');
                    if (mySchedulesLinkMobile) mySchedulesLinkMobile.classList.add('hidden');
                    if (logoutLinkMobile) logoutLinkMobile.classList.add('hidden');
                }
            }
        };

        const handleLogout = async () => {
            await signOut(auth);
            alert("ログアウトしました。");
            window.location.href = 'index.html';
        };

        // --- 🔽 修正: showSection 関数をここに移動 🔽 ---
        const showSection = (sectionId) => {
            const allSections = document.querySelectorAll('main#app-container > section');
            allSections.forEach(section => section.classList.add('hidden'));
            const sectionToShow = document.getElementById(sectionId);
            if (sectionToShow) {
                sectionToShow.classList.remove('hidden');
            }
            updateContent(currentLang);
        };
        // --- 🔼 修正ここまで 🔼 ---

        // --- 🔽 修正: handleHowToUseToggle 関数をここに追加 🔽 ---
        const handleHowToUseToggle = (e) => {
            // index.html にいる場合のみトグル動作を実行
            if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
                e.preventDefault(); // リンクのデフォルト動作を停止

                const howToUseSection = document.getElementById('how-to-use-section');
                
                if (howToUseSection) {
                    // 既に「使い方」セクションが表示されている（hiddenクラスがない）場合はホームに戻す
                    if (!howToUseSection.classList.contains('hidden')) {
                        showSection('home-section');
                    } else {
                        // 表示されていない場合は「使い方」セクションを表示する
                        showSection('how-to-use-section');
                    }
                }
            } else {
                // index.html 以外のページでは、index.html の使い方セクションに遷移する
                window.location.href = 'index.html#how-to-use-section';
            }
        };
        // --- 🔼 修正ここまで 🔼 ---
        
        // PC用ボタンのイベントリスナー
        
        // --- 🔽 修正: howToUseLinkPC のリスナーを変更 🔽 ---
        if (howToUseLinkPC) howToUseLinkPC.addEventListener('click', handleHowToUseToggle);
        // --- 🔼 修正ここまで 🔼 ---
        if (loginLinkPC) loginLinkPC.addEventListener('click', () => showSection('login-section'));
        if (backToHomeButtonPC) backToHomeButtonPC.addEventListener('click', () => window.location.href = 'index.html');
        if (logoutLinkPC) logoutLinkPC.addEventListener('click', handleLogout);

        // スマホ用ボタンのイベントリスナー
        // --- 🔽 修正: howToUseLinkMobile のリスナーを追加 🔽 ---
        if (howToUseLinkMobile) howToUseLinkMobile.addEventListener('click', handleHowToUseToggle);
        // --- 🔼 修正ここまで 🔼 ---
        if (loginLinkMobile) loginLinkMobile.addEventListener('click', () => showSection('login-section'));
        if (backToHomeButtonMobile) backToHomeButtonMobile.addEventListener('click', () => window.location.href = 'index.html');
        if (logoutLinkMobile) logoutLinkMobile.addEventListener('click', handleLogout); // ✅ 修正: スマホ版のログアウトボタンにもイベントリスナーを設定
        
        if (googleLoginButton) {
            googleLoginButton.addEventListener('click', async () => {
                const provider = new GoogleAuthProvider();
                try {
                    await signInWithPopup(auth, provider);
                    alert("ログインしました！");
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("Googleログインエラー:", error);
                    if (error.code === 'auth/cancelled-popup-request' || error.code === 'popup-blocked') {
                        alert("Googleログインに失敗しました。\n\nブラウザのポップアップブロッカーが原因でログイン画面が表示できませんでした。\n\nお手数ですが、このサイトのポップアップを許可してから再度お試しいただくか、メールアドレスでのログインをご利用ください。");
                    } else {
                        alert("Googleログインに失敗しました: " + error.message);
                    }
                }
            });
        }
        
        if (emailLoginForm) {
            emailLoginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                try {
                    await signInWithEmailAndPassword(auth, email, password);
                    alert("ログインしました！");
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("メールアドレスログインエラー:", error);
                    alert("ログインに失敗しました: " + error.message);
                }
            });
        }

        if (registerButton) {
            registerButton.addEventListener('click', async () => {
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    alert("新規登録が完了しました！");
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error("新規登録エラー:", error);
                    alert("新規登録に失敗しました: " + error.message);
                }
            });
        }

        const renderCalendar = (container, month, year, selectable = true, allowedDates = [], isMultipleSelection = true) => {
            if (!container) return;
            container.innerHTML = '';
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - startDate.getDay());

            // ✅ 修正: 月の表示を翻訳対応
            const monthName = new Date(year, month).toLocaleString(currentLang, { month: 'long' });
            const yearText = currentLang === 'ja' ? `${year}年` : year;
            const displayMonth = currentLang === 'ja' ? `${month + 1}月` : monthName;
            
            const calendarHeader = `
                <div class="calendar-header">
                    <button id="prev-month-button-${container.id}" class="text-blue-500 dark:text-blue-300">&lt;</button>
                    <span>${yearText} ${displayMonth}</span>
                    <button id="next-month-button-${container.id}" class="text-blue-500 dark:text-blue-300">&gt;</button>
                </div>
            `;
            container.innerHTML = calendarHeader;

            // ✅ 修正: 曜日の配列を翻訳から取得
            const daysOfWeek = translations[currentLang].daysOfWeek;
            const dayHeaderGrid = document.createElement('div');
            dayHeaderGrid.className = 'calendar-grid mb-2';
            daysOfWeek.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'day-header';
                dayHeader.textContent = day;
                dayHeaderGrid.appendChild(dayHeader);
            });
            container.appendChild(dayHeaderGrid);

            const calendarGrid = document.createElement('div');
            calendarGrid.className = 'calendar-grid';

            let date = new Date(startDate);
            let dayCounter = 0;
            while (dayCounter < 42) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = date.getDate();

                if (date.getMonth() !== month) {
                    dayElement.classList.add('inactive');
                } else if (selectable) {
                    const dateString = date.toISOString().split('T')[0];
                    dayElement.addEventListener('click', () => {
                        if (!isMultipleSelection) {
                            selectedDates.clear();
                            const allDays = document.querySelectorAll('.selectable-date');
                            allDays.forEach(d => d.classList.remove('selected'));
                        }
                        if (selectedDates.has(dateString)) {
                            selectedDates.delete(dateString);
                            dayElement.classList.remove('selected');
                        } else {
                            selectedDates.add(dateString);
                            dayElement.classList.add('selected');
                        }
                    });
                    if (selectedDates.has(dateString)) {
                        dayElement.classList.add('selected');
                    }
                } else {
                    const dateString = date.toISOString().split('T')[0];
                    if (allowedDates.includes(dateString)) {
                        dayElement.classList.add('selectable-date');
                        dayElement.addEventListener('click', () => {
                            if (notAvailableCheckbox && notAvailableCheckbox.checked) {
                                notAvailableCheckbox.checked = false;
                                if (notAvailableCommentContainer) {
                                    notAvailableCommentContainer.classList.add('hidden');
                                }
                            }
                            if (!isMultipleSelection) {
                                selectedDates.clear();
                                const allDays = document.querySelectorAll('.selectable-date');
                                allDays.forEach(d => d.classList.remove('selected'));
                            }

                            if (selectedDates.has(dateString)) {
                                selectedDates.delete(dateString);
                                dayElement.classList.remove('selected');
                            } else {
                                selectedDates.add(dateString);
                                dayElement.classList.add('selected');
                            }
                        });
                        if (selectedDates.has(dateString)) {
                            dayElement.classList.add('selected');
                        }
                    } else {
                        dayElement.classList.add('inactive');
                        dayElement.style.pointerEvents = 'none';
                    }
                }
                calendarGrid.appendChild(dayElement);
                date.setDate(date.getDate() + 1);
                dayCounter++;
            }

            container.appendChild(calendarGrid);
            
            const prevButton = document.getElementById(`prev-month-button-${container.id}`);
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    currentMonth--;
                    if (currentMonth < 0) {
                        currentMonth = 11;
                        currentYear--;
                    }
                    renderCalendar(container, currentMonth, currentYear, selectable, allowedDates, isMultipleSelection);
                });
            }
            
            const nextButton = document.getElementById(`next-month-button-${container.id}`);
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    currentMonth++;
                    if (currentMonth > 11) {
                        currentMonth = 0;
                        currentYear++;
                    }
                    renderCalendar(container, currentMonth, currentYear, selectable, allowedDates, isMultipleSelection);
                });
            }
        };

        const generateTimeSlots = (container, selectable = true, allowedTimeSlots = [], isMultipleSelection = true) => {
            if (!container) return;
            container.innerHTML = '';
            
            const timeSlotsToRender = selectable ? [] : allowedTimeSlots;
            
            if (selectable) {
                const startTime = 9 * 60;
                const endTime = 24 * 60;
                for (let i = startTime; i < endTime; i += 30) {
                    const hours = Math.floor(i / 60);
                    const minutes = i % 60;
                    const nextHours = Math.floor((i + 30) / 60);
                    const nextMinutes = (i + 30) % 60;
                    
                    const timeText = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} - ${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
                    timeSlotsToRender.push(timeText);
                }
            }
            
            timeSlotsToRender.forEach(timeText => {
                const timeSlotElement = document.createElement('div');
                timeSlotElement.className = 'time-slot';
                timeSlotElement.textContent = timeText;
                timeSlotElement.dataset.time = timeText;

                if (selectable) {
                    timeSlotElement.addEventListener('click', () => {
                        if (!isMultipleSelection) {
                            selectedTimeSlots.clear();
                            const allSlots = document.querySelectorAll('.time-slot');
                            allSlots.forEach(s => s.classList.remove('selected'));
                        }
                        if (selectedTimeSlots.has(timeText)) {
                            selectedTimeSlots.delete(timeText);
                            timeSlotElement.classList.remove('selected');
                        } else {
                            selectedTimeSlots.add(timeText);
                            timeSlotElement.classList.add('selected');
                        }
                    });
                } else {
                    if (selectedTimeSlots.has(timeText)) {
                        timeSlotElement.classList.add('selected');
                    }
                }
                
                container.appendChild(timeSlotElement);
            });
        };

        const updateVotedUsersList = (votedUsers, candidates, isResultsPage) => {
            const votedUsersListElement = document.getElementById('voted-users-list');
            const resultsDisplayElement = document.getElementById('results-display');
            
            if (!votedUsersListElement) return;
            votedUsersListElement.innerHTML = '';
            
            if (votedUsers.length === 0) {
                const li = document.createElement('li');
                li.textContent = translations[currentLang].noVotes;
                li.className = 'text-gray-500';
                votedUsersListElement.appendChild(li);
                return;
            }

            if (isResultsPage) {
                const voteCounts = {};
                candidates.forEach(candidate => voteCounts[candidate] = { votes: 0, voters: [] });

                votedUsers.forEach(user => {
                    if (user.voteData.status === 'available' && Array.isArray(user.voteData.votes)) {
                        user.voteData.votes.forEach(vote => {
                            if (voteCounts[vote]) {
                                voteCounts[vote].votes++;
                                voteCounts[vote].voters.push(user.name);
                            }
                        });
                    }
                });

                const notAvailableUsers = votedUsers.filter(user => user.voteData.status === 'not-available');
                const sortedCandidates = Object.keys(voteCounts).sort();

                if (resultsDisplayElement) {
                    resultsDisplayElement.innerHTML = '';
                    sortedCandidates.forEach(candidate => {
                        const count = voteCounts[candidate].votes;
                        const voters = voteCounts[candidate].voters;
                        const li = document.createElement('li');
                        li.className = 'p-4 border-b border-gray-200 dark:border-gray-700';
                        li.innerHTML = `
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-gray-800 dark:text-gray-200">${candidate} (${count}票)</span>
                                <span class="text-sm text-gray-500 dark:text-gray-400">${voters.join(', ')}</span>
                            </div>
                        `;
                        resultsDisplayElement.appendChild(li);
                    });
    
                    if (notAvailableUsers.length > 0) {
                        const li = document.createElement('li');
                        li.className = 'p-4 dark:border-gray-700';
                        li.innerHTML = `
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-gray-800 dark:text-gray-200">都合の悪い人 (${notAvailableUsers.length}人)</span>
                                <span class="text-sm text-gray-500 dark:text-gray-400">${notAvailableUsers.map(user => user.name).join(', ')}</span>
                            </div>
                        `;
                        resultsDisplayElement.appendChild(li);
                    }
                }
            } else {
                votedUsers.forEach(user => {
                    const li = document.createElement('li');
                    li.className = 'p-2 border-b border-gray-200 dark:border-gray-700';
                    li.innerHTML = `
                        <span class="font-bold text-gray-800 dark:text-gray-200">${user.name}</span>
                        <span class="text-gray-500 dark:text-gray-400">さんが投票済み</span>
                    `;
                    votedUsersListElement.appendChild(li);
                });
            }
        };
        
        const handleScheduleCreation = async (e, type) => {
            e.preventDefault();

            if (!user || user.isAnonymous) {
                alert('ログインしてから作成してください。');
                return;
            }

            const multipleSelectionCheckbox = document.getElementById(`${type === 'date' ? 'date-multiple-selection-checkbox' : 'time-multiple-selection-checkbox'}`);
            const isMultipleSelection = multipleSelectionCheckbox ? multipleSelectionCheckbox.checked : true;

            const titleElement = document.getElementById(`${type === 'date' ? 'schedule-title' : 'time-schedule-title'}`);
            const descriptionElement = document.getElementById(`${type === 'date' ? 'schedule-description' : 'time-schedule-description'}`);
            const deadlineElement = document.getElementById(`${type === 'date' ? 'vote-deadline' : 'time-vote-deadline'}`);

            if (!titleElement || !descriptionElement || !deadlineElement) {
                alert('フォーム要素が見つかりません。');
                return;
            }

            const title = titleElement.value;
            const description = descriptionElement.value;
            const deadline = deadlineElement.value;

            let scheduleData;
            
            if (type === 'date') {
                if (!title || selectedDates.size === 0) {
                    alert(translations[currentLang].createDateH2 === '日にちで日程調整を作成' ? 'タイトルと候補日を一つ以上選択してください。' : 'Please select a title and at least one date.');
                    return;
                }
                scheduleData = {
                    title, description, deadline, dates: Array.from(selectedDates), votedUsers: [], createdBy: user.uid, type: 'date', selectionType: isMultipleSelection ? 'multiple' : 'single'
                };
            } else {
                const dateElement = document.getElementById('time-schedule-date');
                const date = dateElement ? dateElement.value : '';
                
                if (!title || selectedTimeSlots.size === 0 || !date) {
                    alert(translations[currentLang].createTimeH2 === '時間帯で日程調整を作成' ? 'タイトル、日程日、そして候補時間を一つ以上選択してください。' : 'Please select a title, a date, and at least one time slot.');
                    return;
                }
                scheduleData = {
                    title, description, deadline, date, timeSlots: Array.from(selectedTimeSlots), votedUsers: [], createdBy: user.uid, type: 'time', selectionType: isMultipleSelection ? 'multiple' : 'single'
                };
            }
        
            const schedulesRef = collection(db, "schedules");
            const newDocRef = doc(schedulesRef);
            const lowerCaseId = newDocRef.id.toLowerCase();
            await setDoc(doc(db, "schedules", lowerCaseId), scheduleData);
            const votingUrl = `voting-page.html?id=${lowerCaseId}`; 
            document.getElementById('share-url').textContent = `${window.location.origin}/${votingUrl}`;
            showSection('creation-complete-section');
        };

    // ★★★ ページ判定ロジックの再構築 ★★★
    if (myPageSection) { // 👈 修正: my-page.htmlの場合
        // my-page.html 専用のロジック
        showSection('my-page-section');
        
        const loginPrompt = document.getElementById('login-prompt-container');
        const actualContent = document.getElementById('actual-my-page-content');
        
        if (user && !user.isAnonymous) {
            // ログイン済みの場合
            if (loginPrompt) loginPrompt.classList.add('hidden');
            if (actualContent) actualContent.classList.remove('hidden');

            const q = query(collection(db, "schedules"), where("createdBy", "==", user.uid));
            try {
                const querySnapshot = await getDocs(q); 
                const schedules = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
                
                const mySchedulesListLocal = document.getElementById('my-schedules-list'); 
                renderMySchedules(schedules, mySchedulesListLocal); 

            } catch (error) {
                console.error("Error fetching documents on my-page: ", error);
                const mySchedulesListLocal = document.getElementById('my-schedules-list'); 
                if (mySchedulesListLocal) { 
                    mySchedulesListLocal.innerHTML = '<p class="text-red-500">アンケートの取得中にエラーが発生しました。</p>';
                }
            }
        } else {
            // 未ログインの場合
            if (loginPrompt) loginPrompt.classList.remove('hidden');
            if (actualContent) actualContent.classList.add('hidden');
        }
        
    } else if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        showSection('home-section');

        if (createDateButton) {
            createDateButton.addEventListener('click', () => {
                showSection('create-date-section');
                const multipleSelectionCheckbox = document.getElementById('date-multiple-selection-checkbox');
                const isMultipleSelection = multipleSelectionCheckbox ? multipleSelectionCheckbox.checked : true;
                renderCalendar(calendarContainer, currentMonth, currentYear, true, [], isMultipleSelection);
            });
        }
        
        if (createTimeButton) {
            createTimeButton.addEventListener('click', () => {
                showSection('create-time-section');
                const multipleSelectionCheckbox = document.getElementById('time-multiple-selection-checkbox');
                const isMultipleSelection = multipleSelectionCheckbox ? multipleSelectionCheckbox.checked : true;
                generateTimeSlots(timeSlotsContainer, true, [], isMultipleSelection);
            });
        }
        
        // PC用ボタンのイベントリスナー
        // --- 🔽 修正: howToUseLinkPC のリスナーを変更 🔽 ---
        if (howToUseLinkPC) howToUseLinkPC.addEventListener('click', handleHowToUseToggle);
        // --- 🔼 修正ここまで 🔼 ---
        if (loginLinkPC) loginLinkPC.addEventListener('click', () => showSection('login-section'));
        if (backToHomeButtonPC) backToHomeButtonPC.addEventListener('click', () => window.location.href = 'index.html');
        if (logoutLinkPC) logoutLinkPC.addEventListener('click', handleLogout);
        if (langTogglePC) langTogglePC.addEventListener('click', handleLangToggle);
        if (themeTogglePC) themeTogglePC.addEventListener('click', handleThemeToggle);

        // スマホ用ボタンのイベントリスナー
        // --- 🔽 修正: howToUseLinkMobile のリスナーを追加 🔽 ---
        if (howToUseLinkMobile) howToUseLinkMobile.addEventListener('click', handleHowToUseToggle);
        // --- 🔼 修正ここまで 🔼 ---
        if (loginLinkMobile) loginLinkMobile.addEventListener('click', () => showSection('login-section'));
        if (backToHomeButtonMobile) backToHomeButtonMobile.addEventListener('click', () => window.location.href = 'index.html');
        if (logoutLinkMobile) logoutLinkMobile.addEventListener('click', handleLogout); 
        if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);
        if (themeToggleMobile) themeToggleMobile.addEventListener('click', handleThemeToggle);


        if (dateScheduleForm) {
            dateScheduleForm.addEventListener('submit', async (e) => {
                await handleScheduleCreation(e, 'date');
            });
        }
        
        if (timeScheduleForm) {
            timeScheduleForm.addEventListener('submit', async (e) => {
                await handleScheduleCreation(e, 'time');
            });
        }

        if (copyUrlButton) {
            copyUrlButton.addEventListener('click', () => {
                const urlText = shareUrlElement.textContent;
                navigator.clipboard.writeText(urlText).then(() => {
                    alert('URLがクリップボードにコピーされました！');
                }).catch(err => {
                    console.error('URLコピーに失敗しました', err);
                });
            });
        }
    } else if (normalizedScheduleId) {
        showSection('voting-page-section');
        const scheduleRef = doc(db, "schedules", normalizedScheduleId);

        onSnapshot(scheduleRef, (docSnap) => {
            if (docSnap.exists()) {
                const createdSchedule = docSnap.data();
                const deadline = new Date(createdSchedule.deadline);
                const now = new Date();
                const isClosed = now > deadline;
                const isMultipleSelection = createdSchedule.selectionType === 'multiple';

                let currentUserVote = null;
                let voterName = '';

                if (user && !user.isAnonymous) {
                    voterName = user.displayName || user.email;
                    currentUserVote = createdSchedule.votedUsers.find(vote => vote.name === voterName);
                }

                if (isClosed) {
                    document.getElementById('voting-results-title').textContent = createdSchedule.title;
                    document.getElementById('voting-results-description').textContent = createdSchedule.description;

                    showSection('voting-results-section');

                    const candidates = createdSchedule.type === 'date' ? createdSchedule.dates : createdSchedule.timeSlots;
                    updateVotedUsersList(createdSchedule.votedUsers, candidates, true);

                    return; 
                } else {
                    document.getElementById('voting-title').textContent = createdSchedule.title;
                    document.getElementById('voting-description').textContent = createdSchedule.description;
                    showSection('voting-page-section');

                    if (currentUserVote && currentUserVote.voteData.status === 'available') {
                        if (createdSchedule.type === 'date') {
                            selectedDates = new Set(currentUserVote.voteData.votes);
                         } else if (createdSchedule.type === 'time') {
                            selectedTimeSlots = new Set(currentUserVote.voteData.votes);
                        }
                    }

                    const voterNameInput = document.getElementById('voter-name');
                    if (user && !user.isAnonymous && voterNameInput) {
                       voterNameInput.value = voterName;
                       voterNameInput.readOnly = true;
                    }

                    if (createdSchedule.type === 'date') {
                        if(votingTimeSlotsContainer) votingTimeSlotsContainer.classList.add('hidden');
                        if(votingTimeH3) votingTimeH3.classList.add('hidden');
                        if(votingCalendarContainer) votingCalendarContainer.classList.remove('hidden');
                        renderCalendar(votingCalendarContainer, currentMonth, currentYear, false, createdSchedule.dates, isMultipleSelection);
                    } else if (createdSchedule.type === 'time') {
                        if(votingCalendarContainer) votingCalendarContainer.classList.add('hidden');
                        if(votingDateH3) votingDateH3.classList.remove('hidden'); // 投票ページは日付選択のh3は常に表示なので、時間帯のときだけ表示するロジックを修正
                        if(votingTimeSlotsContainer) votingTimeSlotsContainer.classList.remove('hidden');
                        if(votingTimeH3) votingTimeH3.classList.remove('hidden');
                        generateTimeSlots(votingTimeSlotsContainer, false, createdSchedule.timeSlots, isMultipleSelection);
                    }

                    const candidates = createdSchedule.type === 'date' ? createdSchedule.dates : createdSchedule.timeSlots;
                    updateVotedUsersList(createdSchedule.votedUsers, candidates, false);
                }
            } else {
                console.error("No such document!");
                window.location.href = "index.html";
            }
        });

        if (submitVoteButton) {
            submitVoteButton.addEventListener('click', async () => {
                const voterName = document.getElementById('voter-name').value;
                const isNotAvailable = notAvailableCheckbox ? notAvailableCheckbox.checked : false;
                const docSnap = await getDoc(scheduleRef);
                const currentSchedule = docSnap.data();
                const isDateSchedule = currentSchedule.type === 'date';
                const votes = isDateSchedule ? selectedDates : selectedTimeSlots;

                if (!voterName) {
                    alert(translations[currentLang].voterNameLabel === 'お名前' ? 'お名前を入力してください。' : 'Please enter your name.');
                    return;
                }

                if (!isNotAvailable && votes.size === 0) {
                    alert(translations[currentLang].notAvailableLabel === '都合の良い日がない' ? '候補を一つ以上選択するか、「都合の良い日がない」にチェックを入れてください。' : 'Please select at least one candidate or check the "Not available" box.');
                    return;
                }

                const existingVoteIndex = currentSchedule.votedUsers.findIndex(vote => vote.name === voterName);
                let voteData;
                if (isNotAvailable) {
                    voteData = {
                        status: 'not-available',
                        comment: notAvailableComment ? notAvailableComment.value || '' : ''
                    };
                } else {
                    voteData = {
                        status: 'available',
                        votes: Array.from(votes)
                    };
                }

                const updatedVotedUsers = [...currentSchedule.votedUsers];
                if (existingVoteIndex !== -1) {
                    updatedVotedUsers[existingVoteIndex].voteData = voteData;
                } else {
                    updatedVotedUsers.push({ name: voterName, voteData: voteData });
                }

                await updateDoc(scheduleRef, { votedUsers: updatedVotedUsers });

                votes.clear();
                document.getElementById('voter-name').value = '';
                if (notAvailableCheckbox) notAvailableCheckbox.checked = false;
                if (notAvailableCommentContainer) notAvailableCommentContainer.classList.add('hidden');
                
                alert(translations[currentLang].submitVoteButton === '投票する' ? '投票が完了しました！' : 'Voting is complete!');
            });
        }

        if (notAvailableCheckbox) {
            notAvailableCheckbox.addEventListener('change', () => {
                if (notAvailableCheckbox.checked) {
                    notAvailableCommentContainer.classList.remove('hidden');
                    selectedDates.clear();
                    selectedTimeSlots.clear();
                    const selectedElements = document.querySelectorAll('.calendar-day.selected, .time-slot.selected');
                    selectedElements.forEach(el => el.classList.remove('selected'));
                } else {
                    notAvailableCommentContainer.classList.add('hidden');
                }
            });
        }
    } 
}
document.addEventListener('DOMContentLoaded', async () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuContent = document.getElementById('mobile-menu-content');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    // 言語切り替えボタンのイベントリスナー
    const langTogglePC = document.getElementById('lang-toggle-pc');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    // ページロード時にテーマを適用
    const themeTogglePC = document.getElementById('theme-toggle-pc');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    const toggleMobileMenu = () => {
        if (mobileMenuContent && mobileMenuOverlay) {
            mobileMenuContent.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        }
    };
    
    // 初回ロード時に言語を適用し、コンテンツを更新
    updateContent(currentLang); 
    
    applyTheme(themeTogglePC);
    applyTheme(themeToggleMobile);

    if (mobileMenuButton) {mobileMenuButton.addEventListener('click', toggleMobileMenu);}
    if (mobileMenuOverlay) {mobileMenuOverlay.addEventListener('click', toggleMobileMenu);}

    document.querySelectorAll('#mobile-menu-content a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuContent.classList.contains('active')) {
                toggleMobileMenu();
            }
        })
    });

    if (langTogglePC) langTogglePC.addEventListener('click', handleLangToggle);
    if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);

    if (themeTogglePC) themeTogglePC.addEventListener('click', handleThemeToggle);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', handleThemeToggle);

    onAuthStateChanged(auth, (user) => {
        const updateHeader = (user) => {
            const userIconContainerPC = document.getElementById('user-icon-container-pc');
            const loginLinkPC = document.getElementById('login-link-pc');
            const mySchedulesLinkPC = document.getElementById('my-schedules-link-pc');
            const logoutLinkPC = document.getElementById('logout-link-pc');

            if (userIconContainerPC) {
                if (user && !user.isAnonymous) {
                    const photoURL = user.photoURL || 'https://via.placeholder.com/32';
                    userIconContainerPC.innerHTML = `<img src="${photoURL}" alt="User" class="w-full h-full rounded-full object-cover">`;
                    if (loginLinkPC) loginLinkPC.classList.add('hidden');
                    if (mySchedulesLinkPC) mySchedulesLinkPC.classList.remove('hidden');
                    if (logoutLinkPC) logoutLinkPC.classList.remove('hidden');
                } else {
                    userIconContainerPC.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    `;
                    if (loginLinkPC) loginLinkPC.classList.remove('hidden');
                    if (mySchedulesLinkPC) mySchedulesLinkPC.classList.add('hidden');
                    if (logoutLinkPC) logoutLinkPC.classList.add('hidden');
                }
            }

            // スマホ用
            const userIconContainerMobile = document.getElementById('user-icon-container-mobile');
            const loginLinkMobile = document.getElementById('login-link-mobile');
            const mySchedulesLinkMobile = document.getElementById('my-schedules-link-mobile');
            const logoutLinkMobile = document.getElementById('logout-link-mobile');
            
            if (userIconContainerMobile) {
                if (user && !user.isAnonymous) {
                    const photoURL = user.photoURL || 'https://via.placeholder.com/32';
                    userIconContainerMobile.innerHTML = `<img src="${photoURL}" alt="User" class="w-full h-full rounded-full object-cover">`;
                    if (loginLinkMobile) loginLinkMobile.classList.add('hidden');
                    if (mySchedulesLinkMobile) mySchedulesLinkMobile.classList.remove('hidden');
                    if (logoutLinkMobile) logoutLinkMobile.classList.remove('hidden');
                } else {
                    if (loginLinkMobile) loginLinkMobile.classList.remove('hidden');
                    if (mySchedulesLinkMobile) mySchedulesLinkMobile.classList.add('hidden');
                    if (logoutLinkMobile) logoutLinkMobile.classList.add('hidden');
                }
            }
        }
        updateHeader(user);
        mainAppLogic(user);
    });
});