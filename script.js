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

// --- 翻訳キーを追加 ---
const translations = {
    ja: {
        appTitle: '日程調整3',
        howToUse: '使い方',
        login: 'ログイン/登録',
        lang: 'JP / EN',
        mySchedules: 'マイアンケート',
        logout: 'ログアウト',
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
        pollCardTitle: '一般投票で調整',
        pollCardDesc: '「A案」「B案」など、自由な選択肢で投票を作成します。',
        createPollButton: '一般投票で作成',
        createDateH2: '日にちで日程調整を作成',
        createTimeH2: '時間帯で日程調整を作成',
        createPollH2: '一般投票を作成',
        titleLabel: 'タイトル',
        titlePlaceholder: '例：チームランチの日程調整',
        descLabel: '説明',
        descPlaceholder: '例：チームランチの候補日を決めたいです。',
        deadlineLabel: '投票期限',
        datesLabel: '候補日を選択',
        timeSlotsLabel: '候補時間帯を選択',
        pollOptionsLabel: '投票の選択肢',
        addOptionButton: '+ 選択肢を追加',
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
        step3Bullet2: '都合の良い日にち、時間帯、または選択肢を複数選択します。',
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
        voteTimeH3: '候補時間帯を選択',
        votePollH3: '選択肢',
        voterNameLabel: 'お名前',
        voterNamePlaceholder: '例：山田太郎',
        notAvailableLabel: '都合の良い日がない',
        commentLabel: 'コメント',
        commentPlaceholder: '例：月末であれば可能です。',
        submitVoteButton: '投票する',
        votedStatusH3: '投票状況',
        daysOfWeek: ['日', '月', '火', '水', '木', '金', '土']
    },
    en: {
        appTitle: 'Schedule 3',
        howToUse: 'How to use',
        login: 'Login / Sign up',
        lang: 'EN / JP',
        mySchedules: 'My Schedules',
        logout: 'Logout',
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
        pollCardTitle: 'General Poll',
        pollCardDesc: 'Create a poll with custom options like "Option A", "Option B".',
        createPollButton: 'Create Poll',
        createDateH2: 'Create a schedule by date',
        createTimeH2: 'Create a schedule by time',
        createPollH2: 'Create a General Poll',
        titleLabel: 'Title',
        titlePlaceholder: 'e.g., Team Lunch Schedule',
        descLabel: 'Description',
        descPlaceholder: 'e.g., Let\'s decide the dates for our team lunch.',
        deadlineLabel: 'Voting Deadline',
        datesLabel: 'Select candidate dates',
        timeSlotsLabel: 'Select candidate time slots',
        pollOptionsLabel: 'Poll Options',
        addOptionButton: '+ Add Option',
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
        step3Bullet2: 'Select one or more convenient dates, time slots, or options.',
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
        voteTimeH3: 'Select candidate time slots',
        votePollH3: 'Options',
        voterNameLabel: 'Your Name',
        voterNamePlaceholder: 'e.g., John Doe',
        notAvailableLabel: 'Not available on any of the dates',
        commentLabel: 'Comment',
        commentPlaceholder: 'e.g., I am available at the end of the month.',
        submitVoteButton: 'Vote',
        votedStatusH3: 'Voting Status',
        daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
};

const updateContent = (lang) => {
    const text = translations[lang];
    const elements = [
        { id: 'logo-text-pc', prop: 'textContent', value: text.appTitle },
        { id: 'logo-text-mobile', prop: 'textContent', value: text.appTitle },
        { id: 'how-to-use-link-pc', prop: 'textContent', value: text.howToUse },
        { id: 'login-link-pc', prop: 'textContent', value: text.login },
        { id: 'lang-text-pc', prop: 'textContent', value: text.lang },
        { id: 'how-to-use-link-mobile', prop: 'textContent', value: text.howToUse },
        { id: 'login-link-mobile', prop: 'textContent', value: text.login },
        { id: 'lang-text-mobile', prop: 'textContent', value: text.lang },
        { id: 'my-schedules-link-pc', prop: 'textContent', value: text.mySchedules },
        { id: 'logout-link-pc', prop: 'textContent', value: text.logout },
        { id: 'my-schedules-link-mobile', prop: 'textContent', value: text.mySchedules },
        { id: 'logout-link-mobile', prop: 'textContent', value: text.logout },
        { id: 'hero-title', prop: 'textContent', value: text.heroTitle },
        { id: 'home-subtitle', prop: 'textContent', value: text.homeSubtitle },
        { id: 'date-card-title', prop: 'textContent', value: text.dateCardTitle },
        { id: 'date-card-desc', prop: 'textContent', value: text.dateCardDesc },
        { id: 'create-date-button', prop: 'textContent', value: text.dateCardButton },
        { id: 'date-card-note', prop: 'textContent', value: text.dateCardNote },
        { id: 'time-card-title', prop: 'textContent', value: text.timeCardTitle },
        { id: 'time-card-desc', prop: 'textContent', value: text.timeCardDesc },
        { id: 'create-time-button', prop: 'textContent', value: text.timeCardButton },
        { id: 'time-card-note', prop: 'textContent', value: text.timeCardNote },
        { id: 'poll-card-title', prop: 'textContent', value: text.pollCardTitle },
        { id: 'poll-card-desc', prop: 'textContent', value: text.pollCardDesc },
        { id: 'create-poll-button', prop: 'textContent', value: text.createPollButton },
    ];

    elements.forEach(el => {
        const element = document.getElementById(el.id);
        if (element) {
            element[el.prop] = el.value;
        }
    });

    const sections = ['home-section', 'how-to-use-section', 'login-section', 'create-date-section', 'create-time-section', 'create-poll-section', 'voting-page-section', 'voting-results-section', 'my-page-section'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const h2 = section.querySelector('h2');
            if (h2) {
                if (sectionId === 'how-to-use-section') h2.textContent = text.howToUseH2;
                if (sectionId === 'login-section') h2.textContent = text.loginH2;
                if (sectionId === 'create-date-section') h2.textContent = text.createDateH2;
                if (sectionId === 'create-time-section') h2.textContent = text.createTimeH2;
                if (sectionId === 'create-poll-section') h2.textContent = text.createPollH2;
                if (sectionId === 'voting-page-section') {
                     const votingTitle = document.getElementById('voting-title');
                     if(votingTitle) votingTitle.textContent = text.voteH2;
                }
                if (sectionId === 'voting-results-section') h2.textContent = text.resultsH2;
                if (sectionId === 'my-page-section') {
                    const myPageH2 = section.querySelector('#my-page-content-wrapper h2');
                    if (myPageH2) myPageH2.textContent = text.mySchedules || 'マイアンケート'; 
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

            if (sectionId === 'create-date-section' || sectionId === 'create-time-section' || sectionId === 'create-poll-section') {
                const typePrefix = sectionId.split('-')[1]; // 'date', 'time', 'poll'
                
                const titleLabel = document.querySelector(`#${sectionId} label[for^="${typePrefix}-schedule-title"]`);
                if (titleLabel) titleLabel.textContent = text.titleLabel;
                
                const scheduleTitle = document.querySelector(`#${sectionId} input[name^="${typePrefix}-schedule-title"]`);
                if (scheduleTitle) scheduleTitle.placeholder = text.titlePlaceholder;
                
                const descLabel = document.querySelector(`#${sectionId} label[for^="${typePrefix}-schedule-description"]`);
                if (descLabel) descLabel.textContent = text.descLabel;
                
                const scheduleDescription = document.querySelector(`#${sectionId} textarea[name^="${typePrefix}-schedule-description"]`);
                if (scheduleDescription) scheduleDescription.placeholder = text.descPlaceholder;
                
                const deadlineLabel = document.querySelector(`#${sectionId} label[for^="${typePrefix}-vote-deadline"]`);
                if (deadlineLabel) deadlineLabel.textContent = text.deadlineLabel;
                
                const createSubmitButton = document.querySelector(`#${sectionId} button[type="submit"]`);
                if (createSubmitButton) createSubmitButton.textContent = text.createButton;

                // 各セクション固有のラベル
                if (sectionId === 'create-date-section') {
                    const datesLabel = document.querySelector(`#${sectionId} h3`);
                    if (datesLabel) datesLabel.textContent = text.datesLabel;
                }
                if (sectionId === 'create-time-section') {
                    const timeSlotsLabel = document.querySelector(`#${sectionId} h3`);
                    if (timeSlotsLabel) timeSlotsLabel.textContent = text.timeSlotsLabel;
                }
                if (sectionId === 'create-poll-section') {
                    const pollOptionsLabel = document.querySelector(`#${sectionId} h3`);
                    if (pollOptionsLabel) pollOptionsLabel.textContent = text.pollOptionsLabel;
                    const addOptionButton = document.getElementById('add-poll-option-button');
                    if (addOptionButton) addOptionButton.textContent = text.addOptionButton;
                }
            }

            if (sectionId === 'voting-page-section') {
                const votingDateH3 = document.getElementById('voting-date-h3');
                if (votingDateH3) votingDateH3.textContent = text.voteDateH3;
                const votingTimeH3 = document.getElementById('voting-time-h3');
                if (votingTimeH3) votingTimeH3.textContent = text.voteTimeH3;
                const votingPollH3 = document.getElementById('voting-poll-h3');
                if (votingPollH3) votingPollH3.textContent = text.votePollH3;

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
                
                const registerButtonTextElement = document.getElementById('register-button'); 
                if (registerButtonTextElement) registerButtonTextElement.textContent = text.registerButtonText;

                const orSeparator = document.getElementById('or-separator');
                if (orSeparator) orSeparator.textContent = text.orSeparator;
                
                const googleLoginText = document.getElementById('google-login-text');
                if (googleLoginText) googleLoginText.textContent = text.googleLoginText;
            }
        }
    });
};

const toggleMobileMenu = () => {
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
    const calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer && !calendarContainer.classList.contains('hidden')) {
        renderCalendar(calendarContainer, currentMonth, currentYear, true, [], true); 
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

// --- ヘッダー更新関数 ---
const updateHeader = (user) => {
    // PC用要素の取得
    const userIconContainerPC = document.getElementById('user-icon-container-pc');
    const loginLinkPC = document.getElementById('login-link-pc');
    const mySchedulesLinkPC = document.getElementById('my-schedules-link-pc');
    const logoutLinkPC = document.getElementById('logout-link-pc');

    // スマホ用要素の取得
    const userIconContainerMobile = document.getElementById('user-icon-container-mobile');
    const loginLinkMobile = document.getElementById('login-link-mobile');
    const mySchedulesLinkMobile = document.getElementById('my-schedules-link-mobile');
    const logoutLinkMobile = document.getElementById('logout-link-mobile');

    // PC用
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
    if (userIconContainerMobile) {
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


const mainAppLogic = async(user) => {
    
    const urlParams = new URLSearchParams(window.location.search);
    
    let scheduleId = urlParams.get('id'); 
        
        if (!scheduleId) {
            const pathSegments = window.location.pathname.split('/').filter(segment => segment.length > 0);
            if (pathSegments.length > 0) {
                const lastSegment = pathSegments[pathSegments.length - 1];
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
        const createPollSection = document.getElementById('create-poll-section');
        const creationCompleteSection = document.getElementById('creation-complete-section');
        const votingPageSection = document.getElementById('voting-page-section');
        const votingResultsSection = document.getElementById('voting-results-section');
        const myPageSection = document.getElementById('my-page-section');
        const createDateButton = document.getElementById('create-date-button');
        const createTimeButton = document.getElementById('create-time-button');
        const createPollButton = document.getElementById('create-poll-button');
        
        const howToUseLinkPC = document.getElementById('how-to-use-link-pc');
        const loginLinkPC = document.getElementById('login-link-pc');
        const mySchedulesLinkPC = document.getElementById('my-schedules-link-pc');
        const logoutLinkPC = document.getElementById('logout-link-pc');
        const userIconContainerPC = document.getElementById('user-icon-container-pc');
        
        const howToUseLinkMobile = document.getElementById('how-to-use-link-mobile');
        const loginLinkMobile = document.getElementById('login-link-mobile');
        const mySchedulesLinkMobile = document.getElementById('my-schedules-link-mobile');
        const logoutLinkMobile = document.getElementById('logout-link-mobile');
        const userIconContainerMobile = document.getElementById('user-icon-container-mobile');

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
        const votingPollOptionsContainer = document.getElementById('voting-poll-options-container');
        const votingTimeH3 = document.getElementById('voting-time-h3');
        const votingPollH3 = document.getElementById('voting-poll-h3');
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
        const pollScheduleForm = document.getElementById('poll-schedule-form');
        const votingDateH3 = document.getElementById('voting-date-h3');
        const googleLoginButton = document.getElementById('google-login-button');
        const emailLoginForm = document.getElementById('email-login-form');
        const registerButton = document.getElementById('register-button');

        let isHowToUseVisible = false;
        let selectedDates = new Set(); // 'date' と 'poll' で共用
        let selectedTimeSlots = new Set();
        const today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
        if (bulkDeleteBtn && !bulkDeleteBtn.hasListener) {
            bulkDeleteBtn.onclick = () => {
                const selectedIds = Array.from(document.querySelectorAll('.schedule-checkbox:checked'))
                .map(cb => cb.dataset.id);
                bulkDeleteSchedules(selectedIds);
            };
            bulkDeleteBtn.hasListener = true; 
        }

        const renderMySchedules = (schedules, listElement) => {
            if (!listElement) return;

            listElement.innerHTML = '';

            if (schedules.length === 0) {
                listElement.innerHTML = '<p class="text-gray-500 dark:text-gray-400 p-4">作成したアンケートはありません。</p>';
                return;
            }

            schedules.forEach(item => {
                const schedule = item.data;
                const scheduleId = item.id;
                const listItem = document.createElement('div');
                
                listItem.className = 'bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0';
                
                let scheduleTypeLabel = '';
                if (schedule.type === 'date') {
                    scheduleTypeLabel = '日にち調整';
                } else if (schedule.type === 'time') {
                    scheduleTypeLabel = '時間帯調整';
                } else if (schedule.type === 'poll') {
                    scheduleTypeLabel = '一般投票';
                }

                listItem.innerHTML = `
                     <div class="flex items-center space-x-3 w-full sm:w-auto">
                         <input type="checkbox" data-id="${scheduleId}" class="schedule-checkbox h-5 w-5 text-blue-600 dark:bg-gray-600 dark:border-gray-500 rounded focus:ring-blue-500">
                         
                         <div class="flex flex-col">
                            <span class="font-bold text-lg dark:text-white">${schedule.title}</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">${scheduleTypeLabel} / 期限: ${new Date(schedule.deadline).toLocaleDateString()}</span>
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
            const deleteButtons = document.querySelectorAll('.delete-schedule-btn');
            const schedulesCheckboxes = document.querySelectorAll('#my-schedules-list .schedule-checkbox'); 
            
            deleteButtons.forEach(button => {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                newButton.addEventListener('click', (e) => {
                    const scheduleIdToDelete = e.currentTarget.dataset.id;
                    deleteSchedule(scheduleIdToDelete);
                });
            });
            
            schedulesCheckboxes.forEach(cb => {
                const newCheckbox = cb.cloneNode(true);
                cb.parentNode.replaceChild(newCheckbox, cb);
                newCheckbox.addEventListener('change', updateBulkDeleteButton);
            });
        };


        const updateBulkDeleteButton = () => {
            const listElement = document.getElementById('my-schedules-list');
            if (!listElement) return 0;
            const checkboxes = listElement.querySelectorAll('.schedule-checkbox'); 

            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
            if (!bulkDeleteBtn) return;
            
            if (checkedCount > 0) {
                bulkDeleteBtn.classList.remove('hidden');
            } else {
                bulkDeleteBtn.classList.add('hidden');
            }
        };

        const bulkDeleteSchedules = async (selectedIds) => {
            if (selectedIds.length === 0) {
                alert("削除する日程調整を選択してください。"); 
                return;
            }

            if (!confirm(`本当に選択された ${selectedIds.length} 件の日程調整を削除してもよろしいですか？この操作は元に戻せません。`)) {
                return; 
            }
                
            try {
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

        // mainAppLogic 内の updateHeader は削除済み

        const handleLogout = async () => {
            await signOut(auth);
            alert("ログアウトしました。");
            window.location.href = 'index.html';
        };
        
        const showSection = (sectionId) => {
            const allSections = document.querySelectorAll('main#app-container > section');
            allSections.forEach(section => {
                if(section) section.classList.add('hidden');
            });
            const sectionToShow = document.getElementById(sectionId);
            if (sectionToShow) {
                sectionToShow.classList.remove('hidden');
            }
            updateContent(currentLang);
        };

        const handleHowToUseToggle = (e) => {
            if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
                if(e) e.preventDefault(); 

                const howToUseSection = document.getElementById('how-to-use-section');
                
                if (howToUseSection) {
                    if (!howToUseSection.classList.contains('hidden')) {
                        showSection('home-section');
                    } else {
                        showSection('how-to-use-section');
                    }
                }
            } else {
                window.location.href = 'index.html#how-to-use-section';
            }
        };

        // --- 🔽 修正: renderCalendar に data-date 属性を追加 🔽 ---
        const renderCalendar = (container, month, year, selectable = true, allowedDates = [], isMultipleSelection = true) => {
            if (!container) return;
            container.innerHTML = '';
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - startDate.getDay());

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
                const dateString = date.toISOString().split('T')[0]; // dateString をここで定義
                dayElement.dataset.date = dateString; // data-date 属性を常に付与

                if (date.getMonth() !== month) {
                    dayElement.classList.add('inactive');
                } else if (selectable) {
                    dayElement.addEventListener('click', () => {
                        if (!isMultipleSelection) {
                            selectedDates.clear();
                            const allDays = container.querySelectorAll('.calendar-day.selected'); 
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
                } else { // selectable が false (投票ページ) の場合
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
                                const allDays = container.querySelectorAll('.selectable-date.selected'); // container 内で検索
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
        // --- 🔼 修正ここまで 🔼 ---

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

                timeSlotElement.addEventListener('click', () => {
                    if (selectable) {
                        if (!isMultipleSelection) {
                            selectedTimeSlots.clear();
                            const allSlots = container.querySelectorAll('.time-slot.selected'); // container 内で検索
                            allSlots.forEach(s => s.classList.remove('selected'));
                        }
                        if (selectedTimeSlots.has(timeText)) {
                            selectedTimeSlots.delete(timeText);
                            timeSlotElement.classList.remove('selected');
                        } else {
                            selectedTimeSlots.add(timeText);
                            timeSlotElement.classList.add('selected');
                        }
                    } else {
                        // 投票ページのロジック (not available チェック)
                        if (notAvailableCheckbox && notAvailableCheckbox.checked) {
                            notAvailableCheckbox.checked = false;
                            if (notAvailableCommentContainer) {
                                notAvailableCommentContainer.classList.add('hidden');
                            }
                        }
                        if (!isMultipleSelection) {
                            selectedTimeSlots.clear();
                            const allSlots = container.querySelectorAll('.time-slot.selected'); // container 内で検索
                            allSlots.forEach(s => s.classList.remove('selected'));
                        }

                        if (selectedTimeSlots.has(timeText)) {
                            selectedTimeSlots.delete(timeText);
                            timeSlotElement.classList.remove('selected');
                        } else {
                            selectedTimeSlots.add(timeText);
                            timeSlotElement.classList.add('selected');
                        }
                    }
                });

                if (selectable && selectedTimeSlots.has(timeText)) {
                    timeSlotElement.classList.add('selected');
                }
                // 投票ページでの初期選択状態の反映
                if (!selectable && allowedTimeSlots.includes(timeText)) {
                     if (selectedTimeSlots.has(timeText)) {
                        timeSlotElement.classList.add('selected');
                    }
                }
                
                container.appendChild(timeSlotElement);
            });
        };
        
        // PC用ボタンのイベントリスナー
        if (howToUseLinkPC) howToUseLinkPC.addEventListener('click', handleHowToUseToggle);
        if (loginLinkPC) loginLinkPC.addEventListener('click', () => showSection('login-section'));
        if (backToHomeButtonPC) backToHomeButtonPC.addEventListener('click', () => window.location.href = 'index.html');
        if (logoutLinkPC) logoutLinkPC.addEventListener('click', handleLogout);

        // スマホ用ボタンのイベントリスナー
        if (howToUseLinkMobile) howToUseLinkMobile.addEventListener('click', handleHowToUseToggle);
        if (loginLinkMobile) loginLinkMobile.addEventListener('click', () => showSection('login-section'));
        if (backToHomeButtonMobile) backToHomeButtonMobile.addEventListener('click', () => window.location.href = 'index.html');
        if (logoutLinkMobile) logoutLinkMobile.addEventListener('click', handleLogout);
        
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
                if (isResultsPage && resultsDisplayElement) {
                    resultsDisplayElement.innerHTML = `<p class="text-gray-500 p-4">${translations[currentLang].noVotes}</p>`;
                }
                return;
            }

            if (isResultsPage) {
                const voteCounts = {};
                let pollOptions = [];
                let totalVotes = 0; 

                if (candidates.type === 'poll') { 
                    pollOptions = candidates.options;
                    pollOptions.forEach(option => voteCounts[option] = { votes: 0, voters: [] });
                } else { 
                    candidates.forEach(candidate => voteCounts[candidate] = { votes: 0, voters: [] });
                    pollOptions = candidates; 
                }

                votedUsers.forEach(user => {
                    if (user.voteData.status === 'available' && Array.isArray(user.voteData.votes)) {
                        user.voteData.votes.forEach(vote => {
                            if (voteCounts[vote]) {
                                voteCounts[vote].votes++;
                                voteCounts[vote].voters.push(user.name);
                                totalVotes++;
                            }
                        });
                    }
                });

                const notAvailableUsers = votedUsers.filter(user => user.voteData.status === 'not-available');
                
                const sortedCandidates = (candidates.type === 'poll') 
                                         ? pollOptions 
                                         : Object.keys(voteCounts).sort(); 

                if (resultsDisplayElement) {
                    resultsDisplayElement.innerHTML = '';
                    
                    if (candidates.type === 'poll') {
                        const maxVotes = Math.max(...Object.values(voteCounts).map(v => v.votes), 1); 
                        
                        sortedCandidates.forEach(candidate => {
                            const count = voteCounts[candidate].votes;
                            const voters = voteCounts[candidate].voters;
                            const percentage = (count / maxVotes) * 100;

                            const li = document.createElement('li');
                            li.className = 'p-4 border-b border-gray-200 dark:border-gray-700 space-y-2';
                            
                            li.innerHTML = `
                                <div class="flex items-center justify-between font-bold text-gray-800 dark:text-gray-200">
                                    <span>${candidate}</span>
                                    <span>${count}票</span>
                                </div>
                                <div class="progress-bar w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div class="progress-bar-inner bg-blue-600 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                                </div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                    ${voters.join(', ')}
                                </div>
                            `;
                            resultsDisplayElement.appendChild(li);
                        });

                    } else { 
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
                    }
    
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
        
        // --- 🔽 修正: handleScheduleCreation で DOM から日付を取得 🔽 ---
        const handleScheduleCreation = async (e, type) => {
            e.preventDefault();

            if (!user || user.isAnonymous) {
                alert('ログインしてから作成してください。');
                return;
            }

            const multipleSelectionCheckbox = document.getElementById(`${type}-multiple-selection-checkbox`);
            const isMultipleSelection = multipleSelectionCheckbox ? multipleSelectionCheckbox.checked : true;

            const titleElement = document.getElementById(`${type}-schedule-title`);
            const descriptionElement = document.getElementById(`${type}-schedule-description`);
            const deadlineElement = document.getElementById(`${type}-vote-deadline`);

            if (!titleElement || !descriptionElement || !deadlineElement) {
                alert('フォーム要素が見つかりません。');
                return;
            }

            const title = titleElement.value;
            const description = descriptionElement.value;
            const deadline = deadlineElement.value;

            let scheduleData;
            
            if (type === 'date') {
                selectedDates.clear(); // 送信前に必ずクリア
                const selectedDaysElements = document.querySelectorAll('#calendar-container .calendar-day.selected');
                selectedDaysElements.forEach(el => {
                    if(el.dataset.date) {
                         selectedDates.add(el.dataset.date);
                    }
                });

                if (!title || selectedDates.size === 0) {
                    alert(translations[currentLang].createDateH2 === '日にちで日程調整を作成' ? 'タイトルと候補日を一つ以上選択してください。' : 'Please select a title and at least one date.');
                    return;
                }
                scheduleData = {
                    title, description, deadline, dates: Array.from(selectedDates), votedUsers: [], createdBy: user.uid, type: 'date', selectionType: isMultipleSelection ? 'multiple' : 'single'
                };
            } else if (type === 'time') {
                const dateElement = document.getElementById('time-schedule-date');
                const date = dateElement ? dateElement.value : '';
                
                // selectedTimeSlots は generateTimeSlots 内のクリックイベントで更新されている想定
                
                if (!title || selectedTimeSlots.size === 0 || !date) {
                    alert(translations[currentLang].createTimeH2 === '時間帯で日程調整を作成' ? 'タイトル、日程日、そして候補時間を一つ以上選択してください。' : 'Please select a title, a date, and at least one time slot.');
                    return;
                }
                scheduleData = {
                    title, description, deadline, date, timeSlots: Array.from(selectedTimeSlots), votedUsers: [], createdBy: user.uid, type: 'time', selectionType: isMultipleSelection ? 'multiple' : 'single'
                };
            } else if (type === 'poll') {
                const optionInputs = document.querySelectorAll('#poll-options-container .poll-option-input');
                const options = Array.from(optionInputs)
                                    .map(input => input.value.trim())
                                    .filter(value => value.length > 0); 

                if (!title || options.length < 2) { 
                    alert('タイトルと、2つ以上の選択肢を入力してください。');
                    return;
                }
                scheduleData = {
                    title, description, deadline, 
                    options: options, 
                    votedUsers: [], 
                    createdBy: user.uid, 
                    type: 'poll', 
                    selectionType: isMultipleSelection ? 'multiple' : 'single'
                };
            }
        
            const schedulesRef = collection(db, "schedules");
            const newDocRef = doc(schedulesRef);
            const lowerCaseId = newDocRef.id.toLowerCase();
            try {
                await setDoc(doc(db, "schedules", lowerCaseId), scheduleData);
                const votingUrl = `voting-page.html?id=${lowerCaseId}`; 
                if(shareUrlElement) shareUrlElement.textContent = `${window.location.origin}/${votingUrl}`;
                showSection('creation-complete-section');
                // 作成成功後に選択状態をリセット
                selectedDates.clear();
                selectedTimeSlots.clear();
                // フォームの入力内容もリセット (オプション)
                if (e.target instanceof HTMLFormElement) {
                    e.target.reset();
                }
                // 一般投票の選択肢もリセット
                if (type === 'poll') {
                     const pollOptionsContainer = document.getElementById('poll-options-container');
                     if (pollOptionsContainer) {
                         pollOptionsContainer.innerHTML = `
                             <input type="text" class="poll-option-input w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="選択肢 1">
                             <input type="text" class="poll-option-input w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="選択肢 2">
                         `;
                     }
                }

            } catch (error) {
                console.error("スケジュールの作成に失敗しました:", error);
                alert("スケジュールの作成に失敗しました。");
            }
        };
        // --- 🔼 修正ここまで 🔼 ---

    // ★★★ ページ判定ロジック ★★★
    if (myPageSection) { 
        showSection('my-page-section');
        
        const loginPrompt = document.getElementById('login-prompt-container');
        const actualContent = document.getElementById('actual-my-page-content');
        
        if (user && !user.isAnonymous) {
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
            if (loginPrompt) loginPrompt.classList.remove('hidden');
            if (actualContent) actualContent.classList.add('hidden');
        }
        
    } else if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        showSection('home-section');

        if (createDateButton) {
            createDateButton.addEventListener('click', () => {
                showSection('create-date-section');
                selectedDates.clear(); 
                const multipleSelectionCheckbox = document.getElementById('date-multiple-selection-checkbox');
                const isMultipleSelection = multipleSelectionCheckbox ? multipleSelectionCheckbox.checked : true;
                renderCalendar(calendarContainer, currentMonth, currentYear, true, [], isMultipleSelection);
            });
        }
        
        if (createTimeButton) {
            createTimeButton.addEventListener('click', () => {
                showSection('create-time-section');
                selectedTimeSlots.clear(); 
                const multipleSelectionCheckbox = document.getElementById('time-multiple-selection-checkbox');
                const isMultipleSelection = multipleSelectionCheckbox ? multipleSelectionCheckbox.checked : true;
                generateTimeSlots(timeSlotsContainer, true, [], isMultipleSelection);
            });
        }
        
        if (createPollButton) {
            createPollButton.addEventListener('click', () => {
                showSection('create-poll-section');
                 const pollOptionsContainer = document.getElementById('poll-options-container');
                 if (pollOptionsContainer) {
                     pollOptionsContainer.innerHTML = `
                         <input type="text" class="poll-option-input w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="選択肢 1">
                         <input type="text" class="poll-option-input w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="選択肢 2">
                     `;
                 }
            });
        }

        const addPollOptionButton = document.getElementById('add-poll-option-button');
        const pollOptionsContainer = document.getElementById('poll-options-container');

        if (addPollOptionButton && pollOptionsContainer) {
            addPollOptionButton.addEventListener('click', () => {
                const newOptionInput = document.createElement('input');
                newOptionInput.type = 'text';
                newOptionInput.className = 'poll-option-input w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600'; 
                newOptionInput.placeholder = `選択肢 ${pollOptionsContainer.children.length + 1}`;
                pollOptionsContainer.appendChild(newOptionInput);
            });
        }
        
        // イベントリスナー (言語・テーマ)
        if (langTogglePC) langTogglePC.addEventListener('click', handleLangToggle);
        if (themeTogglePC) themeTogglePC.addEventListener('click', handleThemeToggle);
        if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);
        if (themeToggleMobile) themeToggleMobile.addEventListener('click', handleThemeToggle);


        // フォーム送信
        if (dateScheduleForm) {
            dateScheduleForm.addEventListener('submit', (e) => handleScheduleCreation(e, 'date'));
        }
        if (timeScheduleForm) {
            timeScheduleForm.addEventListener('submit', (e) => handleScheduleCreation(e, 'time'));
        }
        if (pollScheduleForm) {
            pollScheduleForm.addEventListener('submit', (e) => handleScheduleCreation(e, 'poll'));
        }

        if (copyUrlButton) {
            copyUrlButton.addEventListener('click', () => {
                const urlText = shareUrlElement?.textContent;
                if(urlText) {
                    navigator.clipboard.writeText(urlText).then(() => {
                        alert('URLがクリップボードにコピーされました！');
                    }).catch(err => {
                        console.error('URLコピーに失敗しました', err);
                    });
                }
            });
        }
    } else if (normalizedScheduleId) {
        showSection('voting-page-section');
        const scheduleRef = doc(db, "schedules", normalizedScheduleId);

        onSnapshot(scheduleRef, (docSnap) => {
            if (docSnap.exists()) {
                const createdSchedule = docSnap.data();
                if (!createdSchedule) { 
                    console.error("Document data is empty!");
                    window.location.href = "index.html";
                    return;
                }
                
                const deadline = new Date(createdSchedule.deadline);
                const now = new Date();
                const isClosed = now > deadline;
                const isMultipleSelection = createdSchedule.selectionType === 'multiple';

                let currentUserVote = null;
                let voterName = '';

                if (user && !user.isAnonymous) {
                    voterName = user.displayName || user.email;
                    currentUserVote = (createdSchedule.votedUsers || []).find(vote => vote.name === voterName);
                }

                if (isClosed) {
                    if(document.getElementById('voting-results-title'))
                        document.getElementById('voting-results-title').textContent = createdSchedule.title;
                    if(document.getElementById('voting-results-description'))
                        document.getElementById('voting-results-description').textContent = createdSchedule.description;

                    showSection('voting-results-section');

                    let candidates;
                    if (createdSchedule.type === 'poll') {
                        candidates = { type: 'poll', options: createdSchedule.options || [] }; 
                    } else {
                        candidates = createdSchedule.type === 'date' ? (createdSchedule.dates || []) : (createdSchedule.timeSlots || []);
                    }
                    updateVotedUsersList(createdSchedule.votedUsers || [], candidates, true);

                    return; 
                } else {
                    if(document.getElementById('voting-title'))
                        document.getElementById('voting-title').textContent = createdSchedule.title;
                    if(document.getElementById('voting-description'))
                        document.getElementById('voting-description').textContent = createdSchedule.description;
                    showSection('voting-page-section');

                    selectedDates.clear(); 
                    selectedTimeSlots.clear(); 

                    if (currentUserVote && currentUserVote.voteData.status === 'available') {
                        if (createdSchedule.type === 'date' || createdSchedule.type === 'poll') {
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
                        if(votingPollOptionsContainer) votingPollOptionsContainer.classList.add('hidden'); 
                        if(votingPollH3) votingPollH3.classList.add('hidden'); 
                        if(votingCalendarContainer) votingCalendarContainer.classList.remove('hidden');
                        if(votingDateH3) votingDateH3.classList.remove('hidden');
                        renderCalendar(votingCalendarContainer, currentMonth, currentYear, false, createdSchedule.dates || [], isMultipleSelection);
                    } else if (createdSchedule.type === 'time') {
                        if(votingCalendarContainer) votingCalendarContainer.classList.add('hidden');
                        if(votingDateH3) votingDateH3.classList.add('hidden'); 
                        if(votingPollOptionsContainer) votingPollOptionsContainer.classList.add('hidden'); 
                        if(votingPollH3) votingPollH3.classList.add('hidden'); 
                        if(votingTimeSlotsContainer) votingTimeSlotsContainer.classList.remove('hidden');
                        if(votingTimeH3) votingTimeH3.classList.remove('hidden');
                        generateTimeSlots(votingTimeSlotsContainer, false, createdSchedule.timeSlots || [], isMultipleSelection);
                    } else if (createdSchedule.type === 'poll') {
                        if(votingCalendarContainer) votingCalendarContainer.classList.add('hidden');
                        if(votingDateH3) votingDateH3.classList.add('hidden');
                        if(votingTimeSlotsContainer) votingTimeSlotsContainer.classList.add('hidden');
                        if(votingTimeH3) votingTimeH3.classList.add('hidden');
                        
                        if(votingPollH3) votingPollH3.classList.remove('hidden');
                        if(votingPollOptionsContainer) {
                             votingPollOptionsContainer.classList.remove('hidden');
                             votingPollOptionsContainer.innerHTML = ''; // クリア
                        }

                        (createdSchedule.options || []).forEach(option => {
                            const optionElement = document.createElement('div');
                            optionElement.className = 'flex items-center space-x-3 p-3 border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer';
                            
                            const inputType = isMultipleSelection ? 'checkbox' : 'radio';
                            const inputId = `poll-option-${option.replace(/\s+/g, '-')}`; 

                            optionElement.innerHTML = `
                                <input type="${inputType}" id="${inputId}" name="poll-option" value="${option}" class="poll-vote-input rounded text-blue-500 h-5 w-5 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500">
                                <label for="${inputId}" class="text-gray-800 dark:text-gray-200 cursor-pointer w-full">${option}</label>
                            `;
                            if(votingPollOptionsContainer) votingPollOptionsContainer.appendChild(optionElement);

                            const inputElement = optionElement.querySelector('input');
                            if(!inputElement) return; 

                            if (selectedDates.has(option)) {
                                inputElement.checked = true;
                            }

                            optionElement.addEventListener('click', (e) => {
                                if (e.target !== inputElement) {
                                    if (isMultipleSelection) {
                                        inputElement.checked = !inputElement.checked;
                                    } else {
                                        inputElement.checked = true;
                                    }
                                }
                                
                                if (notAvailableCheckbox && notAvailableCheckbox.checked) notAvailableCheckbox.checked = false;
                                
                                const selectedOption = inputElement.value;
                                if (!isMultipleSelection) {
                                    selectedDates.clear(); 
                                    selectedDates.add(selectedOption);
                                    document.querySelectorAll('.poll-vote-input').forEach(radio => {
                                        if (radio !== inputElement) radio.checked = false;
                                    });
                                } else {
                                    if (inputElement.checked) {
                                        selectedDates.add(selectedOption);
                                    } else {
                                        selectedDates.delete(selectedOption);
                                    }
                                }
                            });
                        });
                    }

                    let candidates;
                    if (createdSchedule.type === 'poll') {
                        candidates = { type: 'poll', options: createdSchedule.options || [] };
                    } else {
                        candidates = createdSchedule.type === 'date' ? (createdSchedule.dates || []) : (createdSchedule.timeSlots || []);
                    }
                    updateVotedUsersList(createdSchedule.votedUsers || [], candidates, false);
                }
            } else {
                console.error("No such document!");
                window.location.href = "index.html";
            }
        });

        if (submitVoteButton) {
            submitVoteButton.addEventListener('click', async () => {
                const voterNameInput = document.getElementById('voter-name');
                const voterName = voterNameInput ? voterNameInput.value : '';
                const isNotAvailable = notAvailableCheckbox ? notAvailableCheckbox.checked : false;
                const docSnap = await getDoc(scheduleRef);
                
                if (!docSnap.exists()) {
                    alert("エラー：スケジュールが見つかりません。");
                    return;
                }
                
                const currentSchedule = docSnap.data();
                if (!currentSchedule) {
                     alert("エラー：スケジュールデータの読み込みに失敗しました。");
                    return;
                }
                
                const votes = (currentSchedule.type === 'date' || currentSchedule.type === 'poll') 
                                ? selectedDates 
                                : selectedTimeSlots;

                if (!voterName) {
                    alert(translations[currentLang].voterNameLabel === 'お名前' ? 'お名前を入力してください。' : 'Please enter your name.');
                    return;
                }

                if (!isNotAvailable && votes.size === 0) {
                    alert(translations[currentLang].notAvailableLabel === '都合の良い日がない' ? '候補を一つ以上選択するか、「都合の良い日がない」にチェックを入れてください。' : 'Please select at least one candidate or check the "Not available" box.');
                    return;
                }

                const existingVoteIndex = (currentSchedule.votedUsers || []).findIndex(vote => vote.name === voterName);
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

                const updatedVotedUsers = [...(currentSchedule.votedUsers || [])];
                if (existingVoteIndex !== -1) {
                    updatedVotedUsers[existingVoteIndex].voteData = voteData;
                } else {
                    updatedVotedUsers.push({ name: voterName, voteData: voteData });
                }

                await updateDoc(scheduleRef, { votedUsers: updatedVotedUsers });

                // 投票完了後に選択状態をリセット
                selectedDates.clear(); 
                selectedTimeSlots.clear(); 
                if (currentSchedule.type === 'poll') {
                    document.querySelectorAll('.poll-vote-input').forEach(input => input.checked = false);
                } else if (currentSchedule.type === 'time') {
                     document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
                } else if (currentSchedule.type === 'date') {
                     document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                }
                
                if (notAvailableCheckbox) notAvailableCheckbox.checked = false;
                if (notAvailableCommentContainer) notAvailableCommentContainer.classList.add('hidden');
                
                alert(translations[currentLang].submitVoteButton === '投票する' ? '投票が完了しました！' : 'Voting is complete!');
            });
        }

        if (notAvailableCheckbox) {
            notAvailableCheckbox.addEventListener('change', () => {
                if (notAvailableCheckbox.checked) {
                    if(notAvailableCommentContainer) notAvailableCommentContainer.classList.remove('hidden');
                    selectedDates.clear();
                    selectedTimeSlots.clear();
                    const selectedElements = document.querySelectorAll('.calendar-day.selected, .time-slot.selected');
                    selectedElements.forEach(el => el.classList.remove('selected'));
                    document.querySelectorAll('.poll-vote-input').forEach(input => input.checked = false);
                } else {
                    if(notAvailableCommentContainer) notAvailableCommentContainer.classList.add('hidden');
                }
            });
        }
    } 
}
document.addEventListener('DOMContentLoaded', async () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuContent = document.getElementById('mobile-menu-content');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const langTogglePC = document.getElementById('lang-toggle-pc');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    const themeTogglePC = document.getElementById('theme-toggle-pc');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    const toggleMobileMenu = () => {
        if (mobileMenuContent && mobileMenuOverlay) {
            mobileMenuContent.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        }
    };
    
    updateContent(currentLang); 
    
    applyTheme(themeTogglePC);
    applyTheme(themeToggleMobile);

    if (mobileMenuButton) {mobileMenuButton.addEventListener('click', toggleMobileMenu);}
    if (mobileMenuOverlay) {mobileMenuOverlay.addEventListener('click', toggleMobileMenu);}

    document.querySelectorAll('#mobile-menu-content a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuContent && mobileMenuContent.classList.contains('active')) {
                toggleMobileMenu();
            }
        })
    });

    if (langTogglePC) langTogglePC.addEventListener('click', handleLangToggle);
    if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);

    if (themeTogglePC) themeTogglePC.addEventListener('click', handleThemeToggle);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', handleThemeToggle);

    onAuthStateChanged(auth, (user) => {
        mainAppLogic(user); // mainAppLogic を先に実行
        updateHeader(user); // グローバルスコープの updateHeader を呼び出す
    });
});