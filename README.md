# SkillSwap 🔄

**Trade skills, not money.** A full-stack platform where people exchange skills instead of paying for courses — "I teach Java and want to learn Baking."

Built with:
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui-style components + Framer Motion
- **Backend:** Spring Boot 3 + Spring Security + JWT + Spring Data JPA
- **Database:** SQLite

---

## ✨ Features

- Beautiful, responsive, dark-mode landing page with glassmorphism and animations
- Register / Login with JWT authentication (BCrypt password hashing)
- User profiles: photo (uploaded as image, stored as base64), bio, location, skills offered, skills wanted
- 10 predefined skills: Java, Python, Web Development, UI/UX Design, Graphic Design, Photography, Video Editing, Guitar, Baking, Fitness
- Browse & search users by name/bio or filter by skill
- View any user's public profile
- Send a private message to any user to propose a skill exchange
- Full private messaging system with conversation threads
- Automatic notifications when you receive a new message
- Dashboard summarizing your profile, recent chats, and notifications
- Clean layered backend architecture: **Controller → Service → Repository → Entity**

No mock data, no placeholders — every screen is wired to real REST APIs backed by SQLite.

---

## 📁 Project Structure

```
skillswap/
├── backend/               # Spring Boot API (port 8080)
│   ├── pom.xml
│   └── src/main/java/com/skillswap/
│       ├── config/        # Security, CORS, data seeder
│       ├── security/      # JWT filter, JWT util, UserDetailsService
│       ├── entity/        # User, Skill, Message, Notification
│       ├── repository/    # Spring Data JPA repositories
│       ├── dto/           # Request/response DTOs
│       ├── service/       # Business logic
│       ├── controller/    # REST endpoints
│       └── exception/     # Global exception handling
└── frontend/               # React app (port 5173)
    └── src/
        ├── components/    # UI primitives + shared components
        ├── pages/         # Landing, Login, Register, Dashboard, Profile, Browse, Messages, Notifications
        ├── context/       # AuthContext (JWT session)
        ├── lib/           # Axios API client, utils
        └── types/         # Shared TypeScript types
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Java 17+** and **Maven 3.8+** (backend)
- **Node.js 18+** and **npm** (frontend)

### 1. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

The API server starts on **http://localhost:8080**.

- On first run, Spring Boot automatically creates a SQLite database file `skillswap.db` in the `backend/` folder and seeds it with the 10 predefined skills (via `DataSeeder`).
- No manual database setup is required — SQLite is file-based.
- `spring.jpa.hibernate.ddl-auto=update` will auto-create/update all tables from the JPA entities.

To build a runnable jar instead:
```bash
mvn clean package
java -jar target/skillswap-backend.jar
```

### 2. Frontend (React + Vite)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** and proxies all `/api/*` requests to the backend at `http://localhost:8080` (configured in `vite.config.ts`).

Open **http://localhost:5173** in your browser.

### 3. Try it out

1. Register two accounts (e.g. in two different browser tabs/incognito windows).
2. Fill in each profile with skills offered/wanted (e.g. User A teaches Java, wants Baking; User B teaches Baking, wants Java).
3. Go to **Browse**, find the other user, open their profile, and click **Send Message**.
4. Check **Messages** and **Notifications** — the recipient will see a new notification and can reply.

---

## 🔑 Configuration

Backend config lives in `backend/src/main/resources/application.properties`:

```properties
jwt.secret=skillswap_super_secret_signing_key_change_in_production_2024_min_256_bits
jwt.expiration-ms=86400000
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

**Important:** Change `jwt.secret` before deploying to production.

---

## 🧩 REST API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account, returns JWT | No |
| POST | `/api/auth/login` | Log in, returns JWT | No |
| GET | `/api/skills` | List the 10 predefined skills | No |
| GET | `/api/users/me` | Current user's full profile | Yes |
| PUT | `/api/users/me` | Update profile (bio, photo, skills, etc.) | Yes |
| GET | `/api/users/{id}` | View another user's public profile | Yes |
| GET | `/api/users?query=&skillId=` | Browse/search users | Yes |
| POST | `/api/messages` | Send a message `{receiverId, content}` | Yes |
| GET | `/api/messages/conversations` | List conversation threads | Yes |
| GET | `/api/messages/{partnerId}` | Get full conversation with a user | Yes |
| GET | `/api/notifications` | List notifications | Yes |
| GET | `/api/notifications/unread-count` | Unread notification count | Yes |
| PUT | `/api/notifications/{id}/read` | Mark one notification read | Yes |
| PUT | `/api/notifications/read-all` | Mark all notifications read | Yes |

All authenticated endpoints require an `Authorization: Bearer <token>` header. The frontend's Axios client (`src/lib/api.ts`) attaches this automatically from `localStorage`.

---

## 🗄️ Data Model

- **User** ↔ **Skill** — two many-to-many relations (`user_skills_offered`, `user_skills_wanted`)
- **Message** — many-to-one to `sender` (User) and `receiver` (User)
- **Notification** — many-to-one to `recipient` (User) and optional `actor` (User)

Sending a message automatically creates a `NEW_MESSAGE` notification for the recipient.

---

## 🛠️ Troubleshooting

- **Port already in use:** change `server.port` in `application.properties` (backend) or the `server.port` in `vite.config.ts` (frontend), updating the proxy target to match.
- **CORS errors:** ensure the frontend origin is listed in `app.cors.allowed-origins`.
- **Stale login:** the JWT is stored in `localStorage` under `skillswap_token`. Clear it if you need a fresh session.
- **Reset the database:** stop the backend and delete `backend/skillswap.db`, then restart — it will be recreated and reseeded.

---

Enjoy swapping skills! 🎉
