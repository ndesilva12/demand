# Demand — Consumer-Powered Corporate Accountability

![Status](https://img.shields.io/badge/status-MVP-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Give consumers real power to organize and force corporate accountability.**

Demand is a platform where consumers create structured demands with measurable success criteria, build support through co-signatures, and win real change from corporations.

---

## 🚀 Features

### MVP (Current)
- ✅ **User Authentication** — Sign up, login with Firebase Auth
- ✅ **Create Demands** — Title, description, target company, measurable success criteria
- ✅ **Browse Demands** — Filter by status (active, won, closed)
- ✅ **Co-Sign Demands** — One-click support for demands you believe in
- ✅ **User Dashboard** — Track your demands and co-signed demands
- ✅ **Demand Detail Pages** — Full demand info, stats, co-signer count

### Coming Soon
- 🔨 **Message Boards** — Discuss strategy per demand
- 🔨 **Democratic Editing** — Propose changes, vote on edits
- 🔨 **Company Research Tool** — Political donations, controversies, statements
- 🔨 **Victory Tracking** — Showcase demands that won
- 🔨 **Email Notifications** — Updates on demands you support
- 🔨 **Social Sharing** — Amplify demands on Twitter, Reddit, etc.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication)
- **Hosting:** Vercel (recommended) or any Node.js host
- **Database:** Firestore (NoSQL, real-time)

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase project (free tier works)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/ndesilva12/demand.git
   cd demand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable **Authentication** (Email/Password provider)
   - Enable **Firestore Database**
   - Copy your Firebase config from Project Settings

4. **Set environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Firebase config.

5. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
app/
├── page.tsx              # Landing page
├── login/                # Sign in
├── signup/               # Create account
├── demands/              # Browse demands
│   └── [id]/             # Demand detail page
├── create/               # Create new demand
├── dashboard/            # User dashboard
└── layout.tsx            # Root layout with AuthProvider

contexts/
└── AuthContext.tsx       # Authentication state management

lib/
└── firebase.ts           # Firebase initialization

types/
└── index.ts              # TypeScript types (Demand, User, etc.)
```

---

## 🔥 Firestore Data Model

### `demands` Collection

```typescript
{
  id: string;
  title: string;
  description: string;
  targetCompany: string;
  successCriteria: string;
  creatorId: string;
  creatorName: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'active' | 'met' | 'closed';
  coSigners: string[];  // array of user IDs
  coSignCount: number;
  visibility: 'public' | 'private';
}
```

### Security Rules (to add in Firebase Console)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /demands/{demandId} {
      allow read: if resource.data.visibility == 'public' || 
                     resource.data.creatorId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.creatorId ||
                       request.auth.uid in resource.data.coSigners;
      allow delete: if request.auth.uid == resource.data.creatorId;
    }
  }
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables (Firebase config)
4. Deploy ✅

### Other Platforms

- **Netlify:** Works with Next.js
- **Railway:** Node.js hosting
- **Render:** Free tier available

---

## 🗺️ Roadmap

### Phase 1: MVP (Week 1) ✅
- Basic demand creation
- Authentication
- Browse/co-sign

### Phase 2: Collaboration (Month 1)
- Democratic editing
- Voting system
- Edit history

### Phase 3: Intelligence (Month 2)
- Company research tool
- Political donations data
- News/controversy tracking

### Phase 4: Community (Month 3)
- Message boards
- User reputation
- Trending demands

### Phase 5: Scale (Month 4-6)
- Premium subscriptions
- Mobile app
- API access

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Areas we need help:**
- Frontend polish (UI/UX improvements)
- Firebase security rules optimization
- Company research API integration
- Message board features
- Email notification system

---

## 📜 License

MIT License. See `LICENSE` file for details.

---

## 📬 Contact

**Norman de Silva** — Founder  
GitHub: [@ndesilva12](https://github.com/ndesilva12)

**Startup Jimmy** — CTO  
Building fast, shipping faster.

---

## 🌟 Philosophy

This isn't just another petition site. We're building infrastructure for consumer power.

**Demand = Change.org with teeth.**

- **Measurable outcomes** — no vague asks
- **Democratic refinement** — communities shape demands together
- **Company intelligence** — know who you're fighting
- **Victory showcase** — proof that organizing works

Let's ship. 🚀
