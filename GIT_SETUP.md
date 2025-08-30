# 🚀 Git Setup Guide for CENTURY SOAP Project

## 📋 Prerequisites

- Git installed on your computer
- GitHub account
- GitHub repository created (optional - we'll create one)

## 🔧 Step 1: Initialize Git Repository

```bash
# Initialize Git in your project folder
git init

# Check Git status
git status
```

## 🔧 Step 2: Add Your Files (Excluding node_modules)

```bash
# Add all files except those in .gitignore
git add .

# Check what's staged
git status
```

You should see files like:

- ✅ `src/` (your React code)
- ✅ `package.json`
- ✅ `tailwind.config.js`
- ✅ `supabase-schema.sql`
- ✅ `.gitignore`
- ❌ `node_modules/` (automatically ignored)

## 🔧 Step 3: Make Your First Commit

```bash
# Commit your code
git commit -m "🚀 Initial commit: CENTURY SOAP Inventory System

✨ Features:
- React 18 + TypeScript + Vite
- Beautiful Tailwind CSS design
- Supabase backend integration
- User authentication system
- Product management
- Sales tracking
- Inventory management
- Reports & analytics

🔧 Tech Stack:
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Supabase (PostgreSQL)
- Build: Vite
- Icons: Lucide React
- Charts: Recharts"
```

## 🔧 Step 4: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click **"New repository"**
3. Repository name: `century-soap-inventory`
4. Description: `Beautiful inventory and sales management system for CENTURY SOAP`
5. Make it **Public** or **Private** (your choice)
6. **Don't** initialize with README, .gitignore, or license
7. Click **"Create repository"**

## 🔧 Step 5: Connect to GitHub

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/century-soap-inventory.git

# Verify remote
git remote -v
```

## 🔧 Step 6: Push to GitHub

```bash
# Push your code to GitHub
git push -u origin main
```

## 🔧 Step 7: Verify on GitHub

Go to your GitHub repository and you should see:

- ✅ All your source code
- ✅ `package.json` and configuration files
- ✅ `supabase-schema.sql`
- ✅ `.gitignore`
- ❌ No `node_modules/` folder

## 📁 What Gets Committed

### ✅ **Source Code**

- `src/` - React components and logic
- `public/` - Static assets
- Configuration files

### ✅ **Documentation**

- `README.md`
- `SUPABASE_SETUP.md`
- `SIMPLE_SETUP.md`
- `GIT_SETUP.md`

### ✅ **Database Schema**

- `supabase-schema.sql`

### ✅ **Configuration**

- `package.json`
- `tailwind.config.js`
- `vite.config.ts`
- `tsconfig.json`

### ❌ **Ignored (Not Committed)**

- `node_modules/` - npm packages
- `dist/` - build output
- `.env` - environment variables
- OS files (`.DS_Store`, etc.)

## 🔄 Future Updates

```bash
# When you make changes
git add .
git commit -m "✨ Description of your changes"
git push

# When someone else makes changes
git pull origin main
```

## 🎯 Benefits of This Setup

- **Clean repository** - no unnecessary files
- **Fast cloning** - others can clone without downloading npm packages
- **Professional** - follows best practices
- **Collaborative** - easy to work with others
- **Backup** - your code is safe on GitHub

## 🚨 Important Notes

1. **Never commit** `.env` files with sensitive data
2. **Always check** `git status` before committing
3. **Use descriptive** commit messages
4. **Pull before pushing** if working with others

## 🎉 You're All Set!

After following these steps:

1. Your code will be on GitHub
2. `node_modules/` will be ignored
3. Others can clone and run `npm install`
4. Your project is professionally organized

**Next step**: Run the schema in Supabase and start your app!
