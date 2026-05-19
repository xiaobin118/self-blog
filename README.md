# Self Blog

A personal blog built with React 19, TypeScript, Tailwind CSS 4, and a Node.js + Express + Prisma backend.

## Features

- Responsive design with dark mode support
- GitHub OAuth authentication
- Article management (CRUD) with Markdown support
- Tag system with filtering
- Comment system with nested replies
- Admin dashboard for content management
- Framer Motion animations
- SEO-friendly slug-based URLs

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Framer Motion
- React Router v7
- Axios

**Backend:**
- Node.js + Express 5
- TypeScript
- Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- Passport.js (GitHub OAuth)
- JWT authentication

## Local Development

### Prerequisites

- Node.js v20+
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/self-blog.git
cd self-blog
```

2. Setup backend:
```bash
cd backend
cp .env.example .env
# Edit .env with your GitHub OAuth credentials and JWT secret
npm install
npx prisma migrate dev
npm run dev
```

3. Setup frontend (in a new terminal):
```bash
cd self-blog
cp .env.example .env
npm install
npm run dev
```

4. Open http://localhost:5173

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Homepage URL to `http://localhost:5173`
4. Set Callback URL to `http://localhost:3000/api/auth/github/callback`
5. Copy Client ID and Client Secret to `backend/.env`

### Admin Access

Set `ADMIN_GITHUB_IDS` in `backend/.env` to your GitHub user ID (numeric). Find it at `https://api.github.com/users/<username>`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth Client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `ADMIN_GITHUB_IDS` | Comma-separated GitHub user IDs | Yes |
| `PORT` | Server port (default: 3000) | No |

### Frontend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:3000` |

## API Endpoints

### Auth
- `GET /api/auth/github` — Redirect to GitHub OAuth
- `GET /api/auth/github/callback` — OAuth callback
- `GET /api/auth/me` — Get current user (requires auth)

### Posts
- `GET /api/posts` — List published posts (supports `?page=`, `?limit=`, `?q=`, `?tag=`)
- `GET /api/posts/:slug` — Get post by slug
- `POST /api/posts` — Create post (admin only)
- `PUT /api/posts/:id` — Update post (admin only)
- `DELETE /api/posts/:id` — Delete post (admin only)

### Tags
- `GET /api/tags` — List all tags with post counts

### Comments
- `GET /api/comments?postId=xxx` — Get comments for a post
- `POST /api/comments` — Create comment (requires auth)
- `DELETE /api/comments/:id` — Delete comment (admin or author)
- `PUT /api/comments/:id/approve` — Approve comment (admin only)

## Deployment

### Frontend (GitHub Pages)

Push to `main` branch triggers automatic deployment via GitHub Actions.

### Backend (Render)

1. Connect your GitHub repo to [Render](https://render.com)
2. Use the `render.yaml` blueprint
3. Set environment variables in Render dashboard
4. Use PostgreSQL for production: set `DATABASE_URL` to your PostgreSQL connection string
5. Run `npx prisma migrate deploy` on deploy

### Database

- **Development:** SQLite (`file:./dev.db`)
- **Production:** PostgreSQL (set via `DATABASE_URL`)

To switch to PostgreSQL in production, update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Project Structure

```
├── backend/
│   ├── prisma/          # Database schema & migrations
│   └── src/
│       ├── config/      # Environment & Passport config
│       ├── controllers/ # Route handlers
│       ├── lib/         # Prisma client singleton
│       ├── middleware/   # Auth, error handling, validation
│       ├── routes/      # Express routes
│       ├── types/       # TypeScript type definitions
│       └── utils/       # Utility functions
├── src/
│   ├── api/             # API client & types
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── data/            # Static data (legacy)
│   ├── hooks/           # Custom React hooks
│   └── pages/           # Route pages
└── public/              # Static assets
```

## License

MIT
