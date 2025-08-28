const fs = require('fs');
const path = require('path');

// Database sederhana menggunakan JSON files
const dbPath = path.join(__dirname, '../../database');

// Pastikan folder database ada
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

class RPGDatabase {
    constructor() {
        this.playersFile = path.join(dbPath, 'rpg_players.json');
        this.charactersFile = path.join(dbPath, 'rpg_characters.json');
        this.battlesFile = path.join(dbPath, 'rpg_battles.json');
        
        this.initDatabase();
    }

    initDatabase() {
        // Inisialisasi file database jika belum ada
        if (!fs.existsSync(this.playersFile)) {
            fs.writeFileSync(this.playersFile, JSON.stringify({}));
        }
        if (!fs.existsSync(this.charactersFile)) {
            fs.writeFileSync(this.charactersFile, JSON.stringify(this.getDefaultCharacters()));
        }
        if (!fs.existsSync(this.battlesFile)) {
            fs.writeFileSync(this.battlesFile, JSON.stringify({}));
        }
    }

    getDefaultCharacters() {
        return {
            "goblin": {
                name: "Goblin",
                hp: 50,
                attack: 15,
                defense: 5,
                reward: 20,
                difficulty: 1
            },
            "orc": {
                name: "Orc",
                hp: 80,
                attack: 25,
                defense: 10,
                reward: 50,
                difficulty: 2
            },
            "skeleton": {
                name: "Skeleton",
                hp: 60,
                attack: 20,
                defense: 8,
                reward: 35,
                difficulty: 1
            },
            "dragon": {
                name: "Dragon",
                hp: 200,
                attack: 50,
                defense: 25,
                reward: 200,
                difficulty: 5
            },
            "wizard": {
                name: "Dark Wizard",
                hp: 120,
                attack: 40,
                defense: 15,
                reward: 100,
                difficulty: 3
            }
        };
    }

    // Player operations
    getPlayer(userId) {
        const players = JSON.parse(fs.readFileSync(this.playersFile, 'utf8'));
        return players[userId] || null;
    }

    createPlayer(userId, username) {
        const players = JSON.parse(fs.readFileSync(this.playersFile, 'utf8'));
        const newPlayer = {
            id: userId,
            username: username,
            level: 1,
            hp: 100,
            maxHp: 100,
            attack: 20,
            defense: 10,
            exp: 0,
            gold: 100,
            battlesWon: 0,
            battlesLost: 0,
            dailyBattles: 0,
            lastBattleDate: null,
            createdAt: new Date().toISOString()
        };
        
        players[userId] = newPlayer;
        fs.writeFileSync(this.playersFile, JSON.stringify(players, null, 2));
        return newPlayer;
    }

    updatePlayer(userId, playerData) {
        const players = JSON.parse(fs.readFileSync(this.playersFile, 'utf8'));
        players[userId] = { ...players[userId], ...playerData };
        fs.writeFileSync(this.playersFile, JSON.stringify(players, null, 2));
        return players[userId];
    }

    // Character operations
    getCharacter(characterId) {
        const characters = JSON.parse(fs.readFileSync(this.charactersFile, 'utf8'));
        return characters[characterId] || null;
    }

    getAllCharacters() {
        return JSON.parse(fs.readFileSync(this.charactersFile, 'utf8'));
    }

    // Battle operations
    saveBattle(battleId, battleData) {
        const battles = JSON.parse(fs.readFileSync(this.battlesFile, 'utf8'));
        battles[battleId] = battleData;
        fs.writeFileSync(this.battlesFile, JSON.stringify(battles, null, 2));
    }

    getBattle(battleId) {
        const battles = JSON.parse(fs.readFileSync(this.battlesFile, 'utf8'));
        return battles[battleId] || null;
    }

    // Reset daily battles (bisa dipanggil setiap hari)
    resetDailyBattles() {
        const players = JSON.parse(fs.readFileSync(this.playersFile, 'utf8'));
        const today = new Date().toDateString();
        
        Object.keys(players).forEach(userId => {
            const player = players[userId];
            if (!player.lastBattleDate || new Date(player.lastBattleDate).toDateString() !== today) {
                player.dailyBattles = 0;
                player.lastBattleDate = new Date().toISOString();
            }
        });
        
        fs.writeFileSync(this.playersFile, JSON.stringify(players, null, 2));
    }

    // Leaderboard
    getLeaderboard(limit = 10) {
        const players = JSON.parse(fs.readFileSync(this.playersFile, 'utf8'));
        return Object.values(players)
            .sort((a, b) => b.level - a.level || b.exp - a.exp)
            .slice(0, limit);
    }
}

module.exports = new RPGDatabase();