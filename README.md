# Sarastya Task Manager - Frontend Web

Aplikasi manajemen tugas modern yang memungkinkan pengguna untuk membuat, mengelola, dan melacak tugas mereka dengan antarmuka yang intuitif dan responsif. Dibangun dengan teknologi terkini untuk memberikan pengalaman pengguna yang optimal.

## 📋 Daftar Isi

- [Deskripsi Proyek](#-deskripsi-proyek)
- [Teknologi Utama](#-teknologi-utama)
- [Arsitektur & Pola Desain](#-arsitektur--pola-desain)
- [Setup & Instalasi](#-setup--instalasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Deployment](#-deployment)
- [Struktur Proyek](#-struktur-proyek)
- [Fitur Utama](#-fitur-utama)
- [Akses Aplikasi](#-akses-aplikasi)
- [Link Deployment](#-link-deployment)

---

## 🎯 Deskripsi Proyek

Sarastya Task Manager adalah aplikasi web full-stack untuk manajemen tugas dengan fitur-fitur berikut:

- **Autentikasi Pengguna**: Register dan login dengan sistem token-based authentication
- **Manajemen Tugas**: Buat, baca, perbarui, dan hapus tugas
- **Filtering & Pencarian**: Filter berdasarkan status, prioritas, dan pencarian teks
- **Status Tracking**: Lacak progres tugas dengan status (To-Do, In-Progress, Done)
- **Prioritas Tugas**: Tentukan prioritas tugas (Low, Medium, High)
- **Responsif**: Desain yang beradaptasi dengan semua ukuran layar

---

## 🛠️ Teknologi Utama

### Frontend Web (Repository ini)

| Teknologi        | Versi   | Kegunaan                                  |
| ---------------- | ------- | ----------------------------------------- |
| **Next.js**      | 16.0.3  | Framework React full-stack dengan SSR/SSG |
| **React**        | 19.2.0  | Library UI component                      |
| **TypeScript**   | 5       | Type-safe JavaScript                      |
| **Tailwind CSS** | 4       | Utility-first CSS framework               |
| **Radix UI**     | Latest  | Headless UI components library            |
| **Lucide React** | 0.553.0 | Icon library                              |
| **Sonner**       | 2.0.7   | Toast notification library                |
| **Date-fns**     | 4.1.0   | Utility library untuk manipulasi tanggal  |

### Backend API

- **Node.js / Express** - REST API server
- **JWT** - Authentication token management
- **Database** - PostgreSQL / MongoDB (sesuai backend)

---

## 🏗️ Arsitektur & Pola Desain

### Arsitektur Umum

```
┌─────────────────────────────────────────────┐
│         Frontend Web (Next.js)              │
│  ┌───────────────────────────────────────┐  │
│  │  UI Components (Radix UI + Tailwind)  │  │
│  └──────────────┬──────────────────────┘  │
│                 │                           │
│  ┌──────────────▼──────────────────────┐  │
│  │  React Context (State Management)   │  │
│  │  ├─ AuthContext                     │  │
│  │  └─ TaskContext                     │  │
│  └──────────────┬──────────────────────┘  │
│                 │                           │
│  ┌──────────────▼──────────────────────┐  │
│  │     API Layer (lib/api.ts)          │  │
│  └──────────────┬──────────────────────┘  │
└─────────────────┼──────────────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  Backend API     │
        │  (REST)          │
        └──────────────────┘
```

### Pola Desain yang Diterapkan

#### 1. **Context API Pattern** (State Management)

Menggunakan React Context untuk mengelola state global:

```typescript
// contexts/AuthContext.tsx
// Context untuk autentikasi global pengguna
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Menyimpan token & user di localStorage untuk persistensi
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return <AuthContext.Provider value={{...}}>{children}</AuthContext.Provider>;
}

// Hooks untuk mengakses context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
```

**Keuntungan**: Menghindari prop drilling, state terpusat, mudah di-test

#### 2. **Custom Hooks Pattern** (Logic Reusability)

```typescript
// Custom hook yang menggunakan context
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
}
```

#### 3. **Composition Pattern** (Component Reusability)

Komponen-komponen dibangun dengan komposisi untuk fleksibilitas maksimal:

```typescript
// components/ui/button.tsx - Base component yang dapat di-extend
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

// Digunakan di komponen-komponen lain
import { Button } from "@/components/ui/button";

export function TaskCard({ task }) {
  return (
    <div>
      <Button onClick={() => handleEdit(task)}>Edit</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}
```

#### 4. **Adapter Pattern** (API Integration)

```typescript
// lib/api.ts - API adapter untuk fetch calls
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// Digunakan di contexts untuk API calls
const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

#### 5. **Separation of Concerns**

- **Pages** (`app/`) - Route handlers dan page structure
- **Components** (`components/`) - Reusable UI components
- **Contexts** (`contexts/`) - State management logic
- **Utils** (`lib/`) - Utility functions dan helpers

---

## 📦 Setup & Instalasi

### Prasyarat

Pastikan Anda telah menginstal:

- **Node.js** (versi 18.x atau lebih tinggi)
- **npm** atau **yarn** atau **pnpm**
- **Git**

### Instalasi Frontend Web

1. **Clone repository**

```bash
git clone https://github.com/rakha-tech/taskmanager-web.git
cd frontend-web
```

2. **Install dependencies**

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. **Setup environment variables**

Buat file `.env.local` di root direktori frontend:

```bash
cp .env.example .env.local
```

Isi file `.env.local` dengan konfigurasi berikut:

```
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# (Optional) Tambahkan variabel lain sesuai kebutuhan
NEXT_PUBLIC_APP_NAME=Sarastya Task Manager
```

### Setup Backend API

1. **Clone backend repository** (jika belum ada)

```bash
git clone https://github.com/rakha-tech/taskmanager-api.git
cd backend
```

2. **Install dependencies backend**

```bash
npm install
```

3. **Setup environment variables backend**

```bash
cp .env.example .env
```

Isi file `.env`:

```
NODE_ENV=development
PORT=3001
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```

4. **Setup database**

```bash
npm run migrate
# atau (sesuai dokumentasi backend)
npm run db:init
```

---

## 🚀 Menjalankan Aplikasi

### Mode Development

#### Terminal 1 - Backend API

```bash
cd backend
npm run dev
# Backend akan running di http://localhost:3001
```

#### Terminal 2 - Frontend Web

```bash
cd frontend-web
npm run dev
# Frontend akan running di http://localhost:3000
```

Buka browser dan akses: **http://localhost:3000**

### Mode Production

#### Build Frontend

```bash
npm run build
npm start
```

#### Build & Deploy Backend

```bash
npm run build
NODE_ENV=production npm start
```

---

## 📱 Deployment

### Frontend Web Deployment

#### Option 1: Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

atau connect repository di https://vercel.com/dashboard

**Konfigurasi Vercel:**

- Framework: Next.js
- Environment Variables: `NEXT_PUBLIC_API_BASE_URL`

#### Option 2: Netlify

```bash
npm i -g netlify-cli
netlify deploy
```

#### Option 3: Self-hosted (VPS/Dedicated Server)

```bash
# Build aplikasi
npm run build

# Deploy ke server
scp -r .next/ user@server:/path/to/app/

# Di server
cd /path/to/app
npm install --production
npm start
```

### Backend API Deployment

#### Option 1: Heroku

```bash
heroku login
heroku create your-app-name
git push heroku main
```

#### Option 2: Railway / Render

Deploy melalui platform UI dengan menghubungkan GitHub repository

#### Option 3: Self-hosted

```bash
# Di server
npm install --production
NODE_ENV=production npm start
```

---

## 📋 Struktur Proyek

```
frontend-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout dengan providers
│   ├── page.tsx                 # Home/redirect page
│   ├── globals.css              # Global styles
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── register/
│   │   └── page.tsx             # Register page
│   └── dashboard/
│       └── page.tsx             # Dashboard page (protected)
│
├── components/                   # Reusable React components
│   ├── DashboardHeader.tsx       # Header dengan user info
│   ├── TaskCard.tsx             # Komponen kartu tugas
│   ├── TaskDialog.tsx           # Modal untuk tambah/edit tugas
│   ├── TaskFilters.tsx          # Filter dan pencarian
│   ├── auth/
│   │   ├── LoginForm.tsx        # Form login
│   │   └── RegisterForm.tsx     # Form register
│   ├── dashboard/
│   │   └── Dashboard.tsx        # Dashboard utama
│   └── ui/                      # Headless UI components (Radix UI)
│       ├── alert-dialog.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ... (komponen UI lainnya)
│
├── contexts/                     # React Context untuk state management
│   ├── AuthContext.tsx          # Context untuk autentikasi
│   └── TaskContext.tsx          # Context untuk manajemen tugas
│
├── lib/                         # Utility functions & helpers
│   ├── api.ts                   # API configuration & base URL
│   └── utils.ts                 # Utility functions (cn, classnames, dll)
│
├── public/                      # Static assets
│   └── ... (images, icons, etc)
│
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.mjs          # PostCSS configuration
├── components.json             # Shadcn/ui configuration
├── package.json                # Dependencies & scripts
├── .env.local                  # Environment variables (git-ignored)
└── README.md                   # Dokumentasi proyek (file ini)
```

---

## ✨ Fitur Utama

### 1. Autentikasi Pengguna

- **Register**: Membuat akun baru dengan email & password
- **Login**: Masuk dengan kredensial yang terdaftar
- **Session Persistence**: Token disimpan di localStorage untuk persistent login
- **Protected Routes**: Dashboard hanya dapat diakses oleh pengguna yang login

```typescript
// Pengecekan autentikasi di halaman yang dilindungi
useEffect(() => {
  if (!authLoading && !user) {
    router.push("/login");
  }
}, [user, authLoading, router]);
```

### 2. Manajemen Tugas (CRUD)

- **Create**: Tambah tugas baru dengan title, description, priority, due date
- **Read**: Tampilkan daftar tugas dalam bentuk kartu
- **Update**: Edit tugas yang sudah ada
- **Delete**: Hapus tugas dengan konfirmasi

```typescript
// Contoh context method untuk CRUD
const addTask = async (task: Omit<Task, "id" | "createdAt" | "userId">) => {
  const res = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(task),
  });
  // ... handle response
};
```

### 3. Filtering & Pencarian

- **Search**: Cari tugas berdasarkan judul atau deskripsi
- **Status Filter**: Filter berdasarkan status (All, To-Do, In-Progress, Done)
- **Priority Filter**: Filter berdasarkan prioritas (All, Low, Medium, High)

```typescript
// Filtering logic menggunakan useMemo untuk performa optimal
const filteredTasks = useMemo(() => {
  return tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
}, [tasks, searchQuery, statusFilter, priorityFilter]);
```

### 4. UI/UX Features

- **Responsive Design**: Mobile-first approach dengan Tailwind CSS
- **Toast Notifications**: Feedback untuk user actions (Sonner library)
- **Dialog/Modal**: Untuk form input tugas baru
- **Alert Confirmation**: Konfirmasi sebelum delete
- **Loading States**: Indikator loading saat fetch data
- **Error Handling**: Pesan error yang user-friendly

---

## 🔧 Instruksi Penggunaan Aplikasi

### Alur Penggunaan

1. **Register/Login**: Masuk ke aplikasi melalui halaman login atau register
2. **Dashboard**: Lihat daftar tugas Anda yang sudah tersimpan
3. **Tambah Tugas**: Klik tombol "New Task" dan isi form
4. **Edit Tugas**: Klik pada kartu tugas untuk edit
5. **Filter Tugas**: Gunakan filter status dan prioritas untuk mencari tugas
6. **Pencarian**: Gunakan search bar untuk mencari tugas spesifik
7. **Update Status**: Ubah status tugas dari dropdown
8. **Hapus Tugas**: Klik tombol delete dan konfirmasi
9. **Logout**: Klik avatar/menu user untuk logout

---

## 🌐 Akses Aplikasi

### Development Lokal

Pastikan backend API sudah running di `http://localhost:3001` sebelum menjalankan frontend:

```bash
# Terminal 1 - Backend
cd TaskManager.Api
dotnet run

# Terminal 2 - Frontend
cd frontend-web
npm run dev
```

Buka browser: **http://localhost:3000**

### Akun Demo (untuk testing)

Gunakan kredensial berikut untuk login atau daftar akun baru:

```
Email: demo@example.com
Password: Demo123!
```

---

## 🌐 Link Deployment

### Frontend Web

- **Production**: https://taskmanager-rakha.vercel.app/ (atau URL deployment yang sesuai)
- **Backend API**: https://taskmanager-api-production-2c84.up.railway.app

### Untuk Testing

1. Buka aplikasi di browser
2. Register akun baru atau gunakan akun demo
3. Setelah login, akses dashboard untuk mengelola tugas

---

## 📝 Catatan Code untuk Bagian Kompleks

### TaskContext.tsx - Task State Management

```typescript
// Normalisasi task data dari API untuk konsistensi
const normalizeTask = (t: any): Task => ({
  ...t,
  // Convert API status format ke aplikasi format
  // API mungkin mengirim "INPROGRESS", ubah ke "in-progress"
  status: t.status.toLowerCase().replace("inprogress", "in-progress"),
  priority: t.priority.toLowerCase(),
});

// Hook untuk membaca context dengan error handling
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within TaskProvider");
  }
  return context;
}

// Effect hook untuk auto-fetch tasks saat user login
useEffect(() => {
  if (user && token) {
    fetchTasks(); // Fetch otomatis saat ada user & token
  } else {
    setTasks([]); // Clear tasks saat logout
  }
}, [user, token]);
```

### Dashboard.tsx - Complex Filtering

```typescript
// useMemo untuk optimasi performa - hanya recalculate saat dependencies berubah
const filteredTasks = useMemo(() => {
  return tasks.filter((task) => {
    // Multi-field search
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter dengan "all" option
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    // Priority filter dengan "all" option
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    // Semua filter harus terpenuhi
    return matchesSearch && matchesStatus && matchesPriority;
  });
}, [tasks, searchQuery, statusFilter, priorityFilter]);
```

### AuthContext.tsx - Token Management

```typescript
// Persistent session menggunakan localStorage
useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser)); // Parse JSON user object
  }
  setIsLoading(false); // Set loading false setelah check
}, []);

// Async login dengan error handling
const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();

    // Store token dan user untuk persistensi
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  } catch (error) {
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🐛 Troubleshooting

### Masalah Umum

| Masalah                              | Solusi                                                       |
| ------------------------------------ | ------------------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` undefined | Pastikan file `.env.local` ada dan benar                     |
| Backend API error 401 (Unauthorized) | Cek token di localStorage, pastikan backend running          |
| CORS error                           | Konfigurasi CORS di backend dengan `FRONTEND_URL` yang benar |
| Components not found                 | Pastikan import path benar: `@/components/...`               |
| Build error TypeScript               | Jalankan `npm run lint` untuk cek type errors                |

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📄 License

Project ini dilisensikan di bawah MIT License.

---

## 👥 Tim Pengembang

- **Rakha Tech** - Lead Developer

---

## 📞 Kontak & Support

- Email: mrakha.tech@gmail.com
- GitHub Issues: https://github.com/rakha-tech/taskmanager-web/issues

---

**Last Updated**: November 19, 2025

Untuk pertanyaan atau kontribusi, silakan buka issue atau pull request di repository ini.
