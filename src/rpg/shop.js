const db = require('./database');
const player = require('./player');

class ShopSystem {
    constructor() {
        this.items = {
            // Healing items
            'potion': {
                name: 'Health Potion',
                description: 'Memulihkan 50 HP',
                price: 30,
                type: 'consumable',
                effect: { heal: 50 }
            },
            'super_potion': {
                name: 'Super Health Potion',
                description: 'Memulihkan 100 HP',
                price: 60,
                type: 'consumable',
                effect: { heal: 100 }
            },
            'full_heal': {
                name: 'Full Heal',
                description: 'Memulihkan HP penuh',
                price: 100,
                type: 'consumable',
                effect: { heal: 'full' }
            },

            // Boost items (temporary)
            'attack_boost': {
                name: 'Attack Boost',
                description: '+10 Attack untuk 3 battle',
                price: 80,
                type: 'boost',
                effect: { attack: 10, duration: 3 }
            },
            'defense_boost': {
                name: 'Defense Boost',
                description: '+10 Defense untuk 3 battle',
                price: 80,
                type: 'boost',
                effect: { defense: 10, duration: 3 }
            },
            'exp_boost': {
                name: 'EXP Boost',
                description: '2x EXP untuk 5 battle',
                price: 150,
                type: 'boost',
                effect: { exp_multiplier: 2, duration: 5 }
            },

            // Permanent upgrades
            'hp_upgrade': {
                name: 'HP Upgrade',
                description: 'Permanen +20 Max HP',
                price: 200,
                type: 'upgrade',
                effect: { max_hp: 20 }
            },
            'attack_upgrade': {
                name: 'Attack Upgrade',
                description: 'Permanen +5 Attack',
                price: 250,
                type: 'upgrade',
                effect: { attack: 5 }
            },
            'defense_upgrade': {
                name: 'Defense Upgrade',
                description: 'Permanen +5 Defense',
                price: 250,
                type: 'upgrade',
                effect: { defense: 5 }
            },

            // Special items
            'battle_reset': {
                name: 'Battle Reset',
                description: 'Reset limit battle harian',
                price: 500,
                type: 'special',
                effect: { reset_battles: true }
            },
            'lucky_charm': {
                name: 'Lucky Charm',
                description: '+50% gold dari battle (5 battle)',
                price: 300,
                type: 'boost',
                effect: { gold_multiplier: 1.5, duration: 5 }
            }
        };
    }

    // Menampilkan daftar item di shop
    getShopList() {
        let shopList = "🛒 *SHOP RPG*\n\n";

        // Kategori Healing
        shopList += "💊 *HEALING ITEMS*\n";
        ['potion', 'super_potion', 'full_heal'].forEach(key => {
            const item = this.items[key];
            shopList += `▪️ *${key}* - ${item.name}\n   ${item.description}\n   💰 ${item.price} gold\n\n`;
        });

        // Kategori Boost
        shopList += "⚡ *BOOST ITEMS*\n";
        ['attack_boost', 'defense_boost', 'exp_boost', 'lucky_charm'].forEach(key => {
            const item = this.items[key];
            shopList += `▪️ *${key}* - ${item.name}\n   ${item.description}\n   💰 ${item.price} gold\n\n`;
        });

        // Kategori Upgrade
        shopList += "🔧 *PERMANENT UPGRADES*\n";
        ['hp_upgrade', 'attack_upgrade', 'defense_upgrade'].forEach(key => {
            const item = this.items[key];
            shopList += `▪️ *${key}* - ${item.name}\n   ${item.description}\n   💰 ${item.price} gold\n\n`;
        });

        // Kategori Special
        shopList += "✨ *SPECIAL ITEMS*\n";
        ['battle_reset'].forEach(key => {
            const item = this.items[key];
            shopList += `▪️ *${key}* - ${item.name}\n   ${item.description}\n   💰 ${item.price} gold\n\n`;
        });

        shopList += "Gunakan: .rpg buy [item]\nContoh: .rpg buy potion";
        return shopList;
    }

    // Membeli item
    buyItem(userId, itemKey) {
        const item = this.items[itemKey];
        if (!item) {
            return {
                success: false,
                message: "Item tidak ditemukan! Gunakan .rpg shop untuk melihat daftar item."
            };
        }

        const playerData = db.getPlayer(userId);
        if (!playerData) {
            return {
                success: false,
                message: "Player tidak ditemukan! Gunakan .rpg register terlebih dahulu."
            };
        }

        if (playerData.gold < item.price) {
            return {
                success: false,
                message: `Tidak cukup gold! Kamu butuh ${item.price} gold, tapi hanya punya ${playerData.gold} gold.`
            };
        }

        // Proses pembelian
        const result = this.processItemEffect(userId, item);
        if (!result.success) {
            return result;
        }

        // Kurangi gold
        player.spendGold(userId, item.price);

        return {
            success: true,
            message: `✅ Berhasil membeli *${item.name}*!\n${result.effectMessage}\n\n💰 Gold: -${item.price} (Sisa: ${playerData.gold - item.price})`
        };
    }

    // Memproses efek item yang dibeli
    processItemEffect(userId, item) {
        const playerData = db.getPlayer(userId);

        switch (item.type) {
            case 'consumable':
                return this.useConsumable(userId, item, playerData);
            
            case 'boost':
                return this.applyBoost(userId, item, playerData);
            
            case 'upgrade':
                return this.applyUpgrade(userId, item, playerData);
            
            case 'special':
                return this.useSpecial(userId, item, playerData);
            
            default:
                return { success: false, message: "Tipe item tidak dikenal!" };
        }
    }

    // Menggunakan item consumable
    useConsumable(userId, item, playerData) {
        const effect = item.effect;

        if (effect.heal) {
            if (playerData.hp >= playerData.maxHp) {
                return {
                    success: false,
                    message: "HP sudah penuh!"
                };
            }

            let healAmount;
            if (effect.heal === 'full') {
                healAmount = playerData.maxHp - playerData.hp;
            } else {
                healAmount = Math.min(effect.heal, playerData.maxHp - playerData.hp);
            }

            db.updatePlayer(userId, {
                hp: Math.min(playerData.maxHp, playerData.hp + healAmount)
            });

            return {
                success: true,
                effectMessage: `❤️ HP dipulihkan sebanyak ${healAmount}! (${playerData.hp + healAmount}/${playerData.maxHp})`
            };
        }

        return { success: false, message: "Efek item tidak dikenal!" };
    }

    // Menerapkan boost sementara
    applyBoost(userId, item, playerData) {
        const effect = item.effect;
        
        // Initialize boosts if not exist
        if (!playerData.activeBoosts) {
            playerData.activeBoosts = {};
        }

        // Apply boost
        if (effect.attack) {
            playerData.activeBoosts.attack = {
                value: effect.attack,
                duration: effect.duration
            };
        }

        if (effect.defense) {
            playerData.activeBoosts.defense = {
                value: effect.defense,
                duration: effect.duration
            };
        }

        if (effect.exp_multiplier) {
            playerData.activeBoosts.exp_multiplier = {
                value: effect.exp_multiplier,
                duration: effect.duration
            };
        }

        if (effect.gold_multiplier) {
            playerData.activeBoosts.gold_multiplier = {
                value: effect.gold_multiplier,
                duration: effect.duration
            };
        }

        db.updatePlayer(userId, { activeBoosts: playerData.activeBoosts });

        let effectMsg = "⚡ Boost aktif:";
        if (effect.attack) effectMsg += ` +${effect.attack} ATK`;
        if (effect.defense) effectMsg += ` +${effect.defense} DEF`;
        if (effect.exp_multiplier) effectMsg += ` ${effect.exp_multiplier}x EXP`;
        if (effect.gold_multiplier) effectMsg += ` ${effect.gold_multiplier}x Gold`;
        effectMsg += ` untuk ${effect.duration} battle!`;

        return {
            success: true,
            effectMessage: effectMsg
        };
    }

    // Menerapkan upgrade permanen
    applyUpgrade(userId, item, playerData) {
        const effect = item.effect;
        let updateData = {};
        let effectMessage = "🔧 Upgrade permanen:";

        if (effect.max_hp) {
            updateData.maxHp = playerData.maxHp + effect.max_hp;
            updateData.hp = playerData.hp + effect.max_hp; // Bonus HP juga
            effectMessage += ` +${effect.max_hp} Max HP`;
        }

        if (effect.attack) {
            updateData.attack = playerData.attack + effect.attack;
            effectMessage += ` +${effect.attack} ATK`;
        }

        if (effect.defense) {
            updateData.defense = playerData.defense + effect.defense;
            effectMessage += ` +${effect.defense} DEF`;
        }

        db.updatePlayer(userId, updateData);

        return {
            success: true,
            effectMessage: effectMessage + "!"
        };
    }

    // Menggunakan item special
    useSpecial(userId, item, playerData) {
        const effect = item.effect;

        if (effect.reset_battles) {
            db.updatePlayer(userId, {
                dailyBattles: 0,
                lastBattleDate: new Date().toISOString()
            });

            return {
                success: true,
                effectMessage: "🔄 Limit battle harian telah direset! Kamu bisa battle lagi."
            };
        }

        return { success: false, message: "Efek special item tidak dikenal!" };
    }

    // Mengurangi durasi boost setelah battle
    updateBoosts(userId) {
        const playerData = db.getPlayer(userId);
        if (!playerData || !playerData.activeBoosts) return;

        let updated = false;
        const boosts = playerData.activeBoosts;

        // Update durasi semua boost
        Object.keys(boosts).forEach(boostType => {
            if (boosts[boostType].duration > 1) {
                boosts[boostType].duration--;
            } else {
                delete boosts[boostType];
                updated = true;
            }
        });

        if (updated || Object.keys(boosts).length === 0) {
            db.updatePlayer(userId, { activeBoosts: boosts });
        }
    }

    // Mendapatkan boost yang aktif
    getActiveBoosts(userId) {
        const playerData = db.getPlayer(userId);
        if (!playerData || !playerData.activeBoosts) return null;

        const boosts = playerData.activeBoosts;
        if (Object.keys(boosts).length === 0) return null;

        let boostText = "⚡ *BOOST AKTIF*\n";
        Object.keys(boosts).forEach(type => {
            const boost = boosts[type];
            let name = "";
            switch (type) {
                case 'attack': name = `+${boost.value} ATK`; break;
                case 'defense': name = `+${boost.value} DEF`; break;
                case 'exp_multiplier': name = `${boost.value}x EXP`; break;
                case 'gold_multiplier': name = `${boost.value}x Gold`; break;
            }
            boostText += `▪️ ${name} (${boost.duration} battle tersisa)\n`;
        });

        return boostText;
    }

    // Mendapatkan stats player dengan boost
    getPlayerStatsWithBoosts(userId) {
        const playerData = db.getPlayer(userId);
        if (!playerData) return null;

        let stats = {
            attack: playerData.attack,
            defense: playerData.defense,
            expMultiplier: 1,
            goldMultiplier: 1
        };

        if (playerData.activeBoosts) {
            if (playerData.activeBoosts.attack) {
                stats.attack += playerData.activeBoosts.attack.value;
            }
            if (playerData.activeBoosts.defense) {
                stats.defense += playerData.activeBoosts.defense.value;
            }
            if (playerData.activeBoosts.exp_multiplier) {
                stats.expMultiplier = playerData.activeBoosts.exp_multiplier.value;
            }
            if (playerData.activeBoosts.gold_multiplier) {
                stats.goldMultiplier = playerData.activeBoosts.gold_multiplier.value;
            }
        }

        return stats;
    }
}

module.exports = new ShopSystem();