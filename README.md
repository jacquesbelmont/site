# Astro Starter Kit: Basics

## Jacques Belmont - Professional Website

A complete professional website built with Astro, featuring:

- 🌐 Multi-language support (EN, ES, ZH-CN, AR, PT)
- 📝 Full-featured blog with SEO optimization
- 🎥 YouTube video integration
- 👥 Members area with subscription management
- 🛒 Digital store for products and services
- 🔧 Complete admin dashboard
- 📊 Analytics and SEO tools
- 🎨 Modern, responsive design

## 🚀 Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd jacques-belmont-website
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   ├── layouts/          # Page layouts
│   ├── pages/            # File-based routing
│   │   ├── api/          # API endpoints
│   │   ├── admin/        # Admin dashboard
│   │   ├── blog/         # Blog pages
│   │   └── ...
│   ├── lib/              # Utilities and database
│   ├── config/           # Configuration files
│   └── i18n/             # Internationalization
├── prisma/               # Database schema
└── package.json
```

## 🗄️ Database Setup

This project uses PostgreSQL with Prisma ORM. For production deployment:

### Local Development
```bash
# Install PostgreSQL locally or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/jacques_belmont_db"

# Run migrations and seed
npm run db:push
npm run db:seed
```

### Production (Vercel)
1. Create a Vercel Postgres database
2. Copy the connection strings to your environment variables
3. Deploy with automatic migrations

## 🌐 Deployment

### Vercel (Recommended)
1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push**

The project is configured for Vercel with:
- `vercel.json` configuration
- Automatic API routes
- PostgreSQL integration
- Static site generation where possible

### Other Platforms
The project can also be deployed to:
- Netlify (with serverless functions)
- Railway
- DigitalOcean App Platform
- Any Node.js hosting provider

## 🔧 Admin Dashboard

Access the admin dashboard at `/admin` with:
- **Username:** admin
- **Password:** admin123 (change in production!)

Features:
- Blog post management
- Video management
- Member management
- SEO settings
- Analytics configuration
- Translation management

## 🌍 Multi-language Support

The site supports 5 languages:
- English (default)
- Spanish
- Chinese (Simplified)
- Arabic (RTL support)
- Portuguese

URLs are structured as:
- `/` (English)
- `/es/` (Spanish)
- `/zh-cn/` (Chinese)
- `/ar/` (Arabic)
- `/pt/` (Portuguese)

## 📝 Blog Features

- SEO-optimized blog posts
- Categories and tags
- Featured images
- Reading time estimation
- Social sharing
- Comments system
- Related posts
- RSS feed

## 🛒 E-commerce Features

- Digital product management
- Stripe integration (ready)
- Member subscriptions
- Download delivery
- Order management

## 📊 SEO & Analytics

- Automatic sitemap generation
- Meta tags optimization
- Open Graph support
- Twitter Cards
- Structured data (JSON-LD)
- Google Analytics integration
- Search Console integration

## 🔒 Security Features

- JWT authentication
- Password hashing
- CSRF protection
- Rate limiting (ready)
- Input validation
- SQL injection prevention

## 🎨 Design System

- Tailwind CSS
- Custom color palette
- Responsive design
- Dark mode ready
- Accessibility compliant
- Modern animations

## 📱 Performance

- Optimized images
- Lazy loading
- Code splitting
- CDN ready
- Lighthouse score 95+

## 🧞 Commands

| Command                 | Action                                      |
| :---------------------- | :------------------------------------------ |
| `npm install`           | Installs dependencies                       |
| `npm run dev`           | Starts local dev server at `localhost:4321` |
| `npm run build`         | Build your production site to `./dist/`    |
| `npm run preview`       | Preview your build locally                  |
| `npm run db:generate`   | Generate Prisma client                      |
| `npm run db:push`       | Push schema changes to database             |
| `npm run db:migrate`    | Run database migrations                     |
| `npm run db:seed`       | Seed database with initial data             |
| `npm run db:studio`     | Open Prisma Studio                          |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email contact@jacquesbelmont.com or create an issue in the repository.
