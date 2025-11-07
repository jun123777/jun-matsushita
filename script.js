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

// --- ▼▼ [修正] 翻訳オブジェクト全体を更新 (多言語対応 + 文言変更) ▼▼ ---
const translations = {
    ja: {
        appTitle: '日程調整3',
        howToUse: '使い方',
        login: 'ログイン/登録',
        lang: '日本語', // プルダウンのボタン用
        mySchedules: 'マイアンケート',
        logout: 'ログアウト',
        heroTitle: 'サクッと 簡単・シンプル',
        homeSubtitle: '日程調整の種類を選択',
        dateCardTitle: '日にちで調整',
        dateCardDesc: '候補日をカレンダーで提示し、参加者が都合の良い日を選べます。',
        dateCardButton: '日にちで作成',
        dateCardNote: '投票結果は投票期限が過ぎたら公開されます',
        timeCardTitle: 'ピンポイント日時調整',
        timeCardDesc: '複数の候補日それぞれに、都合の良い時間帯を複数選択してもらいます。',
        timeCardButton: '日時で作成',
        timeCardNote: '投票結果は投票期限が過ぎたら公開されます',
        pollCardTitle: 'カスタム投票',
        pollCardDesc: '「A案」「B案」など、自由な選択肢で投票を作成します。',
        createPollButton: '一般投票で作成',
        createDateH2: '日にちで日程調整を作成',
        createTimeH2: '日時で日程調整を作成',
        createPollH2: '一般投票を作成',
        titleLabel: 'タイトル',
        titlePlaceholder: '例：チームランチの日程調整',
        descLabel: '説明',
        descPlaceholder: '例：チームランチの候補日を決めたいです。',
        deadlineLabel: '投票期限',
        datesLabel: '候補日を選択',
        timeSlotsLabel: '1. 候補日を選択',
        datetimeConfigLabel: '2. 候補時間帯を編集',
        pollOptionsLabel: '投票の選択肢',
        addOptionButton: '+ 選択肢を追加',
        createButton: '作成する',
        howToUseH2: '使い方',
        step1Title: 'ステップ1：日程調整の作成',
        step1Desc: 'サイトのトップページから、作成したい日程調整の種類を選択します。',
        step1Bullet1: '<strong>日にちで調整</strong>: カレンダーから候補日を複数選択して、参加者が都合の良い日を選ぶアンケートを作成します。',
        step1Bullet2: '<strong>日時で調整</strong>: カレンダーで日付を選び、さらにその日の中で「09:00-09:30」のように具体的な時間帯（スロット）を複数設定するアンケートを作成します。',
        step1Bullet3_poll: '<strong>一般投票で調整</strong>: 「A案」「B案」など、日付とは関係ない自由な選択肢で投票アンケートを作成します。',
        step1Note: 'タイトルや説明文、投票期限を設定したら、「作成する」ボタンを押してください。',
        step2Title: 'ステップ2：URLの共有',
        step2Desc: '日程調整の作成が完了すると、専用のURLが発行されます。このURLをコピーして、LINEやメール、Slackなどで参加者に共有しましょう。',
        step3Title: 'ステップ3：投票',
        step3Desc: '共有されたURLにアクセスすると、投票ページが表示されます。',
        step3Bullet1: '自分の名前を入力します。',
        step3Bullet2: 'アンケートの種類に応じて、都合の良い「日にち」（カレンダー）、具体的な「日時」（時間スロットのリスト）、または「選択肢」（A案/B案など）を選びます。',
        step3Bullet3: '「投票する」ボタンを押して投票完了です。',
        step3NoteTitle: '注意点：',
        step3Note: '投票結果は、投票期限が過ぎるまで他の人には公開されません。期限が過ぎると、すべての投票結果が自動で公開されます。',
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
        voteTimeH3: '候補日時を選択',
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
        lang: 'English', // プルダウンのボタン用
        mySchedules: 'My Schedules',
        logout: 'Logout',
        heroTitle: 'Quick & Simple',
        homeSubtitle: 'Select a schedule type',
        dateCardTitle: 'By Date',
        dateCardDesc: 'Present candidate dates on a calendar for participants to choose from.',
        dateCardButton: 'Create by Date',
        dateCardNote: 'Results will be public after the voting deadline.',
        timeCardTitle: 'Pinpoint Datetime Adjustment',
        timeCardDesc: 'Have participants select convenient time slots for multiple specific dates.',
        timeCardButton: 'Create by Datetime',
        timeCardNote: 'Results will be public after the voting deadline.',
        pollCardTitle: 'Custom Poll',
        pollCardDesc: 'Create a poll with custom options like "Option A", "Option B".',
        createPollButton: 'Create Poll',
        createDateH2: 'Create a schedule by date',
        createTimeH2: 'Create a schedule by datetime',
        createPollH2: 'Create a General Poll',
        titleLabel: 'Title',
        titlePlaceholder: 'e.g., Team Lunch Schedule',
        descLabel: 'Description',
        descPlaceholder: 'e.g., Let\'s decide the dates for our team lunch.',
        deadlineLabel: 'Voting Deadline',
        datesLabel: 'Select candidate dates',
        timeSlotsLabel: '1. Select candidate dates',
        datetimeConfigLabel: '2. Edit candidate time slots',
        pollOptionsLabel: 'Poll Options',
        addOptionButton: '+ Add Option',
        createButton: 'Create',
        howToUseH2: 'How to use',
        step1Title: 'Step 1: Create a Schedule',
        step1Desc: 'From the top page, select the type of schedule you want to create.',
        step1Bullet1: '<strong>By Date</strong>: Create a poll by selecting multiple candidate dates from the calendar for participants to choose from.',
        step1Bullet2: '<strong>By Datetime</strong>: Create a poll by selecting dates, and then setting specific time slots (e.g., "09:00-09:30") for each selected date.',
        step1Bullet3_poll: '<strong>General Poll</strong>: Create a poll with custom, non-date-related options, such as "Option A", "Option B".',
        step1Note: 'After setting the title, description, and voting deadline, press the "Create" button.',
        step2Title: 'Step 2: Share the URL',
        step2Desc: 'Once the schedule is created, a unique URL will be issued. Copy this URL and share it with participants via LINE, email, Slack, etc.',
        step3Title: 'Step 3: Vote',
        step3Desc: 'When you access the shared URL, the voting page will be displayed.',
        step3Bullet1: 'Enter your name.',
        step3Bullet2: 'Select your convenient "Date" (from the calendar), specific "Datetime" (from the time slot list), or "Option" (e.g., Option A/B) based on the poll type.',
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
        voteTimeH3: 'Select candidate datetimes',
        votePollH3: 'Options',
        voterNameLabel: 'Your Name',
        voterNamePlaceholder: 'e.g., John Doe',
        notAvailableLabel: 'Not available on any of the dates',
        commentLabel: 'Comment',
        commentPlaceholder: 'e.g., I am available at the end of the month.',
        submitVoteButton: 'Vote',
        votedStatusH3: 'Voting Status',
        daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    ko: {
        appTitle: '일정조정3',
        howToUse: '사용법',
        login: '로그인 / 등록',
        lang: '한국어',
        mySchedules: '내 설문',
        logout: '로그아웃',
        heroTitle: '간편하고 심플하게',
        homeSubtitle: '일정 조정 유형을 선택',
        dateCardTitle: '날짜로 조정',
        dateCardDesc: '캘린더에서 후보 날짜를 제시하여 참가자가 편한 날을 선택할 수 있습니다.',
        dateCardButton: '날짜로 만들기',
        dateCardNote: '투표 결과는 투표 마감일이 지나면 공개됩니다',
        timeCardTitle: '상세 일시 조정',
        timeCardDesc: '여러 후보 날짜 각각에 대해 편한 시간대를 여러 개 선택하도록 합니다.',
        timeCardButton: '일시로 만들기',
        timeCardNote: '투표 결과는 투표 마감일이 지나면 공개됩니다',
        pollCardTitle: '커스텀 투표',
        pollCardDesc: '"A안", "B안" 등 자유로운 선택지로 투표를 만듭니다.',
        createPollButton: '일반 투표로 만들기',
        createDateH2: '날짜로 일정 조정 만들기',
        createTimeH2: '일시로 일정 조정 만들기',
        createPollH2: '일반 투표 만들기',
        titleLabel: '제목',
        titlePlaceholder: '예: 팀 점심 일정 조정',
        descLabel: '설명',
        descPlaceholder: '예: 팀 점심 날짜를 정하고 싶습니다.',
        deadlineLabel: '투표 마감일',
        datesLabel: '후보 날짜 선택',
        timeSlotsLabel: '1. 후보 날짜 선택',
        datetimeConfigLabel: '2. 후보 시간대 편집',
        pollOptionsLabel: '투표 선택지',
        addOptionButton: '+ 선택지 추가',
        createButton: '만들기',
        howToUseH2: '사용법',
        step1Title: '스텝 1: 일정 조정 만들기',
        step1Desc: '사이트 첫 페이지에서 만들고 싶은 일정 조정 유형을 선택합니다.',
        step1Bullet1: '<strong>날짜로 조정</strong>: 캘린더에서 후보 날짜를 여러 개 선택하여 참가자가 편한 날을 고르는 설문을 만듭니다.',
        step1Bullet2: '<strong>일시로 조정</strong>: 캘린더에서 날짜를 선택하고, "09:00-09:30"처럼 구체적인 시간대(슬롯)를 여러 개 설정하는 설문을 만듭니다.',
        step1Bullet3_poll: '<strong>일반 투표로 조정</strong>: "A안", "B안" 등 날짜와 관계없는 자유로운 선택지로 투표 설문을 만듭니다.',
        step1Note: '제목, 설명, 투표 마감일을 설정한 후 "만들기" 버튼을 누르세요.',
        step2Title: '스텝 2: URL 공유',
        step2Desc: '일정 조정이 완료되면 전용 URL이 발급됩니다. 이 URL을 복사하여 LINE, 이메일, Slack 등으로 참가자에게 공유하세요.',
        step3Title: '스텝 3: 투표',
        step3Desc: '공유된 URL에 접속하면 투표 페이지가 표시됩니다.',
        step3Bullet1: '자신의 이름을 입력합니다.',
        step3Bullet2: '설문 유형에 따라 편한 "날짜"(캘린더), 구체적인 "일시"(시간 슬롯 목록), 또는 "선택지"(A안/B안 등)를 선택합니다.',
        step3Bullet3: '"투표하기" 버튼을 눌러 투표 완료입니다.',
        step3NoteTitle: '주의점:',
        step3Note: '투표 결과는 **투표 마감일이 지날 때까지 다른 사람에게 공개되지 않습니다**. 마감일이 지나면 모든 투표 결과가 자동으로 공개됩니다.',
        loginH2: '로그인 / 등록',
        loginDesc: 'Google 계정으로 간편하고 안전하게 로그인할 수 있습니다.',
        loginButton: 'Google 계정으로 로그인',
        emailPlaceholder: '이메일 주소',
        passwordPlaceholder: '비밀번호',
        loginButtonText: '로그인',
        registerButtonText: '신규 등록',
        orSeparator: '또는',
        googleLoginText: 'Google 계정으로 로그인',
        resultsH2: '투표 결과',
        resultsClosedMessage: '투표가 마감되었습니다.',
        noVotes: '아직 아무도 투표하지 않았습니다.',
        voteH2: '투표 페이지',
        voteDateH3: '투표일 선택',
        voteTimeH3: '후보 일시 선택',
        votePollH3: '선택지',
        voterNameLabel: '이름',
        voterNamePlaceholder: '예: 홍길동',
        notAvailableLabel: '편한 날짜가 없음',
        commentLabel: '코멘트',
        commentPlaceholder: '예: 월말이라면 가능합니다.',
        submitVoteButton: '투표하기',
        votedStatusH3: '투표 현황',
        daysOfWeek: ['일', '월', '화', '수', '목', '금', '토']
    },
    // --- ▼▼ [修正] フランス語のアポストロフィを \' でエスケープ ▼▼ ---
    fr: {
        appTitle: 'Planif. 3',
        howToUse: 'Comment utiliser',
        login: 'Connexion / S\'inscrire',
        lang: 'Français',
        mySchedules: 'Mes sondages',
        logout: 'Déconnexion',
        heroTitle: 'Rapide & Simple',
        homeSubtitle: 'Choisir un type de planification',
        dateCardTitle: 'Par Date',
        dateCardDesc: 'Présentez des dates candidates sur un calendrier pour que les participants choisissent.',
        dateCardButton: 'Créer par date',
        dateCardNote: 'Les résultats seront publics après la date limite de vote.',
        timeCardTitle: 'Ajustement Date/Heure',
        timeCardDesc: 'Demandez aux participants de sélectionner plusieurs créneaux horaires qui leur conviennent pour chaque date candidate.',
        timeCardButton: 'Créer par date/heure',
        timeCardNote: 'Les résultats seront publics après la date limite de vote.',
        pollCardTitle: 'Sondage personnalisé',
        pollCardDesc: 'Créez un sondage avec des options personnalisées comme "Option A", "Option B".',
        createPollButton: 'Créer un sondage',
        createDateH2: 'Créer une planification par date',
        createTimeH2: 'Créer une planification par date/heure',
        createPollH2: 'Créer un sondage général',
        titleLabel: 'Titre',
        titlePlaceholder: 'Ex: Planification déjeuner d\'équipe',
        descLabel: 'Description',
        descPlaceholder: 'Ex: Décidons des dates pour notre déjeuner d\'équipe',
        deadlineLabel: 'Date limite de vote',
        datesLabel: 'Choisir les dates candidates',
        timeSlotsLabel: '1. Choisir les dates candidates',
        datetimeConfigLabel: '2. Modifier les créneaux horaires',
        pollOptionsLabel: 'Options du sondage',
        addOptionButton: '+ Ajouter une option',
        createButton: 'Créer',
        howToUseH2: 'Comment utiliser',
        step1Title: 'Étape 1: Créer une planification',
        step1Desc: 'Depuis la page d\'accueil, choisissez le type de planification que vous souhaitez créer.',
        step1Bullet1: '<strong>Par Date</strong>: Créez un sondage en sélectionnant plusieurs dates candidates sur le calendrier.',
        step1Bullet2: '<strong>Par Date/Heure</strong>: Créez un sondage en sélectionnant des dates, puis en définissant des créneaux horaires spécifiques (ex: "09:00-09:30") pour chaque date.',
        step1Bullet3_poll: '<strong>Sondage général</strong>: Créez un sondage avec des options personnalisées non liées à des dates, comme "Option A", "Option B".',
        step1Note: 'Après avoir défini le titre, la description et la date limite, appuyez sur "Créer".',
        step2Title: 'Étape 2: Partager l\'URL',
        step2Desc: 'Une fois la planification créée, une URL unique sera générée. Copiez-la et partagez-la avec les participants via LINE, e-mail, Slack, etc.',
        step3Title: 'Étape 3: Voter',
        step3Desc: 'En accédant à l\'URL partagée, la page de vote s\'affichera.',
        step3Bullet1: 'Entrez votre nom.',
        step3Bullet2: 'Selon le type de sondage, sélectionnez la "Date", la "Date/Heure" (liste de créneaux) ou l\' "Option" (A/B) qui vous convient.',
        step3Bullet3: 'Appuyez sur "Voter" pour terminer.',
        step3NoteTitle: 'Note:',
        step3Note: 'Les résultats du vote resteront **privés jusqu\'à ce que la date limite soit passée**. Après la limite, tous les résultats seront automatiquement publiés.',
        loginH2: 'Connexion / S\'inscrire',
        loginDesc: 'Connectez-vous facilement et en toute sécurité avec votre compte Google.',
        loginButton: 'Connexion avec Google',
        emailPlaceholder: 'Adresse e-mail',
        passwordPlaceholder: 'Mot de passe',
        loginButtonText: 'Connexion',
        registerButtonText: 'S\'inscrire',
        orSeparator: 'ou',
        googleLoginText: 'Connexion avec Google',
        resultsH2: 'Résultats du vote',
        resultsClosedMessage: 'Le vote est terminé.',
        noVotes: 'Personne n\'a encore voté.',
        voteH2: 'Page de vote',
        voteDateH3: 'Choisir une date de vote',
        voteTimeH3: 'Choisir une date/heure',
        votePollH3: 'Options',
        voterNameLabel: 'Votre nom',
        voterNamePlaceholder: 'Ex: Jean Dupont',
        notAvailableLabel: 'Indisponible à toutes les dates',
        commentLabel: 'Commentaire',
        commentPlaceholder: 'Ex: Je suis disponible à la fin du mois.',
        submitVoteButton: 'Voter',
        votedStatusH3: 'Statut du vote',
        daysOfWeek: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    },
    // --- ▲▲ [修正] ---
    es: {
        appTitle: 'Programar 3',
        howToUse: 'Cómo usar',
        login: 'Iniciar sesión / Registrarse',
        lang: 'Español',
        mySchedules: 'Mis encuestas',
        logout: 'Cerrar sesión',
        heroTitle: 'Rápido y Sencillo',
        homeSubtitle: 'Selecciona un tipo de programación',
        dateCardTitle: 'Por Fecha',
        dateCardDesc: 'Presenta fechas candidatas en un calendario para que los participantes elijan.',
        dateCardButton: 'Crear por fecha',
        dateCardNote: 'Los resultados serán públicos después de la fecha límite de votación.',
        timeCardTitle: 'Ajuste Fecha/Hora',
        timeCardDesc: 'Pide a los participantes que seleccionen varias franjas horarias convenientes para cada fecha candidata.',
        timeCardButton: 'Crear por fecha/hora',
        timeCardNote: 'Los resultados serán públicos después de la fecha límite de votación.',
        pollCardTitle: 'Votación personalizada',
        pollCardDesc: 'Crea una votación con opciones personalizadas como "Opción A", "Opción B".',
        createPollButton: 'Crear votación',
        createDateH2: 'Crear programación por fecha',
        createTimeH2: 'Crear programación por fecha/hora',
        createPollH2: 'Crear votación general',
        titleLabel: 'Título',
        titlePlaceholder: 'Ej: Programar almuerzo de equipo',
        descLabel: 'Descripción',
        descPlaceholder: 'Ej: Decidamos las fechas para nuestro almuerzo de equipo.',
        deadlineLabel: 'Fecha límite de votación',
        datesLabel: 'Seleccionar fechas candidatas',
        timeSlotsLabel: '1. Seleccionar fechas candidatas',
        datetimeConfigLabel: '2. Editar franjas horarias',
        pollOptionsLabel: 'Opciones de la votación',
        addOptionButton: '+ Añadir opción',
        createButton: 'Crear',
        howToUseH2: 'Cómo usar',
        step1Title: 'Paso 1: Crear una programación',
        step1Desc: 'Desde la página principal, selecciona el tipo de programación que deseas crear.',
        step1Bullet1: '<strong>Por Fecha</strong>: Crea una encuesta seleccionando múltiples fechas candidatas del calendario.',
        step1Bullet2: '<strong>Por Fecha/Hora</strong>: Crea una encuesta seleccionando fechas y luego configurando franjas horarias específicas (ej: "09:00-09:30") para cada una.',
        step1Bullet3_poll: '<strong>Votación general</strong>: Crea una encuesta con opciones personalizadas no relacionadas con fechas, como "Opción A", "Opción B".',
        step1Note: 'Después de establecer el título, la descripción y la fecha límite, presiona "Crear".',
        step2Title: 'Paso 2: Compartir la URL',
        step2Desc: 'Una vez creada la programación, se generará una URL única. Cópiala y compártela con los participantes por LINE, correo electrónico, Slack, etc.',
        step3Title: 'Paso 3: Votar',
        step3Desc: 'Al acceder a la URL compartida, se mostrará la página de votación.',
        step3Bullet1: 'Ingresa tu nombre.',
        step3Bullet2: 'Según el tipo de encuesta, selecciona la "Fecha", la "Fecha/Hora" (de la lista de franjas) o la "Opción" (A/B) que te convenga.',
        step3Bullet3: 'Presiona "Votar" para completar.',
        step3NoteTitle: 'Nota:',
        step3Note: 'Los resultados de la votación permanecerán **privados hasta que pase la fecha límite**. Después de la fecha límite, todos los resultados se publicarán automáticamente.',
        loginH2: 'Iniciar sesión / Registrarse',
        loginDesc: 'Puedes iniciar sesión de forma fácil y segura con tu cuenta de Google.',
        loginButton: 'Iniciar sesión con Google',
        emailPlaceholder: 'Dirección de correo',
        passwordPlaceholder: 'Contraseña',
        loginButtonText: 'Iniciar sesión',
        registerButtonText: 'Registrarse',
        orSeparator: 'o',
        googleLoginText: 'Iniciar sesión con Google',
        resultsH2: 'Resultados de la votación',
        resultsClosedMessage: 'La votación ha cerrado.',
        noVotes: 'Nadie ha votado todavía.',
        voteH2: 'Página de votación',
        voteDateH3: 'Seleccionar fecha de votación',
        voteTimeH3: 'Seleccionar fecha/hora',
        votePollH3: 'Opciones',
        voterNameLabel: 'Tu nombre',
        voterNamePlaceholder: 'Ej: Juan Pérez',
        notAvailableLabel: 'No disponible en ninguna fecha',
        commentLabel: 'Comentario',
        commentPlaceholder: 'Ej: Estoy disponible a fin de mes.',
        submitVoteButton: 'Votar',
        votedStatusH3: 'Estado de la votación',
        daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    },
    zh: {
        appTitle: '日程调整3',
        howToUse: '使用方法',
        login: '登录 / 注册',
        lang: '简体中文',
        mySchedules: '我的投票',
        logout: '登出',
        heroTitle: '快速 & 简单',
        homeSubtitle: '选择日程调整的类型',
        dateCardTitle: '按日期调整',
        dateCardDesc: '在日历上提供候选日期，让参与者选择方便的日期。',
        dateCardButton: '按日期创建',
        dateCardNote: '投票结果将在投票截止日期后公布',
        timeCardTitle: '精确时间调整',
        timeCardDesc: '让参与者为每个候选日期选择多个方便的时间段。',
        timeCardButton: '按时间创建',
        timeCardNote: '投票结果将在投票截止日期后公布',
        pollCardTitle: '自定义投票',
        pollCardDesc: '创建带有自定义选项（如“A方案”、“B方案”）的投票。',
        createPollButton: '创建投票',
        createDateH2: '按日期创建日程调整',
        createTimeH2: '按时间创建日程调整',
        createPollH2: '创建通用投票',
        titleLabel: '标题',
        titlePlaceholder: '例：团队午餐日程调整',
        descLabel: '说明',
        descPlaceholder: '例：我们来决定团队午餐的日期。',
        deadlineLabel: '投票截止日期',
        datesLabel: '选择候选日期',
        timeSlotsLabel: '1. 选择候选日期',
        datetimeConfigLabel: '2. 编辑候选时间段',
        pollOptionsLabel: '投票选项',
        addOptionButton: '+ 添加选项',
        createButton: '创建',
        howToUseH2: '使用方法',
        step1Title: '第1步：创建日程调整',
        step1Desc: '从首页选择您想创建的日程调整类型。',
        step1Bullet1: '<strong>按日期调整</strong>: 通过从日历中选择多个候选日期来创建投票。',
        step1Bullet2: '<strong>按时间调整</strong>: 通过选择日期，然后为每个日期设置具体的时间段（例如“09:00-09:30”）来创建投票。',
        step1Bullet3_poll: '<strong>通用投票</strong>: 创建与日期无关的自定义选项投票，例如“A方案”、“B方案”。',
        step1Note: '设置标题、说明和投票截止日期后，按“创建”按钮。',
        step2Title: '第2步：分享URL',
        step2Desc: '创建日程后，将生成一个唯一的URL。复制此URL并通过LINE、电子邮件、Slack等方式分享给参与者。',
        step3Title: '第3步：投票',
        step3Desc: '访问共享的URL后，将显示投票页面。',
        step3Bullet1: '输入您的名字。',
        step3Bullet2: '根据投票类型，选择方便的“日期”（从日历）、“具体时间”（从时间段列表）或“选项”（例如A方案/B方案）。',
        step3Bullet3: '按“投票”按钮完成投票。',
        step3NoteTitle: '请注意：',
        step3Note: '投票结果在**投票截止日期前对他人保密**。截止日期过后，所有投票结果将自动公布。',
        loginH2: '登录 / 注册',
        loginDesc: '您可以使用您的Google帐户轻松安全地登录。',
        loginButton: '使用Google登录',
        emailPlaceholder: '电子邮件地址',
        passwordPlaceholder: '密码',
        loginButtonText: '登录',
        registerButtonText: '注册',
        orSeparator: '或',
        googleLoginText: '使用Google登录',
        resultsH2: '投票结果',
        resultsClosedMessage: '投票已截止。',
        noVotes: '目前还没有人投票。',
        voteH2: '投票页面',
        voteDateH3: '选择投票日期',
        voteTimeH3: '选择候选时间',
        votePollH3: '选项',
        voterNameLabel: '您的名字',
        voterNamePlaceholder: '例：王五',
        notAvailableLabel: '所有日期都不方便',
        commentLabel: '评论',
        commentPlaceholder: '例：我月底有空。',
        submitVoteButton: '投票',
        votedStatusH3: '投票情况',
        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六']
    }
};
// --- ▲▲ [修正] 翻訳オブジェクト全体を更新 ▲▲ ---

const updateContent = (lang) => {
    // 存在しない言語キーが指定された場合、'ja' にフォールバック
    const text = translations[lang] || translations['ja'];
    
    const elements = [
        { id: 'logo-text-pc', prop: 'textContent', value: text.appTitle },
        { id: 'logo-text-mobile', prop: 'textContent', value: text.appTitle },
        { id: 'how-to-use-link-pc', prop: 'textContent', value: text.howToUse },
        { id: 'login-link-pc', prop: 'textContent', value: text.login },
        // { id: 'lang-text-pc', prop: 'textContent', value: text.lang }, // プルダウンボタンにより不要
        { id: 'how-to-use-link-mobile', prop: 'textContent', value: text.howToUse },
        { id: 'login-link-mobile', prop: 'textContent', value: text.login },
        // { id: 'lang-text-mobile', prop: 'textContent', value: text.lang }, // プルダウンボタンにより不要
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

    // --- ▼▼ [修正] プルダウンのボタンテキストを更新するロジック ▼▼ ---
    const currentLangName = text.lang;
    const langCurrentTextPC = document.getElementById('lang-current-text-pc');
    const langCurrentTextMobile = document.getElementById('lang-current-text-mobile');
    if (langCurrentTextPC) langCurrentTextPC.textContent = currentLangName;
    if (langCurrentTextMobile) langCurrentTextMobile.textContent = currentLangName;
    // --- ▲▲ [修正] ▲▲ ---

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
                    // [修正] my-page-section のh2セレクタをより具体的に
                    const myPageH2Login = section.querySelector('#login-prompt-container h2');
                    if (myPageH2Login) myPageH2Login.textContent = 'ログインが必要です'; // これは固定でOK
                    const myPageH2Content = section.querySelector('#actual-my-page-content h2');
                    if (myPageH2Content) myPageH2Content.textContent = text.mySchedules;
                }
            }
            
            if (sectionId === 'how-to-use-section') {
                const howToUseElements = [
                    { selector: '.space-y-8 > div:nth-child(1) > h3', prop: 'textContent', value: text.step1Title },
                    { selector: '.space-y-8 > div:nth-child(1) > p:nth-of-type(1)', prop: 'textContent', value: text.step1Desc },
                    { selector: '.space-y-8 > div:nth-child(1) > ul > li:nth-child(1)', prop: 'innerHTML', value: text.step1Bullet1 },
                    { selector: '.space-y-8 > div:nth-child(1) > ul > li:nth-child(2)', prop: 'innerHTML', value: text.step1Bullet2 },
                    { selector: '.space-y-8 > div:nth-child(1) > ul > li:nth-child(3)', prop: 'innerHTML', value: text.step1Bullet3_poll },
                    { selector: '.space-y-8 > div:nth-child(1) > p:nth-of-type(2)', prop: 'textContent', value: text.step1Note },
                    { selector: '.space-y-8 > div:nth-child(2) > h3', prop: 'textContent', value: text.step2Title },
                    { selector: '.space-y-8 > div:nth-child(2) > p', prop: 'textContent', value: text.step2Desc },
                    { selector: '.space-y-8 > div:nth-child(3) > h3', prop: 'textContent', value: text.step3Title },
                    { selector: '.space-y-8 > div:nth-child(3) > p:nth-of-type(1)', prop: 'textContent', value: text.step3Desc },
                    { selector: '.space-y-8 > div:nth-child(3) > ul > li:nth-child(1)', prop: 'textContent', value: text.step3Bullet1 },
                    { selector: '.space-y-8 > div:nth-child(3) > ul > li:nth-child(2)', prop: 'innerHTML', value: text.step3Bullet2 },
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

                if (sectionId === 'create-date-section') {
                    const datesLabel = document.querySelector(`#${sectionId} h3`);
                    if (datesLabel) datesLabel.textContent = text.datesLabel;
                }
                if (sectionId === 'create-time-section') {
                    const h3s = document.querySelectorAll(`#${sectionId} h3`);
                    if (h3s.length > 0) h3s[0].textContent = text.timeSlotsLabel;
                    if (h3s.length > 1) h3s[1].textContent = text.datetimeConfigLabel;
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

// --- ▼▼ [追加] ハンバーガーメニュー制御関数 ▼▼ ---
const toggleMobileMenu = () => {
    const mobileMenuContent = document.getElementById('mobile-menu-content');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    if (mobileMenuContent && mobileMenuOverlay) {
        mobileMenuContent.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
    }
};
// --- ▲▲ [追加] ---

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
    
    // [修正] HTML要素そのものではなく、その *中身* (innerHTML) を設定する
    // また、モバイルメニュー内のテキスト（"テーマ切替"）を保持するため、アイコンだけを差し替える
    if (element) {
        const isDark = localStorage.getItem('theme') === 'dark';
        const iconHTML = isDark ? moonIcon : sunIcon;
        
        // モバイル版ボタンの場合、テキスト（<span...）を保持する
        if (element.id === 'theme-toggle-mobile') {
            const textSpan = element.querySelector('span');
            element.innerHTML = iconHTML + (textSpan ? textSpan.outerHTML : '');
        } else {
            // PC版はアイコンのみ
            element.innerHTML = iconHTML;
        }
    }
};
// --- ▲▲ [修正] ---

// --- ヘッダー更新関数 ---
const updateHeader = (user) => {
    // PC用要素の取得
    const userIconContainerPC = document.getElementById('user-icon-container-pc');
    const loginLinkPC = document.getElementById('login-link-pc');
    const mySchedulesLinkPC = document.getElementById('my-schedules-link-pc');
    const logoutLinkPC = document.getElementById('logout-link-pc');

    // スマホ用要素の取得 (ハンバーガーメニュー内)
    const userIconContainerMobile = document.getElementById('user-icon-container-mobile');
    const loginLinkMobile = document.getElementById('login-link-mobile');
    const mySchedulesLinkMobile = document.getElementById('my-schedules-link-mobile');
    const logoutLinkMobile = document.getElementById('logout-link-mobile');

    // 共通のSVGアイコン
    const defaultIconHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    `;

    if (user && !user.isAnonymous) {
        const photoURL = user.photoURL || 'https://via.placeholder.com/32'; // Placeholderは小さい画像でよい
        const userImageHTML = `<img src="${photoURL}" alt="User" class="w-full h-full rounded-full object-cover">`;

        // PC
        if (userIconContainerPC) userIconContainerPC.innerHTML = userImageHTML;
        if (loginLinkPC) loginLinkPC.classList.add('hidden');
        if (mySchedulesLinkPC) mySchedulesLinkPC.classList.remove('hidden');
        if (logoutLinkPC) logoutLinkPC.classList.remove('hidden');
        
        // Mobile (ハンバーガーメニュー内)
        if (userIconContainerMobile) userIconContainerMobile.innerHTML = userImageHTML;
        if (loginLinkMobile) loginLinkMobile.classList.add('hidden');
        if (mySchedulesLinkMobile) mySchedulesLinkMobile.classList.remove('hidden');
        if (logoutLinkMobile) logoutLinkMobile.classList.remove('hidden');

    } else {
        // PC
        if (userIconContainerPC) userIconContainerPC.innerHTML = defaultIconHTML;
        if (loginLinkPC) loginLinkPC.classList.remove('hidden');
        if (mySchedulesLinkPC) mySchedulesLinkPC.classList.add('hidden');
        if (logoutLinkPC) logoutLinkPC.classList.add('hidden');
        
        // Mobile (ハンバーガーメニュー内)
        if (userIconContainerMobile) userIconContainerMobile.innerHTML = defaultIconHTML;
        if (loginLinkMobile) loginLinkMobile.classList.remove('hidden');
        if (mySchedulesLinkMobile) mySchedulesLinkMobile.classList.add('hidden');
        if (logoutLinkMobile) logoutLinkMobile.classList.add('hidden');
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
        
        // [修正] モバイルヘッダーのリンクはメニューパネル内のものを参照する
        const howToUseLinkMobile = document.getElementById('how-to-use-link-mobile');
        const loginLinkMobile = document.getElementById('login-link-mobile');
        const mySchedulesLinkMobile = document.getElementById('my-schedules-link-mobile');
        const logoutLinkMobile = document.getElementById('logout-link-mobile');

        const themeTogglePC = document.getElementById('theme-toggle-pc');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');


        const backToHomeButtonPC = document.getElementById('back-to-home-button-pc');
        // [修正] モバイル用の「戻る」ボタンはメニューパネル内に存在しない（ロゴをクリックする）
        // const backToHomeButtonMobile = document.getElementById('back-to-home-button-mobile'); 
        
        const calendarContainer = document.getElementById('calendar-container');
        const timeCalendarContainer = document.getElementById('time-calendar-container');
        const datetimeConfigContainer = document.getElementById('datetime-config-container');

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
        let selectedDates = new Set();
        let selectedDateTimes = new Map();
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

            const baseUrl = `${window.location.origin}/voting-page.html`;

            schedules.forEach(item => {
                const schedule = item.data;
                const scheduleId = item.id;
                const listItem = document.createElement('div');

                const shareUrl = `${baseUrl}?id=${scheduleId}`;
                
                listItem.className = 'bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0';
                
                let scheduleTypeLabel = '';
                if (schedule.type === 'date') {
                    scheduleTypeLabel = translations[currentLang].dateCardTitle;
                } else if (schedule.type === 'time') {
                    if (schedule.candidates) {
                        scheduleTypeLabel = translations[currentLang].timeCardTitle;
                    } else {
                        scheduleTypeLabel = '時間帯調整'; // 古い形式（翻訳なし）
                    }
                } else if (schedule.type === 'poll') {
                    scheduleTypeLabel = translations[currentLang].pollCardTitle;
                }

                listItem.innerHTML = `
                     <div class="flex items-center space-x-3 w-full sm:w-auto">
                         <input type="checkbox" data-id="${scheduleId}" class="schedule-checkbox h-5 w-5 text-blue-600 dark:bg-gray-600 dark:border-gray-500 rounded focus:ring-blue-500">
                         
                         <div class="flex flex-col">
                            <span class="font-bold text-lg dark:text-white">${schedule.title}</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">${scheduleTypeLabel} / 期限: ${new Date(schedule.deadline).toLocaleDateString()}</span>
                            
                            <a href="${shareUrl}" target="_blank" class="text-xs text-blue-500 hover:underline dark:text-blue-400 mt-1 break-all">${shareUrl}</a>
                         </div>
                     </div>

                     <div class="flex items-center space-x-3 mt-2 sm:mt-0">
                        <button data-id="${scheduleId}" class="delete-schedule-btn text-sm text-red-500 hover:text-red-700 transition-colors">削除</button>
                        <a href="${shareUrl}" class="text-blue-500 hover:underline text-sm font-medium">詳細を見る</a>
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

        const renderCalendar = (container, month, year, selectable = true, allowedDates = [], isMultipleSelection = true, onDateClick = null) => {
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
                const dateString = date.toISOString().split('T')[0];
                dayElement.dataset.date = dateString;

                if (date.getMonth() !== month) {
                    dayElement.classList.add('inactive');
                } else if (selectable) {
                    dayElement.addEventListener('click', () => {
                        if (onDateClick) {
                            onDateClick(dateString, dayElement);
                        } 
                        else {
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
                        }
                    });
                    
                    if (onDateClick) {
                        if (selectedDateTimes.has(dateString)) {
                            dayElement.classList.add('selected');
                        }
                    } else {
                        if (selectedDates.has(dateString)) {
                            dayElement.classList.add('selected');
                        }
                    }

                } else {
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
                                const allDays = container.querySelectorAll('.selectable-date.selected');
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
                    renderCalendar(container, currentMonth, currentYear, selectable, allowedDates, isMultipleSelection, onDateClick);
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
                    renderCalendar(container, currentMonth, currentYear, selectable, allowedDates, isMultipleSelection, onDateClick);
                });
            }
        };

        const generateTimeSlots = (container, selectable = true, allowedTimeSlots = [], isMultipleSelection = true, dateString = null, stateMap = null) => {
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
                        if (dateString && stateMap) {
                            if (!stateMap.has(dateString)) {
                                stateMap.set(dateString, new Set());
                            }
                            const timeSet = stateMap.get(dateString);

                            if (timeSet.has(timeText)) {
                                timeSet.delete(timeText);
                                timeSlotElement.classList.remove('selected');
                            } else {
                                timeSet.add(timeText);
                                timeSlotElement.classList.add('selected');
                            }
                        }
                    } else {
                        if (notAvailableCheckbox && notAvailableCheckbox.checked) {
                            notAvailableCheckbox.checked = false;
                            if (notAvailableCommentContainer) {
                                notAvailableCommentContainer.classList.add('hidden');
                            }
                        }
                        if (!isMultipleSelection) {
                            selectedTimeSlots.clear();
                            const allSlots = container.querySelectorAll('.time-slot.selected');
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

                if (selectable && dateString && stateMap && stateMap.has(dateString) && stateMap.get(dateString).has(timeText)) {
                    timeSlotElement.classList.add('selected');
                }
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

        // [修正] スマホ用ボタンのイベントリスナー (メニューパネル内のリンク)
        if (howToUseLinkMobile) howToUseLinkMobile.addEventListener('click', handleHowToUseToggle);
        if (loginLinkMobile) loginLinkMobile.addEventListener('click', () => showSection('login-section'));
        // if (backToHomeButtonMobile) backToHomeButtonMobile.addEventListener('click', () => window.location.href = 'index.html');
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
                let allCandidates = [];
                let isPoll = false;
                let isDateTime = false;

                if (candidates.type === 'poll') { 
                    isPoll = true;
                    allCandidates = candidates.options;
                } else if (typeof candidates === 'object' && !Array.isArray(candidates) && candidates.type !== 'poll') {
                    isDateTime = true;
                    Object.keys(candidates).forEach(date => {
                        candidates[date].forEach(time => {
                            allCandidates.push(`${date} ${time}`);
                        });
                    });
                } else { 
                    allCandidates = candidates;
                }
                
                allCandidates.forEach(candidate => voteCounts[candidate] = { votes: 0, voters: [] });

                votedUsers.forEach(user => {
                    if (user.voteData.status === 'available' && Array.isArray(user.voteData.votes)) {
                        user.voteData.votes.forEach(vote => {
                            if (voteCounts[vote]) {
                                voteCounts[vote].votes++;
                                voteCounts[vote].voters.push(user.name);
                            } else {
                                // 候補にない票データ（古いデータなど）は無視するか、集計するか
                                // ここでは、定義済みの候補 (allCandidates) にのみ投票を集計する
                            }
                        });
                    }
                });

                const notAvailableUsers = votedUsers.filter(user => user.voteData.status === 'not-available');
                
                // --- ▼▼ [修正] 投票数の多い順にソート ▼▼ ---
                const sortedCandidates = allCandidates.sort((a, b) => {
                    const votesA = voteCounts[a] ? voteCounts[a].votes : 0;
                    const votesB = voteCounts[b] ? voteCounts[b].votes : 0;
                    return votesB - votesA; // 降順 (B - A)
                });
                // --- ▲▲ [修正] ---

                if (resultsDisplayElement) {
                    resultsDisplayElement.innerHTML = '';
                    
                    if (isPoll) {
                        // 投票数が0でない最大の投票数を探す（プログレスバーの基準）
                        const maxVotes = Math.max(...Object.values(voteCounts).map(v => v.votes), 1); 
                        
                        sortedCandidates.forEach(candidate => {
                            const count = voteCounts[candidate].votes;
                            const voters = voteCounts[candidate].voters;
                            // 0票の場合、パーセンテージも0にする
                            const percentage = (maxVotes > 0) ? (count / maxVotes) * 100 : 0;

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
                        // 「日にち」または「日時」
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
                        const headerLi = document.createElement('li');
                        headerLi.className = 'p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';
                        headerLi.innerHTML = `
                            <div>
                                <span class="font-bold text-gray-800 dark:text-gray-200">都合の悪い人 (${notAvailableUsers.length}人)</span>
                            </div>
                        `;
                        resultsDisplayElement.appendChild(headerLi);

                        notAvailableUsers.forEach(user => {
                            const li = document.createElement('li');
                            li.className = 'p-4 border-b border-gray-200 dark:border-gray-700';
                            
                            const commentHTML = user.voteData.comment 
                                ? `<p class="text-sm text-gray-500 dark:text-gray-400 mt-1 pl-4">${user.voteData.comment}</p>`
                                : '';

                            li.innerHTML = `
                                <div>
                                    <span class="font-medium text-gray-700 dark:text-gray-300">${user.name}</span>
                                    ${commentHTML}
                                </div>
                            `;
                            resultsDisplayElement.appendChild(li);
                        });
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
                selectedDates.clear();
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
                    title, description, deadline, 
                    dates: Array.from(selectedDates),
                    votedUsers: [], 
                    createdBy: user.uid, 
                    type: 'date', 
                    selectionType: isMultipleSelection ? 'multiple' : 'single'
                };
            } else if (type === 'time') {
                const candidates = {};
                let hasValidTime = false;
                selectedDateTimes.forEach((timeSet, dateString) => {
                    if (timeSet.size > 0) {
                        candidates[dateString] = Array.from(timeSet).sort();
                        hasValidTime = true;
                    }
                });
                
                if (!title || !hasValidTime) {
                    alert(translations[currentLang].createTimeH2 === '日時で日程調整を作成' ? 'タイトルと、候補日時を一つ以上選択してください。' : 'Please select a title and at least one datetime slot.');
                    return;
                }
                scheduleData = {
                    title, description, deadline, 
                    candidates: candidates,
                    votedUsers: [], 
                    createdBy: user.uid, 
                    type: 'time',
                    selectionType: isMultipleSelection ? 'multiple' : 'single'
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
                
                selectedDates.clear();
                selectedDateTimes.clear();
                if (e.target instanceof HTMLFormElement) {
                    e.target.reset();
                }
                if (type === 'time' && datetimeConfigContainer) {
                    datetimeConfigContainer.innerHTML = '';
                    const calendarDays = document.querySelectorAll('#time-calendar-container .calendar-day.selected');
                    calendarDays.forEach(day => day.classList.remove('selected'));
                }
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
                renderCalendar(calendarContainer, currentMonth, currentYear, true, [], isMultipleSelection, null);
            });
        }
        
        if (createTimeButton) {
            createTimeButton.addEventListener('click', () => {
                showSection('create-time-section');
                selectedDateTimes.clear();
                if(datetimeConfigContainer) datetimeConfigContainer.innerHTML = '';

                const multipleSelectionCheckbox = document.getElementById('time-multiple-selection-checkbox');
                const isMultipleSelection = multipleSelectionCheckbox ? multipleSelectionCheckbox.checked : true;

                const onDateClick = (dateString, dayElement) => {
                    const configContainer = document.getElementById('datetime-config-container');
                    if (!configContainer) return;

                    const existingConfig = configContainer.querySelector(`[data-date-config="${dateString}"]`);

                    if (existingConfig) {
                        selectedDateTimes.delete(dateString);
                        existingConfig.remove();
                        dayElement.classList.remove('selected');
                    } else {
                        selectedDateTimes.set(dateString, new Set());
                        dayElement.classList.add('selected');

                        const wrapper = document.createElement('div');
                        wrapper.className = 'p-4 border rounded-lg dark:border-gray-600';
                        wrapper.dataset.dateConfig = dateString;

                        const dateObj = new Date(dateString + 'T00:00:00');
                        const displayDate = `${dateString} (${translations[currentLang].daysOfWeek[dateObj.getDay()]})`;

                        wrapper.innerHTML = `<p class="font-bold dark:text-white">${displayDate}</p>`;
                        
                        const grid = document.createElement('div');
                        grid.className = 'time-slot-grid mt-2';
                        
                        generateTimeSlots(grid, true, [], true, dateString, selectedDateTimes);
                        
                        wrapper.appendChild(grid);
                        configContainer.appendChild(wrapper);
                    }
                };

                renderCalendar(timeCalendarContainer, currentMonth, currentYear, true, [], true, onDateClick);
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
        
        if (themeTogglePC) themeTogglePC.addEventListener('click', handleThemeToggle);
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

                // 1. 投票結果ページ
                if (isClosed) {
                    if(document.getElementById('voting-results-title'))
                        document.getElementById('voting-results-title').textContent = createdSchedule.title;
                    if(document.getElementById('voting-results-description'))
                        document.getElementById('voting-results-description').textContent = createdSchedule.description;

                    showSection('voting-results-section');

                    let candidates;
                    if (createdSchedule.type === 'poll') {
                        candidates = { type: 'poll', options: createdSchedule.options || [] }; 
                    } else if (createdSchedule.type === 'time' && createdSchedule.candidates) {
                        candidates = createdSchedule.candidates;
                    } else if (createdSchedule.type === 'time' && createdSchedule.timeSlots) {
                        candidates = createdSchedule.timeSlots || [];
                    } else {
                        candidates = createdSchedule.dates || [];
                    }
                    updateVotedUsersList(createdSchedule.votedUsers || [], candidates, true);
                    return; 
                } 
                
                // 2. 投票ページ
                else {
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
                         } else if (createdSchedule.type === 'time' && createdSchedule.candidates) {
                             selectedDates = new Set(currentUserVote.voteData.votes);
                         } else if (createdSchedule.type === 'time' && createdSchedule.timeSlots) {
                             selectedTimeSlots = new Set(currentUserVote.voteData.votes);
                        }
                    }

                    const voterNameInput = document.getElementById('voter-name');
                    if (user && !user.isAnonymous && voterNameInput) {
                       voterNameInput.value = voterName;
                       voterNameInput.readOnly = true;
                    }

                    if(votingCalendarContainer) votingCalendarContainer.classList.add('hidden');
                    if(votingDateH3) votingDateH3.classList.add('hidden');
                    if(votingTimeSlotsContainer) votingTimeSlotsContainer.classList.add('hidden');
                    if(votingTimeH3) votingTimeH3.classList.add('hidden');
                    if(votingPollOptionsContainer) votingPollOptionsContainer.classList.add('hidden'); 
                    if(votingPollH3) votingPollH3.classList.add('hidden'); 


                    let candidates;

                    if (createdSchedule.type === 'date') {
                        if(votingCalendarContainer) votingCalendarContainer.classList.remove('hidden');
                        if(votingDateH3) votingDateH3.classList.remove('hidden');
                        renderCalendar(votingCalendarContainer, currentMonth, currentYear, false, createdSchedule.dates || [], isMultipleSelection);
                        candidates = createdSchedule.dates || [];
                    
                    } else if (createdSchedule.type === 'time' && createdSchedule.candidates) {
                        if(votingCalendarContainer) {
                            votingCalendarContainer.classList.remove('hidden');
                            votingCalendarContainer.innerHTML = '';
                        }
                        if(votingTimeH3) votingTimeH3.classList.remove('hidden');

                        const datetimeListContainer = document.createElement('div');
                        datetimeListContainer.className = 'space-y-4';
                        
                        const scheduleCandidates = createdSchedule.candidates;
                        const sortedDates = Object.keys(scheduleCandidates).sort();
                        
                        candidates = [];

                        for (const date of sortedDates) {
                            const times = scheduleCandidates[date];
                            
                            const dateObj = new Date(date + 'T00:00:00');
                            const displayDate = `${date} (${translations[currentLang].daysOfWeek[dateObj.getDay()]})`;

                            const dateHeader = document.createElement('h4');
                            dateHeader.className = 'font-bold text-lg text-gray-800 dark:text-gray-200 pt-2';
                            dateHeader.textContent = displayDate;
                            datetimeListContainer.appendChild(dateHeader);
                            
                            const timeGrid = document.createElement('div');
                            timeGrid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-2';
                            
                            for (const time of times) {
                                const uniqueId = `dt-${date}-${time.replace(/[:\s-]/g, '')}`;
                                const datetimeString = `${date} ${time}`;
                                candidates.push(datetimeString);

                                const optionElement = document.createElement('div');
                                optionElement.className = 'border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
                                
                                const inputType = isMultipleSelection ? 'checkbox' : 'radio';
                                optionElement.innerHTML = `
                                    <label for="${uniqueId}" class="flex items-center space-x-2 p-3 cursor-pointer">
                                        <input type="${inputType}" id="${uniqueId}" name="datetime-option" value="${datetimeString}" class="datetime-vote-input rounded text-blue-500 h-5 w-5 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500">
                                        <span class="text-gray-800 dark:text-gray-200 w-full">${time}</span>
                                    </label>
                                `;
                                
                                const inputElement = optionElement.querySelector('input');
                                if (!inputElement) continue;

                                if (selectedDates.has(datetimeString)) {
                                    inputElement.checked = true;
                                }
                                
                                optionElement.addEventListener('click', (e) => {
                                    if (e.target.tagName !== 'INPUT') {
                                        if (isMultipleSelection) {
                                            inputElement.checked = !inputElement.checked;
                                        } else {
                                            inputElement.checked = true;
                                        }
                                    }
                                    
                                    if (notAvailableCheckbox) notAvailableCheckbox.checked = false;
                                    
                                    const selectedOption = inputElement.value;

                                    if (!isMultipleSelection) {
                                        selectedDates.clear(); 
                                        selectedDates.add(selectedOption);
                                        document.querySelectorAll('.datetime-vote-input').forEach(radio => {
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
                                
                                timeGrid.appendChild(optionElement);
                            }
                            datetimeListContainer.appendChild(timeGrid);
                        }
                        if(votingCalendarContainer) votingCalendarContainer.appendChild(datetimeListContainer);

                    } else if (createdSchedule.type === 'time' && createdSchedule.timeSlots) {
                        if(votingTimeSlotsContainer) votingTimeSlotsContainer.classList.remove('hidden');
                        if(votingTimeH3) votingTimeH3.classList.remove('hidden');
                        generateTimeSlots(votingTimeSlotsContainer, false, createdSchedule.timeSlots || [], isMultipleSelection);
                        candidates = createdSchedule.timeSlots || [];

                    } else if (createdSchedule.type === 'poll') {
                        if(votingPollH3) votingPollH3.classList.remove('hidden');
                        if(votingPollOptionsContainer) {
                             votingPollOptionsContainer.classList.remove('hidden');
                             votingPollOptionsContainer.innerHTML = '';
                        }

                        candidates = createdSchedule.options || [];

                        (createdSchedule.options || []).forEach(option => {
                            const optionElement = document.createElement('div');
                            optionElement.className = 'border rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';
                            
                            const inputType = isMultipleSelection ? 'checkbox' : 'radio';
                            const inputId = `poll-option-${option.replace(/\s+/g, '-')}`; 

                            optionElement.innerHTML = `
                                <label for="${inputId}" class="flex items-center space-x-3 p-3 cursor-pointer">
                                    <input type="${inputType}" id="${inputId}" name="poll-option" value="${option}" class="poll-vote-input rounded text-blue-500 h-5 w-5 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500">
                                    <span class="text-gray-800 dark:text-gray-200 cursor-pointer w-full">${option}</span>
                                </label>
                            `;
                            if(votingPollOptionsContainer) votingPollOptionsContainer.appendChild(optionElement);

                            const inputElement = optionElement.querySelector('input');
                            if(!inputElement) return; 

                            if (selectedDates.has(option)) {
                                inputElement.checked = true;
                            }

                            optionElement.addEventListener('click', (e) => {
                                if (e.target.tagName !== 'INPUT') {
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
                
                let votes;
                if (currentSchedule.type === 'date' || currentSchedule.type === 'poll') {
                    votes = selectedDates;
                } else if (currentSchedule.type === 'time' && currentSchedule.candidates) {
                    votes = selectedDates;
                } else if (currentSchedule.type === 'time' && currentSchedule.timeSlots) {
                    votes = selectedTimeSlots;
                } else {
                    votes = new Set();
                }

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

                selectedDates.clear(); 
                selectedTimeSlots.clear(); 
                
                document.querySelectorAll('.poll-vote-input, .datetime-vote-input').forEach(input => input.checked = false);
                document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
                document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                
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
                    document.querySelectorAll('.poll-vote-input, .datetime-vote-input').forEach(input => input.checked = false);
                } else {
                    if(notAvailableCommentContainer) notAvailableCommentContainer.classList.add('hidden');
                }
            });
        }
    } 
}

document.addEventListener('DOMContentLoaded', async () => {
    // --- ▼▼ [修正] ハンバーガーメニュー関連の要素を取得 ▼▼ ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuContent = document.getElementById('mobile-menu-content');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    // --- ▲▲ [修正] ---

    const themeTogglePC = document.getElementById('theme-toggle-pc');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    // --- ▼▼ [修正] ハンバーガーメニューの `toggleMobileMenu` 関数を修正 ▼▼ ---
    // （グローバルスコープから DOMContentLoaded 内に移動し、堅牢化）
    const toggleMobileMenu = () => {
        if (mobileMenuContent && mobileMenuOverlay) {
            mobileMenuContent.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        }
    };
    
    updateContent(currentLang); 
    
    // [修正] テーマアイコンの初期描画を修正
    // applyThemeはlocalStorageの値に基づいてアイコンを正しく設定する
    if (localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
    }
    applyTheme(themeTogglePC);
    applyTheme(themeToggleMobile);

    // --- ▼▼ [追加] ハンバーガーメニューのイベントリスナー ▼▼ ---
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    }
    // メニュー内のリンクをクリックしたらメニューを閉じる
    document.querySelectorAll('#mobile-menu-content a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuContent && mobileMenuContent.classList.contains('active')) {
                toggleMobileMenu();
            }
            // 注意: ページ遷移しないリンク（例: '使い方'）の場合はこれだけでよいが、
            // ページ遷移（例: 'マイアンケート'）する場合は遷移が優先される
        })
    });
    // --- ▲▲ [追加] ---


    // --- ▼▼ [修正] 新しい言語プルダウン制御ロジック ▼▼ ---
    const setupLangDropdown = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const button = container.querySelector('button[id^="lang-dropdown-button-"]');
        const menu = container.querySelector('div[id^="lang-dropdown-menu-"]');

        if (!button || !menu) return;

        // ボタンクリックでメニューを開閉
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // 他のクリックイベント（ドキュメント）に伝播させない
            
            // 他のプルダウン（PC/スマホ）が開いていれば閉じる
            if (containerId === 'lang-dropdown-container-pc') {
                document.getElementById('lang-dropdown-menu-mobile')?.classList.add('hidden');
            } else if (containerId === 'lang-dropdown-container-mobile') {
                document.getElementById('lang-dropdown-menu-pc')?.classList.add('hidden');
            }
            
            menu.classList.toggle('hidden');
        });

        // メニューのリンクをクリックしたら言語切り替え
        menu.querySelectorAll('a[data-lang]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // イベント伝播を止める
                
                const selectedLang = link.dataset.lang;
                if (selectedLang !== currentLang) {
                    currentLang = selectedLang;
                    localStorage.setItem('lang', currentLang);
                    updateContent(currentLang);
                    
                    // カレンダーなどが開いている場合はリロードで対応（元のロジックを踏襲）
                    const calendarContainer = document.getElementById('calendar-container');
                    if (calendarContainer && !calendarContainer.classList.contains('hidden')) {
                        window.location.reload();
                    }
                    const timeCalendarContainer = document.getElementById('time-calendar-container');
                    if (timeCalendarContainer && !timeCalendarContainer.classList.contains('hidden')) {
                        window.location.reload();
                    }
                }
                menu.classList.add('hidden'); // メニューを閉じる
            });
        });
    };

    setupLangDropdown('lang-dropdown-container-pc');
    setupLangDropdown('lang-dropdown-container-mobile');

    // ページ上のどこか（ボタンとメニュー以外）をクリックしたらメニューを閉じる
    document.addEventListener('click', (e) => {
        // PC
        const pcContainer = document.getElementById('lang-dropdown-container-pc');
        if (pcContainer && !pcContainer.contains(e.target)) {
            document.getElementById('lang-dropdown-menu-pc')?.classList.add('hidden');
        }
        // Mobile (メニューパネル *内* のプルダウン)
        const mobileContainer = document.getElementById('lang-dropdown-container-mobile');
        if (mobileContainer && !mobileContainer.contains(e.target)) {
            document.getElementById('lang-dropdown-menu-mobile')?.classList.add('hidden');
        }
    });
    // --- ▲▲ [修正] ---

    if (themeTogglePC) themeTogglePC.addEventListener('click', handleThemeToggle);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', handleThemeToggle);

    onAuthStateChanged(auth, (user) => {
        mainAppLogic(user); // mainAppLogic を先に実行
        updateHeader(user); // グローバルスコープの updateHeader を呼び出す
    });
});