const db = require('./database');

class PlayerSystem {
    constructor() {
        this.maxDailyBattles = 10; // Limit battle per hari
        this.expPerLevel = 100; // EXP yang dibutuhkan per level
    }

    // Mendapatkan atau membuat player baru
    getOrCreatePlayer(userId, username) {
        let player = db.getPlayer(userId);
        
        if (!player) {
            player = db.createPlayer(userId, username);
            console.log(`Player baru dibuat: ${username} (${userId})`);
        }
        
        return player;
    }

    // Cek apakah player bisa battle (limit harian)
    canBattle(userId) {
        const player = db.getPlayer(userId);
        if (!player) return false;

        // Reset daily battles jika hari sudah berbeda
        const today = new Date().toDateString();
        const lastBattleDate = player.lastBattleDate ? new Date(player.lastBattleDate).toDateString() : null;
        
        if (lastBattleDate !== today) {
            // Reset daily battles
            db.updatePlayer(userId, {
                dailyBattles: 0,
                lastBattleDate: new Date().toISOString()
            });
            return true;
        }

        return player.dailyBattles < this.maxDailyBattles;
    }

    // Menambah EXP dan cek level up
    addExp(userId, expGain) {
        const player = db.getPlayer(userId);
        if (!player) return null;

        const newExp = player.exp + expGain;
        const newLevel = Math.floor(newExp / this.expPerLevel) + 1;
        const leveledUp = newLevel > player.level;

        let updateData = {
            exp: newExp,
            level: newLevel
        };

        // Jika level up, tingkatkan stats
        if (leveledUp) {
            const hpIncrease = 20;
            const attackIncrease = 5;
            const defenseIncrease = 3;

            updateData = {
                ...updateData,
                maxHp: player.maxHp + hpIncrease,
                hp: player.maxHp + hpIncrease, // Full heal saat level up
                attack: player.attack + attackIncrease,
                defense: player.defense + defenseIncrease
            };
        }

        const updatedPlayer = db.updatePlayer(userId, updateData);
        
        return {
            player: updatedPlayer,
            leveledUp,
            oldLevel: player.level,
            newLevel: newLevel,
            expGained: expGain
        };
    }

    // Menambah gold
    addGold(userId, goldAmount) {
        const player = db.getPlayer(userId);
        if (!player) return null;

        const updatedPlayer = db.updatePlayer(userId, {
            gold: player.gold + goldAmount
        });

        return updatedPlayer;
    }

    // Mengurangi gold
    spendGold(userId, goldAmount) {
        const player = db.getPlayer(userId);
        if (!player || player.gold < goldAmount) return false;

        db.updatePlayer(userId, {
            gold: player.gold - goldAmount
        });

        return true;
    }

    // Heal player (dengan biaya gold)
    healPlayer(userId, healCost = 20) {
        const player = db.getPlayer(userId);
        if (!player) return { success: false, message: "Player tidak ditemukan" };

        if (player.hp >= player.maxHp) {
            return { success: false, message: "HP sudah penuh!" };
        }

        if (player.gold < healCost) {
            return { success: false, message: `Tidak cukup gold! Butuh ${healCost} gold.` };
        }

        const updatedPlayer = db.updatePlayer(userId, {
            hp: player.maxHp,
            gold: player.gold - healCost
        });

        return {
            success: true,
            message: `HP dipulihkan penuh! (-${healCost} gold)`,
            player: updatedPlayer
        };
    }

    // Mendapatkan stats player yang diformat
    getPlayerStats(userId) {
        const player = db.getPlayer(userId);
        if (!player) return null;

        const expToNextLevel = this.expPerLevel - (player.exp % this.expPerLevel);
        
        return {
            ...player,
            expToNextLevel,
            battlesRemaining: this.maxDailyBattles - player.dailyBattles
        };
    }

    // Mendapatkan ranking player
    getPlayerRank(userId) {
        const leaderboard = db.getLeaderboard(100);
        const playerIndex = leaderboard.findIndex(p => p.id === userId);
        return playerIndex === -1 ? null : playerIndex + 1;
    }

    // Reset HP untuk testing atau admin
    resetPlayerHP(userId) {
        const player = db.getPlayer(userId);
        if (!player) return null;

        return db.updatePlayer(userId, {
            hp: player.maxHp
        });
    }

    // Mendapatkan leaderboard
    getLeaderboard(limit = 10) {
        return db.getLeaderboard(limit);
    }

    // Format gold dengan separator
    formatGold(amount) {
        return amount.toLocaleString('id-ID');
    }

    // Format stats untuk display
    formatPlayerDisplay(player) {
        if (!player) return "Player tidak ditemukan";

        const expToNext = this.expPerLevel - (player.exp % this.expPerLevel);
        const battlesLeft = this.maxDailyBattles - player.dailyBattles;

        return `👤 *${player.username}*
📊 Level: ${player.level}
❤️ HP: ${player.hp}/${player.maxHp}
⚔️ Attack: ${player.attack}
🛡️ Defense: ${player.defense}
⭐ EXP: ${player.exp} (${expToNext} to next level)
💰 Gold: ${this.formatGold(player.gold)}
🗡️ Battles Won: ${player.battlesWon}
💀 Battles Lost: ${player.battlesLost}
⚡ Daily Battles Left: ${battlesLeft}/${this.maxDailyBattles}`;
    }
}

module.exports = new PlayerSystem();