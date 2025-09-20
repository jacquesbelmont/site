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
    # For Vercel PostgreSQL (Production)
    # Make sure POSTGRES_PRISMA_URL and POSTGRES_URL_NON_POOLING are set
    
    # Generate Prisma client
   npm run db:generate
    
    # Push schema to database
   npm run db:push
    
    # Seed with sample data
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔧 Database Setup (Vercel PostgreSQL)

This project is configured to work with Vercel PostgreSQL. Follow these steps:

1. **Create a Vercel PostgreSQL database:**
   - Go to your Vercel dashboard
   - Navigate to Storage tab
   - Create a new PostgreSQL database

2. **Set environment variables:**
   ```bash
   POSTGRES_PRISMA_URL="your-postgres-prisma-url"
   POSTGRES_URL_NON_POOLING="your-postgres-url-non-pooling"
   ```

3. **Initialize database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Database setup page:**
   Visit `/setup` on your deployed site to check database status and run setup commands.

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

This project uses PostgreSQL with Prisma ORM, optimized for Vercel PostgreSQL:

### Local Development
```bash
# For local development, you can use a local PostgreSQL instance
# or connect to your Vercel PostgreSQL database

# Run migrations and seed
npm run db:push
npm run db:seed
```

### Production (Vercel PostgreSQL)
1. **Create Vercel PostgreSQL database** in your Vercel dashboard
2. **Copy connection strings** to your environment variables:
   - `POSTGRES_PRISMA_URL` (for Prisma)
   - `POSTGRES_URL_NON_POOLING` (for direct connections)
3. **Deploy** - Prisma client is generated automatically during build
4. **Initialize database** using the `/setup` page or API endpoints

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
- **Email:** admin@jacquesbelmont.com
- **Password:** admin123 (change in production!)

Features:
- Blog post management
- Video management
- Member management
- Product/Store management
- SEO settings
- Analytics configuration
- Translation management
- Database health monitoring

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
| `npm run db:reset`      | Reset database and reseed (⚠️ destructive) |

## 🔍 Troubleshooting

### Database Issues
1. **Connection problems:** Visit `/setup` to check database status
2. **Missing tables:** Run `npm run db:push` to create tables
3. **No data:** Run `npm run db:seed` to add sample data
4. **Reset everything:** Run `npm run db:reset` (⚠️ deletes all data)

### Admin Access Issues
1. **Can't login:** Check if admin user exists in database
2. **Session expired:** Clear browser cookies and login again
3. **API errors:** Check server logs and database connection

### Deployment Issues
1. **Build fails:** Ensure all environment variables are set
2. **Database errors:** Verify Vercel PostgreSQL connection strings
3. **Missing data:** Run database seed through `/setup` page
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
