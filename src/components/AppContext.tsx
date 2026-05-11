import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Language = 'id' | 'en';
type Role = 'user' | 'admin';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  role: Role;
  setRole: (role: Role) => void;
  t: (key: string) => string;
}

const translations = {
  id: {
    'settings.title': 'Pengaturan',
    'settings.account': 'Profil & Akun',
    'settings.appearance': 'Tampilan',
    'settings.notifications': 'Notifikasi',
    'settings.privacy': 'Privasi & Keamanan',
    'settings.language': 'Bahasa',
    
    'account.info': 'Informasi Akun',
    'account.changePass': 'Ubah Kata Sandi',
    'account.2fa': 'Autentikasi Dua Faktor',
    'account.logout': 'Keluar dari Akun',
    
    'appearance.title': 'Tema Antarmuka',
    'appearance.dark': 'Gelap',
    'appearance.light': 'Terang',
    'appearance.active': '(Aktif)',
    
    'language.title': 'Pilihan Bahasa',
    'language.id': 'Bahasa Indonesia',
    'language.en': 'English',
    'language.active': '(Aktif)',
    
    'privacy.title': 'Privasi & Keamanan',
    'privacy.dataSharing': 'Berbagi Data Analitik',
    'privacy.dataSharing.desc': 'Bantu kami meningkatkan layanan dengan membagikan data error dan penggunaan secara anonim.',
    'privacy.saveHistory': 'Simpan Riwayat Chat',
    'privacy.saveHistory.desc': 'Simpan percakapan secara lokal di perangkat Anda.',
    'privacy.clearHistory': 'Hapus Semua Riwayat',
    
    'comingSoon.title': 'Segera Hadir',
    'comingSoon.desc': 'Pengaturan ini sedang dalam tahap pengembangan.',

    'sidebar.dashboard': 'Dashboard',
    'sidebar.uploadFiles': 'Upload Files',
    'sidebar.settings': 'Pengaturan',
    'sidebar.getHelp': 'Dapatkan Bantuan!',
    'sidebar.logout': 'Logout',
    
    'sidebar.newChat': 'Chat Baru',
    'sidebar.history': 'Riwayat',
    'sidebar.support': 'Bantuan',
    'sidebar.feedback': 'Umpan Balik',

    'adminHero.welcome': 'Selamat Datang di ',
    'adminHero.desc': 'Asisten kampus cerdas Anda yang dirancang untuk membantu Anda menjalani kehidupan akademik dengan tepat dan mudah.',
    'adminHero.marquee': 'Halo Telyutizen! Butuh informasi apa? Aku siap membantu lohh!',
    
    'header.notification': 'Notifikasi',
    'header.noNewNotification': 'Tidak ada notifikasi baru',
    'header.noNotification': 'Tidak ada notifikasi',

    'userHero.welcome': 'Selamat Datang di',
    'userHero.desc': 'Saya adalah asisten virtual kampus Anda. Tanyakan jadwal, informasi akademik, atau panduan fasilitas kampus.',

    'adminCards.schedule': 'Jadwal Kuliah',
    'adminCards.scheduleDesc': 'Lihat jadwal kelas hari ini.',
    'adminCards.materials': 'Materi Kuliah',
    'adminCards.materialsDesc': 'Cari modul dan referensi.',
    'adminCards.calendar': 'Kalender Akademik',
    'adminCards.calendarDesc': 'Cek tanggal penting semester ini.',
    'adminCards.support': 'Bantuan Layanan',
    'adminCards.supportDesc': 'Hubungi layanan IT kampus.',
    
    'placeholder.help': 'Butuh informasi apa?',
    'placeholder.type': 'Ketik pesan Anda disini...',

    'help.title': 'Pusat Bantuan',
    'help.tutorial.title': 'Cara Penggunaan',
    'help.tutorial.1': '1. Chat dengan Xentri AI: Ketik pertanyaan Anda di kotak pencarian bawah, lalu tekan enter atau tombol kirim. Anda juga dapat mengunggah gambar untuk dianalisis.',
    'help.tutorial.2': '2. Mengganti Tema & Bahasa: Buka menu Pengaturan di sidebar kiri untuk mengubah tema (terang/gelap) dan bahasa antarmuka.',
    'help.tutorial.3': '3. Riwayat Chat: Akses percakapan Anda sebelumnya melalui menu Riwayat di sidebar.',
    'help.contact.title': 'Kontak & Bantuan Layanan',
    'help.contact.it': 'Call Center IT',
    'help.contact.email': 'Email Support',
    'help.faq.1.q': 'Apakah Xentri AI bisa diakses offline?',
    'help.faq.1.a': 'Tidak, Xentri AI membutuhkan koneksi internet untuk memproses pertanyaan Anda.',
    'help.faq.2.q': 'Apakah riwayat chat saya aman?',
    'help.faq.2.a': 'Ya, riwayat chat Anda disimpan sementara secara aman di perangkat Anda.',
    'help.close': 'Tutup',

    'history.title': 'Riwayat Percakapan',
    'history.desc': 'Lanjutkan percakapan sebelumnya atau ulas kembali informasi yang telah Anda dapatkan.',
    'history.clearAll': 'Hapus Semua Riwayat',
    'history.search': 'Cari riwayat (kata kunci)...',
    'history.empty.title': 'Belum ada riwayat percakapan',
    'history.empty.desc': 'Coba sesuaikan kata kunci atau filter tanggal Anda, atau mulai chat baru.',
    'history.group.today': 'Hari ini',
    'history.group.yesterday': 'Kemarin',
    'history.group.older': 'Terdahulu',
    'history.messages': 'pesan',
    'history.confirm.title': 'Hapus Semua Riwayat?',
    'history.confirm.desc': 'Tindakan ini tidak dapat dibatalkan. Semua riwayat percakapan Anda akan dihapus secara permanen dari perangkat ini.',
    'history.confirm.cancel': 'Batal',
    'history.confirm.delete': 'Ya, Hapus',

    'upload.fileSizeError': 'Ukuran file melebih batas 300MB.',
    'upload.missingFields': 'Harap lengkapi semua field.',
    'upload.error': 'Terjadi kesalahan saat mengunggah dataset.',
    'upload.title': 'Upload Dataset AI',
    'upload.pdfLabel': 'Upload PDF (Max 300MB)',
    'upload.titleLabel': 'Judul',
    'upload.categoryLabel': 'Kategori',
    'upload.uploading': 'Mengunggah...',
    'upload.submit': 'Submit Dataset',
  },
  en: {
    'settings.title': 'Settings',
    'settings.account': 'Profile & Account',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy & Security',
    'settings.language': 'Language',
    
    'account.info': 'Account Information',
    'account.changePass': 'Change Password',
    'account.2fa': 'Two-Factor Authentication',
    'account.logout': 'Log Out',
    
    'appearance.title': 'Interface Theme',
    'appearance.dark': 'Dark',
    'appearance.light': 'Light',
    'appearance.active': '(Active)',
    
    'language.title': 'Language Selection',
    'language.id': 'Indonesian',
    'language.en': 'English',
    'language.active': '(Active)',
    
    'privacy.title': 'Privacy & Security',
    'privacy.dataSharing': 'Analytics Data Sharing',
    'privacy.dataSharing.desc': 'Help us improve our service by sharing anonymous usage and crash data.',
    'privacy.saveHistory': 'Save Chat History',
    'privacy.saveHistory.desc': 'Save your conversations locally on this device.',
    'privacy.clearHistory': 'Clear All History',
    
    'comingSoon.title': 'Coming Soon',
    'comingSoon.desc': 'These settings are currently under development.',

    'sidebar.dashboard': 'Dashboard',
    'sidebar.uploadFiles': 'Upload Files',
    'sidebar.settings': 'Settings',
    'sidebar.getHelp': 'Get Help!',
    'sidebar.logout': 'Logout',
    
    'sidebar.newChat': 'New Chat',
    'sidebar.history': 'History',
    'sidebar.support': 'Support',
    'sidebar.feedback': 'Feedback',

    'adminHero.welcome': 'Welcome to ',
    'adminHero.desc': 'Your intelligent campus assistant designed to help you navigate academic life with precision and ease.',
    'adminHero.marquee': 'Hello! What information do you need? I am ready to help you!',
    
    'header.notification': 'Notifications',
    'header.noNewNotification': 'No new notifications',
    'header.noNotification': 'No notifications',

    'userHero.welcome': 'Welcome to',
    'userHero.desc': 'I am your virtual campus assistant. Ask for schedules, academic information, or campus facility guides.',

    'adminCards.schedule': 'Class Schedule',
    'adminCards.scheduleDesc': 'View today\'s class schedule.',
    'adminCards.materials': 'Course Materials',
    'adminCards.materialsDesc': 'Find modules and references.',
    'adminCards.calendar': 'Academic Calendar',
    'adminCards.calendarDesc': 'Check important dates this semester.',
    'adminCards.support': 'IT Support',
    'adminCards.supportDesc': 'Contact campus IT support.',
    
    'placeholder.help': 'What information do you need?',
    'placeholder.type': 'Type your message here...',

    'help.title': 'Help Center',
    'help.tutorial.title': 'How to Use',
    'help.tutorial.1': '1. Chat with Xentri AI: Type your question in the search box below, then press enter or the send button. You can also upload images to be analyzed.',
    'help.tutorial.2': '2. Change Theme & Language: Open the Settings menu in the left sidebar to change the theme (light/dark) and interface language.',
    'help.tutorial.3': '3. Chat History: Access your previous conversations via the History menu in the sidebar.',
    'help.contact.title': 'Contact & Live Support',
    'help.contact.it': 'IT Call Center',
    'help.contact.email': 'Email Support',
    'help.faq.1.q': 'Can Xentri AI be accessed offline?',
    'help.faq.1.a': 'No, Xentri AI requires an internet connection to process your questions.',
    'help.faq.2.q': 'Is my chat history secure?',
    'help.faq.2.a': 'Yes, your chat history is temporarily and securely stored on your device.',
    'help.close': 'Close',

    'history.title': 'Conversation History',
    'history.desc': 'Continue your previous conversations or review information you have received.',
    'history.clearAll': 'Clear All History',
    'history.search': 'Search history (keywords)...',
    'history.empty.title': 'No conversation history yet',
    'history.empty.desc': 'Try adjusting your keywords or date filter, or start a new chat.',
    'history.group.today': 'Today',
    'history.group.yesterday': 'Yesterday',
    'history.group.older': 'Older',
    'history.messages': 'messages',
    'history.confirm.title': 'Clear All History?',
    'history.confirm.desc': 'This action cannot be undone. All your conversation history will be permanently deleted from this device.',
    'history.confirm.cancel': 'Cancel',
    'history.confirm.delete': 'Yes, Delete',

    'upload.fileSizeError': 'File size exceeds 300MB limit.',
    'upload.missingFields': 'Please fill in all fields.',
    'upload.error': 'An error occurred while uploading the dataset.',
    'upload.title': 'Upload AI Dataset',
    'upload.pdfLabel': 'Upload PDF (Max 300MB)',
    'upload.titleLabel': 'Title',
    'upload.categoryLabel': 'Category',
    'upload.uploading': 'Uploading...',
    'upload.submit': 'Submit Dataset',
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('id');
  const [role, setRole] = useState<Role>('admin'); // Defaulting to admin since user asked for it

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['id']] || key;
  };

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, role, setRole, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
