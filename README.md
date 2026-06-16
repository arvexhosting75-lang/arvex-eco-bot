# ArveX Eco Bot 🤖

**Enterprise-Grade Discord Bot for ArveX Hosting™**

A comprehensive, production-ready Discord bot featuring economy systems, quest management, hosting rewards, moderation, and more.

## 📋 Features

### Core Systems
- ✅ **Economy System** - Work, Crime, Beg, Rob, Trading, Bank, Shop
- ✅ **Quest System** - Daily, Weekly, Monthly, Special Quests with tracking
- ✅ **Leveling System** - XP, Voice XP, Rank Cards, Prestige
- ✅ **Hosting Rewards** - VPS/MC Server/Web Hosting Claims
- ✅ **Moderation** - Ban, Kick, Mute, Timeout, Warn, Anti-spam
- ✅ **Ticket System** - Button-based, with claiming and transcripts
- ✅ **Giveaway System** - Create, End, Reroll with bonus entries
- ✅ **Hosting Tycoon** - Virtual hosting company management
- ✅ **Referral System** - Invite tracking and rewards

### Advanced Features
- ✅ Slash Commands + Prefix Commands
- ✅ MongoDB Integration
- ✅ Advanced Error Handling
- ✅ Event Handler System
- ✅ Command Handler System
- ✅ Modular Architecture
- ✅ Professional Embeds
- ✅ Logging System
- ✅ Cooldown System
- ✅ Permission System
- ✅ Anti-crash Protection
- ✅ Webhook Logging
- ✅ Premium System
- ✅ Reaction Roles
- ✅ Verification System

## 🚀 Quick Start

### Requirements
- Node.js 18+
- MongoDB 5+
- Discord.js 14+

### Installation

```bash
# Clone repository
git clone https://github.com/arvexhosting75-lang/arvex-eco-bot.git
cd arvex-eco-bot

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start bot
npm start

# Development mode (with auto-reload)
npm run dev
```

## 📁 Project Structure

```
📦 arvex-eco-bot
├── 📂 src/
│   ├── 📂 commands/
│   │   ├── 📂 prefix/
│   │   │   ├── 📂 economy/
│   │   │   ├── 📂 quests/
│   │   │   ├── 📂 leveling/
│   │   │   ├── 📂 hosting/
│   │   │   ├── 📂 moderation/
│   │   │   ├── 📂 utility/
│   │   │   └── 📂 admin/
│   │   └── 📂 slash/
│   │       ├── 📂 economy/
│   │       ├── 📂 quests/
│   │       └── ... (same structure)
│   ├── 📂 events/
│   │   ├── 📂 client/
│   │   ├── 📂 guild/
│   │   ├── 📂 message/
│   │   ├── 📂 interaction/
│   │   └── 📂 voice/
│   ├── 📂 models/
│   │   ├── User.js
│   │   ├── Guild.js
│   │   ├── Quest.js
│   │   ├── Giveaway.js
│   │   ├── Ticket.js
│   │   ├── Premium.js
│   │   └── ...
│   ├── 📂 utils/
│   │   ├── Logger.js
│   │   ├── Database.js
│   │   ├── EmbedBuilder.js
│   │   ├── CommandHandler.js
│   │   ├── ErrorHandler.js
│   │   └── ...
│   ├── 📂 config/
│   │   ├── bot.js
│   │   ├── economy.js
│   │   ├── hosting.js
│   │   └── constants.js
│   └── index.js
├── 📂 logs/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Configuration

Edit `.env` with your settings:

```env
BOT_TOKEN=your_token
MONGODB_URI=your_mongodb_url
NODE_ENV=production
```

## 📊 Commands

### Economy
- `ax!balance` - Check balance
- `ax!work` - Work for coins
- `ax!crime` - Commit crime
- `ax!beg` - Beg for coins
- `ax!rob` - Rob another user
- `ax!deposit` - Deposit to bank
- `ax!withdraw` - Withdraw from bank
- `ax!shop` - View shop
- `ax!transfer` - Transfer coins
- `ax!leaderboard` - View economy leaderboard

### Quests
- `ax!quest` - View current quests
- `ax!claimreward` - Claim quest reward
- `ax!achievements` - View achievements

### Hosting
- `ax!claimvps` - Claim free VPS
- `ax!claimmc` - Claim Minecraft server
- `ax!claimweb` - Claim web hosting
- `ax!redeemcode` - Redeem code
- `ax!myhosting` - View your hosting

### Leveling
- `ax!rank` - View rank card
- `ax!leaderboard` - Leveling leaderboard
- `ax!prestige` - Prestige level

### Moderation
- `ax!ban` - Ban user
- `ax!kick` - Kick user
- `ax!mute` - Mute user
- `ax!warn` - Warn user
- `ax!purge` - Delete messages

### Tickets
- `ax!ticketsetup` - Setup tickets
- `ax!ticket` - Create ticket
- `ax!close` - Close ticket

## 🛡️ Security

- Rate limiting on all commands
- Permission verification
- XSS protection in embeds
- MongoDB injection prevention
- Token rotation support
- Audit logging
- DDoS protection ready

## 📈 Performance

- Command caching
- Database indexing
- Efficient memory management
- Connection pooling
- Webhook-based logging (non-blocking)
- Event delegation

## 🚨 Error Handling

- Comprehensive try-catch blocks
- Graceful error recovery
- Detailed error logging
- User-friendly error messages
- Automatic crash prevention

## 🤝 Contributing

Contributions welcome! Please follow:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📝 License

MIT License - See LICENSE file

## 👨‍💼 Support

- Website: https://arvexhosting.com
- Discord: Your support server
- Email: support@arvexhosting.com

---

**Made with ❤️ by ArveX Hosting™**
