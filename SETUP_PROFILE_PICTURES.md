# Profile Picture Setup - TO DO AFTER BREAK

## Step 1: Get Cloudinary Credentials (2 minutes)

1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email (free, no credit card)
3. After login, go to **Dashboard** (https://console.cloudinary.com/)
4. Copy these 3 values:
   - **Cloud Name** (looks like: dj2abc123)
   - **API Key** (looks like: 123456789012345)
   - **API Secret** (looks like: abcdefghijklmnopqrstuvwxyz123)

## Step 2: Update .env File

Open: `C:\Users\Omarm\Documents\course-scope\server\.env`

Replace these lines with your actual values from Cloudinary:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Example (with fake values):
```
CLOUDINARY_CLOUD_NAME=dj2abc123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123
```

## Step 3: Run Database Migration

1. Open **pgAdmin**
2. Connect to **coursescope** database
3. Right-click → **Query Tool**
4. Click folder icon 📁
5. Open: `C:\Users\Omarm\Documents\course-scope\server\migrations\add_profile_picture.sql`
6. Click **Execute** (▶️)

## Step 4: Tell Claude You're Ready

Just say "I'm back and ready to continue" and Claude will:
- Add the frontend UI for uploading profile pictures
- Show profile pictures on reviews
- Test the upload feature
- Then deploy everything to production!

---

## What's Already Done ✅

- Installed file upload packages
- Created upload endpoints in backend
- Set up Cloudinary configuration
- Created database migration file
- Backend is ready to receive uploads

## What's Left

- Get Cloudinary credentials (you do this)
- Update .env (you do this)
- Run migration (you do this)
- Add frontend UI (Claude will do)
- Deploy to production (Claude will help)
