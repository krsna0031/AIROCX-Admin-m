# 📦 AIROCX Admin Project - Download Instructions

## ✅ Your project has been packed as a ZIP file!

**File Location:** `/app/airocx-admin-project.zip`
**File Size:** ~36 KB (excludes node_modules for smaller size)

## 📥 How to Download:

### Option 1: Via File Browser
1. Look for the file explorer/browser in your Emergent interface
2. Navigate to `/app/`
3. Find `airocx-admin-project.zip`
4. Click to download

### Option 2: Via VS Code (if available)
1. Open VS Code view
2. Navigate to `/app/airocx-admin-project.zip`
3. Right-click → Download

## 📂 What's Included:

```
airocx-admin-project/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment config
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── components/
│   │       ├── MainWebsite.js
│   │       ├── AdminLogin.js
│   │       ├── AdminDashboard.js
│   │       ├── CharactersTab.js
│   │       ├── ShowcaseTab.js
│   │       └── MerchTab.js
│   ├── public/
│   ├── package.json      # Node dependencies
│   └── .env             # Frontend config
├── memory/
│   ├── test_credentials.md
│   ├── youtube_integration_guide.md
│   └── connection_fix.md
└── README.md            # Complete documentation

```

## 🚀 Setup After Download:

### 1. Extract the ZIP
```bash
unzip airocx-admin-project.zip
cd airocx-admin-project
```

### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
# or
yarn install
```

### 4. Start MongoDB
```bash
mongod --dbpath /path/to/data
```

### 5. Start Backend
```bash
cd backend
python server.py
# Runs on http://localhost:8001
```

### 6. Start Frontend
```bash
cd frontend
npm start
# or
yarn start
# Runs on http://localhost:3000
```

### 7. Access the Application
- **Main Website:** http://localhost:3000/
- **Admin Dashboard:** http://localhost:3000/admin
- **Password:** Set your own `ADMIN_PASSWORD` in `backend/.env`.

## 📝 Notes:

- **node_modules** excluded to reduce size - run `npm install` after extraction
- All source code and configurations included
- MongoDB data NOT included - will seed automatically on first run
- Full documentation in README.md

## Admin credentials

No production password is included. Configure a unique `ADMIN_PASSWORD` with at least 12 characters.
- See `/memory/test_credentials.md` for API details

---

Your complete AIROCX admin dashboard project is ready to run on any system with Node.js, Python, and MongoDB! 🎉
