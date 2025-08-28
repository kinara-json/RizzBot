const player = require('./player');
const battle = require('./battle');
const shop = require('./shop');
const db = require('./database');

class RPGGame {
    constructor() {
        this.commands = {
            'register': this.register.bind(this),
            'stats': this.showStats.bind(this),
            'profile': this.showStats.bind(this),
            'battle': this.startBattle.bind(this),
            'fight': this.startBattle.bind(this),
            'attack': this.attack.bind(this),
            'flee': this.flee.bind(this),
            'run': this.flee.bind(this),
            'monsters': this.showMonsters.bind(this),
            'heal': this.heal.bind(this),
            'shop': this.showShop.bind(this),
            'buy': this.buyItem.bind(this),
            'inventory': this.showInventory.bind(this),
            'boosts': this.showBoosts.bind(this),
            'leaderboard': this.showLeaderboard.bind(this),
            'lb': this.showLeaderboard.bind(this),
            'history': this.showHistory.bind(this),
            'help': this.showHelp.bind(this),
            'status': this.showBattleStatus.bind(this)
        };
    }

    // Handler utama untuk command RPG
    async handleCommand(sender, args, username) {
        try {
            const command = args[0]?.toLowerCase();
            
            if (!command) {
                return this.showHelp();
            }

            if (!this.commands[command]) {
                return "❌ Command tidak ditemukan! Gunakan .rpg help untuk melihat daftar command.";
            }

            return await this.commands[command](sender, args.slice(1), username);
        } catch (error) {
            console.error('RPG Error:', error);
            return "❌ Terjadi error dalam game RPG! Coba lagi nanti.";
        }
    }

    // Registrasi player baru
    register(sender, args, username) {
        const existingPlayer = db.getPlayer(sender);
        if (existingPlayer) {
            return `✅ Kamu sudah terdaftar!\n\n${player.formatPlayerDisplay(existingPlayer)}`;
        }

        const newPlayer = player.getOrCreatePlayer(sender, username || 'Player');
        return `🎉 *SELAMAT DATANG DI RPG GAME!*\n\n${player.formatPlayerDisplay(newPlayer)}\n\n🎯 Gunakan .rpg help untuk melihat command yang tersedia!`;
    }

    // Menampilkan stats player
    showStats(sender, args, username) {
        const playerData = player.getOrCreatePlayer(sender, username || 'Player');
        const rank = player.getPlayerRank(sender);
        const activeBoosts = shop.getActiveBoosts(sender);

        let statsDisplay = player.formatPlayerDisplay(playerData);
        
        if (rank) {
            statsDisplay += `\n🏆 Ranking: #${rank}`;
        }

        if (activeBoosts) {
            statsDisplay += `\n\n${activeBoosts}`;
        }

        const battleStatus = battle.getBattleStatus(sender);
        if (battleStatus) {
            statsDisplay += `\n\n⚔️ *BATTLE AKTIF*\n👹 Melawan: ${battleStatus.monster.name}\n❤️ Monster HP: ${battleStatus.monster.hp}/${battleStatus.monster.maxHp}`;
        }

        return statsDisplay;
    }

    // Memulai battle
    startBattle(sender, args, username) {
        if (args.length === 0) {
            return "❌ Pilih monster! Gunakan .rpg monsters untuk melihat daftar monster.\nContoh: .rpg battle goblin";
        }

        const monsterId = args[0].toLowerCase();
        player.getOrCreatePlayer(sender, username || 'Player'); // Pastikan player ada
        
        const result = battle.startBattle(sender, monsterId);
        return result.message;
    }

    // Menyerang dalam battle
    attack(sender, args, username) {
        player.getOrCreatePlayer(sender, username || 'Player');
        
        const result = battle.playerAttack(sender);
        
        // Update boosts setelah battle
        if (result.success) {
            shop.updateBoosts(sender);
        }
        
        return result.message || (result.success ? "⚔️ Serangan berhasil!" : "❌ Tidak bisa menyerang!");
    }

    // Melarikan diri dari battle
    flee(sender, args, username) {
        const result = battle.fleeBattle(sender);
        return result.message;
    }

    // Menampilkan daftar monster
    showMonsters(sender, args, username) {
        return battle.getAvailableMonsters();
    }

    // Heal player
    heal(sender, args, username) {
        player.getOrCreatePlayer(sender, username || 'Player');
        const result = player.healPlayer(sender);
        return result.message;
    }

    // Menampilkan shop
    showShop(sender, args, username) {
        player.getOrCreatePlayer(sender, username || 'Player');
        const playerData = db.getPlayer(sender);
        
        let shopDisplay = shop.getShopList();
        shopDisplay += `\n\n💰 Gold kamu: ${player.formatGold(playerData.gold)}`;
        
        return shopDisplay;
    }

    // Membeli item dari shop
    buyItem(sender, args, username) {
        if (args.length === 0) {
            return "❌ Pilih item! Gunakan .rpg shop untuk melihat daftar item.\nContoh: .rpg buy potion";
        }

        const itemKey = args[0].toLowerCase();
        player.getOrCreatePlayer(sender, username || 'Player');
        
        const result = shop.buyItem(sender, itemKey);
        return result.message;
    }

    // Menampilkan inventory (boost aktif)
    showInventory(sender, args, username) {
        player.getOrCreatePlayer(sender, username || 'Player');
        const boosts = shop.getActiveBoosts(sender);
        
        if (!boosts) {
            return "📦 *INVENTORY*\n\nKamu tidak memiliki boost yang aktif.\nBeli item di .rpg shop untuk mendapatkan boost!";
        }
        
        return `📦 *INVENTORY*\n\n${boosts}`;
    }

    // Menampilkan boost aktif
    showBoosts(sender, args, username) {
        return this.showInventory(sender, args, username);
    }

    // Menampilkan leaderboard
    showLeaderboard(sender, args, username) {
        const leaderboard = player.getLeaderboard(10);
        
        if (leaderboard.length === 0) {
            return "🏆 *LEADERBOARD*\n\nBelum ada player yang terdaftar.";
        }

        let lb = "🏆 *LEADERBOARD TOP 10*\n\n";
        leaderboard.forEach((p, index) => {
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
            lb += `${medal} *${p.username}*\n`;
            lb += `   📊 Level ${p.level} | ⭐ ${p.exp} EXP\n`;
            lb += `   🗡️ ${p.battlesWon}W/${p.battlesLost}L | 💰 ${player.formatGold(p.gold)} gold\n\n`;
        });

        // Tampilkan ranking player saat ini
        const playerRank = player.getPlayerRank(sender);
        if (playerRank && playerRank > 10) {
            const playerData = db.getPlayer(sender);
            lb += `📍 *Ranking kamu: #${playerRank}*\n`;
            lb += `   ${playerData.username} - Level ${playerData.level}`;
        }

        return lb;
    }

    // Menampilkan history battle
    showHistory(sender, args, username) {
        player.getOrCreatePlayer(sender, username || 'Player');
        return battle.getRecentBattles(sender);
    }

    // Menampilkan status battle yang sedang aktif
    showBattleStatus(sender, args, username) {
        const battleStatus = battle.getBattleStatus(sender);
        
        if (!battleStatus) {
            return "❌ Tidak ada battle yang sedang aktif.";
        }

        const playerTurn = battleStatus.playerTurn ? "🔄 Giliran kamu!" : "⏳ Giliran monster...";
        
        return `⚔️ *BATTLE STATUS*\n\n👤 ${battleStatus.player.name}\n❤️ HP: ${battleStatus.player.hp}/${battleStatus.player.maxHp}\n⚔️ ATK: ${battleStatus.player.attack} | 🛡️ DEF: ${battleStatus.player.defense}\n\n🆚\n\n👹 ${battleStatus.monster.name}\n❤️ HP: ${battleStatus.monster.hp}/${battleStatus.monster.maxHp}\n⚔️ ATK: ${battleStatus.monster.attack} | 🛡️ DEF: ${battleStatus.monster.defense}\n\n${playerTurn}\n\nGunakan .rpg attack untuk menyerang atau .rpg flee untuk kabur!`;
    }

    // Menampilkan help
    showHelp(sender, args, username) {
        return `🎮 *RPG GAME COMMANDS*

📋 *PLAYER*
▪️ .rpg register - Daftar sebagai player baru
▪️ .rpg stats - Lihat stats player
▪️ .rpg heal - Pulihkan HP (20 gold)

⚔️ *BATTLE*
▪️ .rpg monsters - Lihat daftar monster
▪️ .rpg battle [monster] - Mulai battle
▪️ .rpg attack - Serang monster
▪️ .rpg flee - Kabur dari battle
▪️ .rpg status - Status battle aktif

🛒 *SHOP & ITEMS*
▪️ .rpg shop - Lihat shop
▪️ .rpg buy [item] - Beli item
▪️ .rpg boosts - Lihat boost aktif

📊 *INFO*
▪️ .rpg leaderboard - Top player
▪️ .rpg history - Riwayat battle
▪️ .rpg help - Command ini

🎯 *TIPS*
• Battle untuk mendapat gold & EXP
• Level up untuk stat yang lebih kuat
• Limit 10 battle per hari
• Beli boost untuk keuntungan extra

Selamat bermain! 🎉`;
    }

    // Utility: Format waktu
    formatTime(date) {
        return new Date(date).toLocaleString('id-ID', {
            timeZone: 'Asia/Jakarta',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Admin command untuk reset data (opsional)
    adminReset(sender, args, username) {
        // Implementasi reset untuk admin jika diperlukan
        // Tidak dimasukkan ke commands utama untuk keamanan
    }
}

module.exports = new RPGGame();