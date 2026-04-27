# 🚀 FREE DEPLOYMENT GUIDE - Water Quality Monitor

## Recommended Free Stack

| Component | Service | Why |
|-----------|---------|-----|
| **Backend Hosting** | Render | Free forever, auto-deploy from GitHub |
| **Database** | Supabase | Free PostgreSQL, Firebase alternative |
| **Domain** | Render subdomain | Free SSL, custom domain optional |

---

## OPTION 1: Render (RECOMMENDED) - 100% Free

### Step 1: Push to GitHub
```bash
cd water_quality_system
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/water-quality-fyp.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `water-quality-monitor`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free
5. Click "Create Web Service"
6. Wait 2-3 minutes for deployment
7. Your app is live at: `https://water-quality-monitor.onrender.com`

### Step 3: Keep It Awake (Optional)
Free tier sleeps after 15 min. Use [UptimeRobot](https://uptimerobot.com) (free) to ping your site every 5 minutes.

---

## OPTION 2: PythonAnywhere - Free Forever

1. Sign up at [pythonanywhere.com](https://pythonanywhere.com)
2. Go to **Consoles** → **Bash**
3. Run:
```bash
git clone https://github.com/YOUR_USERNAME/water-quality-fyp.git
cd water-quality-fyp
mkvirtualenv --python=/usr/bin/python3.10 venv
pip install -r requirements.txt
```
4. Go to **Web** → **Add a new web app**
5. Select **Flask** and **Python 3.10**
6. Edit WSGI file to point to your `app.py`
7. Reload web app

**URL**: `yourusername.pythonanywhere.com`

**Pros**: No sleep, truly free forever
**Cons**: No custom domain on free tier

---

## OPTION 3: Railway ($5 free credit/month)

1. Sign up at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Railway auto-detects Python and installs dependencies
4. Add environment variables if needed

**Pros**: No sleep, faster than Render
**Cons**: Requires credit card (won't charge if under $5)

---

## Database: Keep Firebase OR Switch to Supabase

### Keep Firebase (Easiest)
- Your current Firebase Realtime Database free tier is enough
- Just update `firebase_key.json` path in `app.py`
- No changes needed

### Switch to Supabase (More Powerful)
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Table Editor** → Create table `sensor_data`
4. Columns: `temperature`, `turbidity`, `water_level`, `tds`, `ph`, `pressure`, `status`, `timestamp`
5. Get connection string from **Settings** → **Database**
6. Update `app.py` to use Supabase client instead of Firebase

---

## Mobile Responsiveness - Already Done!

Your dashboard now includes:

✅ **Collapsible sidebar** with hamburger menu on mobile
✅ **Touch swipe** to open/close sidebar (swipe from left edge)
✅ **Responsive grid** - 2 columns on mobile, 3 on tablet, 6 on desktop
✅ **PWA support** - Add to home screen like a native app
✅ **Optimized touch targets** - Minimum 44px for buttons
✅ **Landscape mode** support
✅ **No horizontal scroll** on any screen size

### Test on Mobile:
1. Open your deployed URL on phone
2. Tap "Add to Home Screen" in browser menu
3. App opens fullscreen without browser chrome
4. Swipe from left edge to open menu

---

## Environment Variables (For Production)

Create `.env` file (don't commit to Git):
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
FIREBASE_KEY_PATH=firebase_key.json
DATABASE_URL=your-database-url
```

On Render: Go to **Environment** tab and add these variables.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | Check `requirements.txt` has all packages |
| "Port already in use" | Render/Railway set `PORT` env var automatically |
| "Firebase credentials error" | Upload `firebase_key.json` to hosting or use env vars |
| Models not loading | Ensure `models/` folder is in Git repo |
| Slow on first load | Normal for free tier (waking from sleep) |

---

## Quick Checklist Before Deploying

- [ ] `requirements.txt` has all dependencies
- [ ] `Procfile` or `render.yaml` configured
- [ ] `app.py` uses `PORT` from environment
- [ ] Firebase key uploaded (or use demo data)
- [ ] ML models in `models/` directory
- [ ] Git repo created and pushed
- [ ] Tested locally: `python app.py`

---

## Cost Summary

| Service | Cost | Limits |
|---------|------|--------|
| Render | **$0** | Sleeps after 15min |
| PythonAnywhere | **$0** | No custom domain |
| Supabase DB | **$0** | 500MB storage |
| Firebase RTDB | **$0** | 1GB storage |
| UptimeRobot | **$0** | 50 monitors |
| **TOTAL** | **$0/month** | Perfect for FYP |
