# 🎮 RPG Game WhatsApp Bot

RPG Game yang terintegrasi dengan WhatsApp Bot dengan sistem database, currency, battle system, dan limit harian.

## 🚀 Fitur Utama

### 👤 **Sistem Player**
- Register otomatis player baru
- Level system dengan EXP
- Stats: HP, Attack, Defense, Gold
- Ranking system dan leaderboard

### ⚔️ **Battle System**
- Battle dengan berbagai monster
- Turn-based combat
- Random damage variation
- Bisa kabur dari battle
- Riwayat battle

### 💰 **Currency & Shop System**
- Gold sebagai mata uang utama
- Shop dengan berbagai item:
  - Healing items (potion, super potion, full heal)
  - Boost items (attack, defense, exp boost)
  - Permanent upgrades (HP, attack, defense upgrade)
  - Special items (battle reset, lucky charm)

### 🎯 **Limit System**
- Maksimal 10 battle per hari
- Reset otomatis setiap hari
- Item battle reset untuk bypass limit

## 📋 Command List

### **Player Commands**
```
.rpg register     - Daftar sebagai player baru
.rpg stats        - Lihat stats player
.rpg profile      - Sama dengan stats
.rpg heal         - Pulihkan HP (20 gold)
```

### **Battle Commands**
```
.rpg monsters     - Lihat daftar monster
.rpg battle [monster] - Mulai battle dengan monster
.rpg fight [monster]  - Sama dengan battle
.rpg attack       - Serang monster
.rpg flee         - Kabur dari battle
.rpg run          - Sama dengan flee
.rpg status       - Status battle aktif
```

### **Shop & Items**
```
.rpg shop         - Lihat shop
.rpg buy [item]   - Beli item
.rpg inventory    - Lihat boost aktif
.rpg boosts       - Sama dengan inventory
```

### **Info & Stats**
```
.rpg leaderboard  - Top 10 player
.rpg lb           - Sama dengan leaderboard
.rpg history      - Riwayat battle
.rpg help         - Command help
```

## 🐉 Monster List

### **⭐ Level 1 (Mudah)**
- **Goblin**: HP 50, ATK 15, DEF 5, Reward 20 gold
- **Skeleton**: HP 60, ATK 20, DEF 8, Reward 35 gold

### **⭐⭐ Level 2 (Sedang)**
- **Orc**: HP 80, ATK 25, DEF 10, Reward 50 gold

### **⭐⭐⭐ Level 3 (Sulit)**
- **Dark Wizard**: HP 120, ATK 40, DEF 15, Reward 100 gold

### **⭐⭐⭐⭐⭐ Level 5 (Boss)**
- **Dragon**: HP 200, ATK 50, DEF 25, Reward 200 gold

## 🛒 Shop Items

### **💊 Healing Items**
- **potion** (30 gold): +50 HP
- **super_potion** (60 gold): +100 HP
- **full_heal** (100 gold): Full HP

### **⚡ Boost Items**
- **attack_boost** (80 gold): +10 ATK untuk 3 battle
- **defense_boost** (80 gold): +10 DEF untuk 3 battle
- **exp_boost** (150 gold): 2x EXP untuk 5 battle
- **lucky_charm** (300 gold): +50% gold untuk 5 battle

### **🔧 Permanent Upgrades**
- **hp_upgrade** (200 gold): +20 Max HP permanen
- **attack_upgrade** (250 gold): +5 ATK permanen
- **defense_upgrade** (250 gold): +5 DEF permanen

### **✨ Special Items**
- **battle_reset** (500 gold): Reset limit battle harian

## 🎯 Gameplay Tips

1. **Mulai dengan monster mudah** seperti Goblin atau Skeleton
2. **Upgrade stats** secara berkala dengan item dari shop
3. **Gunakan boost** sebelum battle besar
4. **Heal** sebelum HP habis
5. **Manage limit battle** harian dengan bijak
6. **Kumpulkan gold** untuk upgrade permanen

## 📊 Level System

- **EXP per level**: 100 EXP
- **Level up bonus**:
  - +20 Max HP
  - +5 Attack
  - +3 Defense
  - Full heal otomatis

## 🔄 Daily Limits

- **Battle limit**: 10 battle per hari
- **Reset time**: Otomatis setiap hari
- **Bypass**: Beli "battle_reset" item

## 💾 Database

Game menggunakan database JSON yang tersimpan di folder `database/`:
- `rpg_players.json` - Data player
- `rpg_characters.json` - Data monster
- `rpg_battles.json` - Riwayat battle

## 🏆 Contoh Gameplay

```
User: .rpg register
Bot: 🎉 SELAMAT DATANG DI RPG GAME!
     👤 Username: Level 1
     ❤️ HP: 100/100
     ⚔️ Attack: 20
     🛡️ Defense: 10
     💰 Gold: 100

User: .rpg battle goblin
Bot: ⚔️ BATTLE DIMULAI!
     👤 Username (Lv.1) VS 👹 Goblin
     Gunakan .rpg attack untuk menyerang!

User: .rpg attack
Bot: 👤 Username menyerang Goblin dan memberikan 18 damage!
     👹 Goblin menyerang Username dan memberikan 8 damage!
     
     🔄 STATUS BATTLE
     👤 Username: 92/100 HP
     👹 Goblin: 32/50 HP
     
     Giliran kamu! Gunakan .rpg attack lagi!

User: .rpg attack
Bot: 🎉 KEMENANGAN!
     👤 Username mengalahkan Goblin!
     💰 Gold: +20
     ⭐ EXP: +10
```

Game RPG sudah siap digunakan! 🎮✨