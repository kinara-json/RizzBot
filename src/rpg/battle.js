const db = require('./database');
const player = require('./player');

class BattleSystem {
    constructor() {
        this.activeBattles = new Map(); // Menyimpan battle yang sedang berlangsung
    }

    // Memulai battle dengan monster
    startBattle(userId, monsterId) {
        // Cek apakah player bisa battle
        if (!player.canBattle(userId)) {
            return {
                success: false,
                message: "Kamu sudah mencapai limit battle harian! Coba lagi besok."
            };
        }

        const playerData = db.getPlayer(userId);
        if (!playerData) {
            return {
                success: false,
                message: "Player tidak ditemukan! Gunakan .rpg register terlebih dahulu."
            };
        }

        if (playerData.hp <= 0) {
            return {
                success: false,
                message: "HP kamu habis! Gunakan .rpg heal untuk memulihkan HP."
            };
        }

        const monster = db.getCharacter(monsterId);
        if (!monster) {
            return {
                success: false,
                message: "Monster tidak ditemukan!"
            };
        }

        // Buat battle instance
        const battleId = `${userId}_${Date.now()}`;
        const battleData = {
            id: battleId,
            playerId: userId,
            player: {
                name: playerData.username,
                hp: playerData.hp,
                maxHp: playerData.maxHp,
                attack: playerData.attack,
                defense: playerData.defense,
                level: playerData.level
            },
            monster: {
                name: monster.name,
                hp: monster.hp,
                maxHp: monster.hp,
                attack: monster.attack,
                defense: monster.defense,
                reward: monster.reward,
                difficulty: monster.difficulty
            },
            turn: 'player', // player atau monster
            log: [],
            startTime: new Date().toISOString(),
            status: 'active' // active, victory, defeat
        };

        this.activeBattles.set(userId, battleData);
        db.saveBattle(battleId, battleData);

        return {
            success: true,
            battle: battleData,
            message: `⚔️ *BATTLE DIMULAI!*\n\n👤 ${playerData.username} (Lv.${playerData.level})\n❤️ HP: ${playerData.hp}/${playerData.maxHp}\n⚔️ ATK: ${playerData.attack} | 🛡️ DEF: ${playerData.defense}\n\n🆚\n\n👹 ${monster.name}\n❤️ HP: ${monster.hp}/${monster.hp}\n⚔️ ATK: ${monster.attack} | 🛡️ DEF: ${monster.defense}\n💰 Reward: ${monster.reward} gold\n\nGiliran kamu! Gunakan .rpg attack untuk menyerang!`
        };
    }

    // Player menyerang
    playerAttack(userId) {
        const battle = this.activeBattles.get(userId);
        if (!battle) {
            return {
                success: false,
                message: "Tidak ada battle yang aktif! Gunakan .rpg battle [monster] untuk memulai."
            };
        }

        if (battle.turn !== 'player') {
            return {
                success: false,
                message: "Bukan giliran kamu!"
            };
        }

        if (battle.status !== 'active') {
            return {
                success: false,
                message: "Battle sudah selesai!"
            };
        }

        // Hitung damage
        const playerDamage = Math.max(1, battle.player.attack - battle.monster.defense + this.getRandomDamage());
        battle.monster.hp = Math.max(0, battle.monster.hp - playerDamage);

        // Log serangan player
        battle.log.push(`👤 ${battle.player.name} menyerang ${battle.monster.name} dan memberikan ${playerDamage} damage!`);

        let result = {
            success: true,
            damage: playerDamage,
            monsterHp: battle.monster.hp,
            log: battle.log[battle.log.length - 1]
        };

        // Cek apakah monster mati
        if (battle.monster.hp <= 0) {
            return this.endBattle(userId, 'victory');
        }

        // Giliran monster
        battle.turn = 'monster';
        const monsterResult = this.monsterAttack(battle);
        
        result.monsterAttack = monsterResult;
        result.message = `${result.log}\n${monsterResult.log}`;

        // Cek apakah player mati
        if (battle.player.hp <= 0) {
            return this.endBattle(userId, 'defeat');
        }

        // Update battle state
        battle.turn = 'player';
        this.activeBattles.set(userId, battle);
        db.saveBattle(battle.id, battle);

        result.message += `\n\n🔄 *STATUS BATTLE*\n👤 ${battle.player.name}: ${battle.player.hp}/${battle.player.maxHp} HP\n👹 ${battle.monster.name}: ${battle.monster.hp}/${battle.monster.maxHp} HP\n\nGiliran kamu! Gunakan .rpg attack lagi!`;

        return result;
    }

    // Monster menyerang (otomatis)
    monsterAttack(battle) {
        const monsterDamage = Math.max(1, battle.monster.attack - battle.player.defense + this.getRandomDamage());
        battle.player.hp = Math.max(0, battle.player.hp - monsterDamage);

        const logMessage = `👹 ${battle.monster.name} menyerang ${battle.player.name} dan memberikan ${monsterDamage} damage!`;
        battle.log.push(logMessage);

        return {
            damage: monsterDamage,
            playerHp: battle.player.hp,
            log: logMessage
        };
    }

    // Mengakhiri battle
    endBattle(userId, result) {
        const battle = this.activeBattles.get(userId);
        if (!battle) {
            return { success: false, message: "Battle tidak ditemukan!" };
        }

        battle.status = result;
        battle.endTime = new Date().toISOString();

        let message = "";
        let rewards = { gold: 0, exp: 0 };

        if (result === 'victory') {
            // Player menang
            const goldReward = battle.monster.reward;
            const expReward = Math.floor(battle.monster.reward / 2);

            rewards.gold = goldReward;
            rewards.exp = expReward;

            // Update player stats
            const playerData = db.getPlayer(userId);
            const expResult = player.addExp(userId, expReward);
            player.addGold(userId, goldReward);

            // Update daily battles count
            db.updatePlayer(userId, {
                hp: battle.player.hp,
                battlesWon: playerData.battlesWon + 1,
                dailyBattles: playerData.dailyBattles + 1
            });

            message = `🎉 *KEMENANGAN!*\n\n👤 ${battle.player.name} mengalahkan ${battle.monster.name}!\n\n💰 Gold: +${goldReward}\n⭐ EXP: +${expReward}`;

            if (expResult.leveledUp) {
                message += `\n\n🆙 *LEVEL UP!*\nLevel ${expResult.oldLevel} → ${expResult.newLevel}\n❤️ HP: +20\n⚔️ ATK: +5\n🛡️ DEF: +3`;
            }

        } else if (result === 'defeat') {
            // Player kalah
            const playerData = db.getPlayer(userId);
            db.updatePlayer(userId, {
                hp: 0,
                battlesLost: playerData.battlesLost + 1,
                dailyBattles: playerData.dailyBattles + 1
            });

            message = `💀 *KEKALAHAN!*\n\n👹 ${battle.monster.name} mengalahkan ${battle.player.name}!\n\nHP kamu habis! Gunakan .rpg heal untuk memulihkan HP.`;
        }

        // Hapus battle dari active battles
        this.activeBattles.delete(userId);
        db.saveBattle(battle.id, battle);

        return {
            success: true,
            result,
            battle,
            rewards,
            message
        };
    }

    // Melarikan diri dari battle
    fleeBattle(userId) {
        const battle = this.activeBattles.get(userId);
        if (!battle) {
            return {
                success: false,
                message: "Tidak ada battle yang aktif!"
            };
        }

        if (battle.status !== 'active') {
            return {
                success: false,
                message: "Battle sudah selesai!"
            };
        }

        // Update player HP dan daily battles
        const playerData = db.getPlayer(userId);
        db.updatePlayer(userId, {
            hp: battle.player.hp,
            dailyBattles: playerData.dailyBattles + 1
        });

        battle.status = 'fled';
        battle.endTime = new Date().toISOString();

        this.activeBattles.delete(userId);
        db.saveBattle(battle.id, battle);

        return {
            success: true,
            message: `🏃‍♂️ *MELARIKAN DIRI!*\n\n${battle.player.name} berhasil melarikan diri dari ${battle.monster.name}!`
        };
    }

    // Mendapatkan status battle yang sedang aktif
    getBattleStatus(userId) {
        const battle = this.activeBattles.get(userId);
        if (!battle) {
            return null;
        }

        return {
            ...battle,
            playerTurn: battle.turn === 'player'
        };
    }

    // Random damage variation (-2 to +2)
    getRandomDamage() {
        return Math.floor(Math.random() * 5) - 2;
    }

    // Mendapatkan daftar monster yang tersedia
    getAvailableMonsters() {
        const monsters = db.getAllCharacters();
        let list = "🎯 *DAFTAR MONSTER*\n\n";
        
        Object.keys(monsters).forEach(key => {
            const monster = monsters[key];
            const difficulty = "⭐".repeat(monster.difficulty);
            list += `🔸 *${key}* - ${monster.name}\n   ${difficulty} | ❤️${monster.hp} | ⚔️${monster.attack} | 🛡️${monster.defense} | 💰${monster.reward}\n\n`;
        });

        list += "Gunakan: .rpg battle [nama_monster]\nContoh: .rpg battle goblin";
        return list;
    }

    // Mendapatkan riwayat battle terakhir
    getRecentBattles(userId, limit = 5) {
        const battles = JSON.parse(require('fs').readFileSync(db.battlesFile, 'utf8'));
        const playerBattles = Object.values(battles)
            .filter(battle => battle.playerId === userId)
            .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
            .slice(0, limit);

        if (playerBattles.length === 0) {
            return "Belum ada riwayat battle.";
        }

        let history = "📜 *RIWAYAT BATTLE*\n\n";
        playerBattles.forEach((battle, index) => {
            const date = new Date(battle.startTime).toLocaleDateString('id-ID');
            const status = battle.status === 'victory' ? '🏆 Menang' : 
                          battle.status === 'defeat' ? '💀 Kalah' : 
                          battle.status === 'fled' ? '🏃‍♂️ Kabur' : '❓ Unknown';
            
            history += `${index + 1}. ${status} vs ${battle.monster.name}\n   📅 ${date}\n\n`;
        });

        return history;
    }
}

module.exports = new BattleSystem();