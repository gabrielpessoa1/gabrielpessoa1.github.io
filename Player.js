/**
 * Created by Gabriel on 17/10/2016.
 */
// Construtor do player
Player = function() {
    this.lastTime = Date.now();
    this.navs = {
        units: new Nav("units", "Units"),
        army: new Nav("armyUnits", "Army"),
        upgrades: new Nav("upgrades", "Upgrades"),
        conquests: new Nav("conquests", "Conquests"),
        about: new Nav("about", "About")
    };
    this.resources = {
        // new Resource(id, nome do recurso, plural)
        food: new Resource("food"),
        research: new Resource("research"),
        cash: new Resource("cash"),
        military: new Resource("military"),
        army: new ArmyPoint("army", "Fight", 5000)
    };
    this.units = {
        /* new Unit(id, nome da unidade, plural, nome da ação da unidade, custo inicial, crescimento do custo,
                    quantos recursos cada unidade da, tempo para coletar o recurso,
                    recurso que a unidade coleta, recurso que compra a unidade) */
        hunter: new Unit("hunter", "Hunter-Gatherer", "Hunter-Gatherers", "Hunt-Gather", 10, 1.07, 1, 2000,
            this.resources.food, this.resources.food),
        scholar: new Unit("scholar", "Scholar", "Scholars", "Study", 100, 1.07, 1, 3000,
            this.resources.research, this.resources.food),
        merchant: new Unit("merchant", "Merchant", "Merchants", "Trade", 300, 1.07, 1, 12000,
            this.resources.cash, this.resources.food),
        miner: new Unit("miner", "Miner", "Miners", "Mine", 200, 1.07, 1, 6000,
            this.resources.military, this.resources.food)
    };
    this.army = {
        warrior: new ArmyUnit("warrior", "Warrior", "Warriors", 10, 1.07, 1,
            this.resources.army, this.resources.military),
        archer: new ArmyUnit("archer", "Archer", "Archers", 50, 1.07, 5,
            this.resources.army, this.resources.military)
    };
    this.upgrades = {
        // new InitialUpgrade(id, nome do upgrade, descrição, nome do que é destravado, custo e recurso se existirem)
        /* new ConquestUpgrade ou UnlockUpgrade(id, nome do upgrade, descrição, custo, nome do que é destravado,
                                                recurso usado pra comprar e se upgrades ja foi destravado) */
        // new ManagerUpgrade(id, nome do manager, descrição, custo, unidade e recurso usado pra comprar)
        /* new ProductionUpgrade or SpeedUpgrade(id, nome do upgrade, descrição, custo, multiplicador, unidade e recurso
                                                  usado pra comprar) */
        /* new UnitUpgrade(id, nome do upgrade, descrição, novo nome da unidade, novo plural, nova atividade, custo,
        upgrade de producao, upgrade de velocidade, unidade e recurso usado pra comprar) */

        /** Food  Units **/
        // Hunter-Gatherer
        hunterUnlock: new InitialUpgrade("hunterUnlock", "Get Some Food", "WE'RE STARVING", "Hunter-Gatherers and Food"),
        hunterUpgrade1: new SpeedUpgrade("hunterUpgrade1", "Stone Tools",
            "Polishing a stone with another stone? WHAT A GREAT IDEA",
            10, 2, this.units.hunter, this.resources.food),
        hunterUpgrade2: new SpeedUpgrade("hunterUpgrade2", "Group Hunting",
            "Hey guys... How about grouping up?",
            10, 2, this.units.hunter, this.resources.food),
        hunterUpgrade3: new SpeedUpgrade("hunterUpgrade3", "Plant Knowledge",
            "Maybe we shouldn't eat that",
            10, 2, this.units.hunter, this.resources.food),
        hunterUpgrade4: new SpeedUpgrade("hunterUpgrade4", "Fire Knowledge",
            "The Gods gave us fire",
            10, 2, this.units.hunter, this.resources.food),
        hunterManager: new ManagerUpgrade("hunterManager", "Tribal Chief",
            "Because somebody have to tell you what to do",
            20, this.units.hunter, this.resources.food),
        // Farmer
        farmerUnlock: new UnitUpgrade("farmerUnlock", "Agriculture",
            "It's time to settle down!", "farmer", "Farmer", "Farmers", "Farm",
            50, 20, 0.2, this.units.hunter, this.resources.food),
        farmerUpgrade1: new SpeedUpgrade("farmerUpgrade1", "Calendar",
            "Maybe there´s a reason for always being cold this time of year, but for now I settle for knowing what a year is",
            10, 2, this.units.hunter, this.resources.research),
        farmerUpgrade2: new SpeedUpgrade("farmerUpgrade2", "Irrigation",
            "Who would knew that pouring water into plants would make them bigger!",
            10, 2, this.units.hunter, this.resources.research),
        farmerUpgrade3: new SpeedUpgrade("farmerUpgrade3", "Animal Husbrandy",
            "Squeezing a cows tit... Who knew it would be a good idea!",
            10, 2, this.units.hunter, this.resources.research),
        farmerUpgrade4: new SpeedUpgrade("farmerUpgrade4", "Wheel",
            "You spin my head right round right round",
            10, 2, this.units.hunter, this.resources.research),
        farmerManager: new ManagerUpgrade("farmerManager", "Nobility",
            "I'M THE LORD OF THIS FARM",
            20, this.units.hunter, this.resources.research),
        /** Research Units */
        // Scholar
        scholarUnlock: new UnlockUpgrade("scholarUnlock", "Astronomy",
            "The stars influence our fate? Yeah makes sense",
            20, "Scholars and Research", this.resources.food),
        scholarUpgrade1: new SpeedUpgrade("scholarUpgrade1", "Writing",
            "Wow, your calligraphy sucks... You should be a doctor",
            10, 2, this.units.scholar, this.resources.research),
        scholarUpgrade2: new SpeedUpgrade("scholarUpgrade2", "Academy",
            "When its time for lunch?",
            10, 2, this.units.scholar, this.resources.research),
        scholarUpgrade3: new SpeedUpgrade("scholarUpgrade3", "Mathematics",
            "Wow, I cant see this getting too complicated a few centuries from now",
            10, 2, this.units.scholar, this.resources.research),
        scholarManager: new ManagerUpgrade("scholarManager", "Professor",
            "These are my X-me- oops wrong line",
            20, this.units.scholar, this.resources.research),
        /** Cash Units */
        // Merchant
        merchantUnlock: new UnlockUpgrade("merchantUnlock", "Build a City",
            "This place could use some buildings",
            20, "Merchant and Cash", this.resources.research),
        merchantUpgrade1: new SpeedUpgrade("merchantUpgrade1", "Caravans",
            "I will show you the world",
            10, 2, this.units.merchant, this.resources.research),
        merchantUpgrade2: new SpeedUpgrade("merchantUpgrade2", "Trade Guilds",
            "Double the people, Triple the profit",
            10, 2, this.units.merchant, this.resources.research),
        merchantUpgrade3: new SpeedUpgrade("merchantUpgrade3", "Currency",
            "One coin, enough for... Well, enough for nothing",
            10, 2, this.units.merchant, this.resources.research),
        merchantManager: new ManagerUpgrade("merchantManager", "Guild Master",
            "So, when is the next raid?",
            20, this.units.merchant, this.resources.research),
        /** Military Resources Units */
        // Miner
        minerUnlock: new UnlockUpgrade("minerUnlock", "Mining",
            "Breaking a stone with another stone? WHAT A MARVELOUS IDEA",
            20, "Miner and Military Resources", this.resources.research),
        minerUpgrade1: new SpeedUpgrade("minerUpgrade1", "Lamp",
            "Let there be Rock... oops I mean Light",
            10, 2, this.units.miner, this.resources.research),
        minerUpgrade2: new SpeedUpgrade("minerUpgrade2", "Bronze Mining",
            "I don't know what it is, but its shiny and I want it",
            10, 2, this.units.miner, this.resources.research),
        minerUpgrade3: new SpeedUpgrade("minerUpgrade3", "Bronze Pickaxe",
            "I wish I had three diamonds...",
            10, 2, this.units.miner, this.resources.research),
        minerManager: new ManagerUpgrade("minerManager", "Foreman",
            "MINE HARDER AND FASTER!",
            20, this.units.miner, this.resources.research),
        /** Army Upgrades */
        armyManager: new ManagerUpgrade("armyManager", "Commander",
            '"The Art of War"... Wish I had read it',
            50, this.resources.army, this.resources.research),
        armyUpgrade1: new SpeedUpgrade("armyUpgrade1", "Scouting",
            "Let me see whats going on over there",
            50, 2, this.resources.army, this.resources.research),
        /** Army Units */
        //Warrior
        warriorUnlock: new UnlockUpgrade("warriorUnlock", "Ruler",
            "I'm the Lord of this Village",
            50, "Warrior and Army", this.resources.research),
        spearmanUnlock: new ArmyUpgrade("spearmanUnlock", "Bronze Weapons",
            "KILL ALL YOUR ENEMIES, WITH OUR NEW PRODUCT: BRONZE", "spearman", "Spearman", "Spearmans", "Fight",
            50, 10, this.army.warrior, this.resources.research),
        // Archer
        archerUnlock: new UnlockUpgrade("archerUnlock", "Archery",
            "When you really think about it, an arrow is a spear. So an archer really is just a spearman. But we needed the name for another unit.",
            50, "Archer", this.resources.research),
        /** Conquests */
        armyConquest1: new ConquestUpgrade("armyConquest1", "Secure our lands",
            "This land is mine, God gave this land to me",
            100000, "The World", this.resources.army)
    };
    this.refreshRewards();
};

Player.prototype.keysAndLocks = function() {
    this.upgrades.hunterUnlock.keysAndLocks(1, [this.units.hunter, this.resources.food, this.navs.units,
        this.navs.about, this.navs.upgrades, this.upgrades.hunterUpgrade1]);
    this.upgrades.hunterUpgrade1.keysAndLocks(1, [this.upgrades.hunterUpgrade2]);
    this.upgrades.hunterUpgrade2.keysAndLocks(1, [this.upgrades.hunterUpgrade3, this.upgrades.hunterManager]);
    this.upgrades.hunterUpgrade3.keysAndLocks(1, [this.upgrades.hunterUpgrade4]);
    this.upgrades.hunterUpgrade4.keysAndLocks(1, [this.upgrades.farmerUnlock]);
    this.upgrades.hunterManager.keysAndLocks(1, [this.upgrades.farmerUnlock]);
    this.upgrades.farmerUnlock.keysAndLocks(2, [this.upgrades.scholarUnlock, this.upgrades.minerUnlock]);
    this.upgrades.farmerUpgrade1.keysAndLocks(1, [this.upgrades.farmerUpgrade2]);
    this.upgrades.farmerUpgrade2.keysAndLocks(1, [this.upgrades.farmerUpgrade3, this.upgrades.farmerManager]);
    this.upgrades.farmerUpgrade3.keysAndLocks(1, [this.upgrades.farmerUpgrade4]);
    this.upgrades.farmerUpgrade4.keysAndLocks(1, [this.upgrades.merchantUpgrade1]);
    this.upgrades.farmerManager.keysAndLocks(1, [this.upgrades.merchantUnlock]);
    this.upgrades.scholarUnlock.keysAndLocks(1, [this.units.scholar, this.resources.research,
        this.upgrades.farmerUpgrade1]);
    this.upgrades.scholarUpgrade1.keysAndLocks(1, [this.upgrades.scholarUpgrade2, this.upgrades.merchantUpgrade3]);
    this.upgrades.scholarUpgrade2.keysAndLocks(1, [this.upgrades.scholarUpgrade3, this.upgrades.scholarManager]);
    this.upgrades.scholarUpgrade3.keysAndLocks(1, []);
    this.upgrades.scholarManager.keysAndLocks(1, []);
    this.upgrades.merchantUnlock.keysAndLocks(2, [this.units.merchant, this.resources.cash,
        this.upgrades.merchantUpgrade1, this.upgrades.scholarUpgrade1, this.upgrades.minerUpgrade1]);
    this.upgrades.merchantUpgrade1.keysAndLocks(2, [this.upgrades.merchantUpgrade2]);
    this.upgrades.merchantUpgrade2.keysAndLocks(1, [this.upgrades.merchantUpgrade3, this.upgrades.merchantManager]);
    this.upgrades.merchantUpgrade3.keysAndLocks(2, []);
    this.upgrades.merchantManager.keysAndLocks(1, []);
    this.upgrades.minerUnlock.keysAndLocks(1, [this.units.miner, this.resources.military, this.upgrades.warriorUnlock]);
    this.upgrades.minerUpgrade1.keysAndLocks(1, [this.upgrades.minerUpgrade2]);
    this.upgrades.minerUpgrade2.keysAndLocks(1, [this.upgrades.minerManager, this.upgrades.minerUpgrade3,
        this.upgrades.spearmanUnlock]);
    this.upgrades.minerUpgrade3.keysAndLocks(1, []);
    this.upgrades.minerManager.keysAndLocks(1, []);
    this.upgrades.armyManager.keysAndLocks(1, [this.upgrades.armyUpgrade1, this.upgrades.spearmanUnlock]);
    this.upgrades.armyUpgrade1.keysAndLocks(1, [this.upgrades.archerUnlock]);
    this.upgrades.warriorUnlock.keysAndLocks(1, [this.army.warrior, this.resources.army, this.navs.army,
        this.navs.conquests, this.upgrades.armyConquest1, this.upgrades.armyManager, this.upgrades.merchantUnlock]);
    this.upgrades.spearmanUnlock.keysAndLocks(2, []);
    this.upgrades.archerUnlock.keysAndLocks(1, [this.army.archer]);
    this.upgrades.armyConquest1.keysAndLocks(1, []);
};

Player.prototype.refreshRewards = function() {
    for(var j in this.units) this.units[j].refreshRewards();
};

Player.prototype.gameLoop = function(interval) {
    for(var i in this.units) this.units[i].gameLoop(interval);
    this.resources.army.gameLoop(interval);
    for(var j in this.units) this.units[j].refreshButtons();
    for(var n in this.army) this.army[n].refreshButtons();
    for(var u in this.resources) this.resources[u].amount.refresh();
    for(var k in this.upgrades) this.upgrades[k].refreshButtons();
};