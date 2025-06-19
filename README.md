
# 📝 DoToday

<div align="center">

![📝 DoToday](https://github.com/user-attachments/assets/edb1839a-ed0a-482e-a5c0-87991dfc0373)

**A modern, secure, and responsive web voting platform built with Next.js & Tailwind CSS**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[🚀 Demo](#) • [📚 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## 📁 Folder Structure

```
TO-DO-APP/
├── public/                  # Static files (images, icons, etc.)
├── src/
│   ├── app/
│   │   ├── api/             # API routes (RESTful)
│   │   │   ├── auth/        # Login & register
│   │   │   │   ├── login/route.js
│   │   │   │   └── register/route.js
│   │   │   └── todos/       # To-Do CRUD API
│   │   │       ├── [id]/route.js
│   │   │       └── route.js
│   │   ├── daftar/page.js   # Register page (UI)
│   │   └── to-do/           # Main to-do interface
│   │       ├── layout.js
│   │       └── page.js
│   ├── components/          # Reusable UI components
│   │   └── modal.js
│   └── lib/                 # Data logic and middleware
│       ├── data.js          # CRUD functions & file ops
│       ├── data.json        # JSON-based database
│       └── middleware.js    # Auth middleware or utils
├── styles/ (optional)       # Tailwind or global styles (globals.css)
├── .gitignore
├── package.json
├── README.md
└── vercel.json              # Vercel deployment config
```

---

## 🚀 Features

- ✅ Login & Register (with bcrypt password hashing)
- ✅ Add, update, delete, and list to-dos
- ✅ Simple file-based data store (`data.json`)
- ✅ Modular and clean architecture
- ✅ Built with `app/` directory in Next.js
- ✅ Responsive UI with Tailwind CSS
- ✅ No need for external databases or backend servers
- ✅ Ready to deploy on **Vercel**

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Node.js + Next.js API Routes
- **Storage**: Local JSON file (`src/lib/data.json`)
- **Security**: Password hashing with `bcrypt`
- **Deployment**: [Vercel](https://vercel.com/)

---

## ⚙️ Getting Started

### 1. Clone the project

```bash
git clone https://github.com/lewyinn/DoToday.git
cd DoToday
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running.

---

## 🧪 API Routes Overview

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/login` | `POST` | Login user |
| `/api/auth/register` | `POST` | Register user |
| `/api/todos` | `GET` | Get all to-dos |
| `/api/todos` | `POST` | Add new to-do |
| `/api/todos/:id` | `PUT` | Update to-do by ID |
| `/api/todos/:id` | `DELETE` | Delete to-do by ID |

---

## 🔐 User Authentication

Passwords are **hashed with `bcrypt`** and compared securely during login. All user data is stored in `src/lib/data.json`.

Example user structure:
```json
{
  "id": 1,
  "name": "Contoh",
  "email": "contoh@example.com",
  "password": "$2b$10$..."
}
```

---

## 🧾 JSON Database

Located at: `src/lib/data.json`

```json
{
  "users": [
    {
      "id": 1,
      "name": "Contoh",
      "email": "contoh@example.com",
      "password": "$2b$10$..."
    }
  ],
  "todos": []
}
```

---

## 🙌 Credits

Built with ❤️ using Next.js & Tailwind.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by [Moch Ridho Kurniawan](https://github.com/lewyinn)**

</div>
