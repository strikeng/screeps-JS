import Mount from './mounts/mount'
import myFunction from './function.config'

import {room1role} from './room.config';

import {roleCharger} from './modules/rolecharger';
import {roleUpgrader} from './modules/roleupgrader';
import {roleBuilder} from './modules/rolebuilder';
import {roleContainer} from './modules/rolecontainer';
import {roleSigner} from './modules/rolesigner';
import {roleAttacker} from './modules/roleattacker';
import {roleCarrier} from './modules/rolecarrier';
import {actionTower} from './modules/actiontower';
import {errorMapper} from './modules/errorMapper';
import {handleEmergency} from './modules/handleemergency';
import {roleReserver} from './modules/rolereserver';
import {roleRepairer} from './modules/rolerepairer';
import {temp} from './modules/temp';
import {roleCarryUpgrader} from './modules/rolecarryupgrader'
import {roleMineraler} from './modules/rolemineraler'
import {roleCarryMineral} from './modules/rolecarrymineral'
import {roleManager} from './modules/rolemanager'
import {actionCenterLink} from './modules/actioncenterlink';

const ROOM0 = 'W29S53';
const ROOM1 = 'W29S52';
const ROOM2 = 'W29S51';
const ROOM3 = 'W28S52';

Mount();


// console.log(`1000资源消耗${Game.market.calcTransactionCost(1000,ROOM0,'W12S31')}`) // 851
// console.log(Game.market.deal('609b9f7e35d331ed233d888e', 3000, ROOM0))
// console.log(Game.market.credits)
// Game.market.createOrder({
//     type: 'sell',
//     resourceType: 'X',
//     price: 2.0,
//     totalAmount: 6000,
//     roomName: ROOM0,
// })

export const loop = errorMapper(function () {

    let isRoom1Safe = myFunction.SafeRoomOut(ROOM1);
    // 死前宣告重新生成，并清除memory
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            let role = Memory.creeps[name].role;
            // 当房间1不安全且死去的creep是房间1的角色时，不进行生成
            if (!isRoom1Safe && room1role.includes(role)) continue
            let spawnName = Memory.creeps[name].spawn;
            let canaddtask;
            if(!spawnName) {
                canaddtask = true;
            }
            if (role == 'charger') {
                canaddtask = Game.spawns[spawnName].addTask(role,true);
            }
            else if(role == 'builder') {
                canaddtask = true; // 生产的builder是一次性的，死了就不产下一个
            }
            else if(spawnName){
                canaddtask = Game.spawns[spawnName].addTask(role);
            }
            if (canaddtask) {
                delete Memory.creeps[name];
                console.log(`已添加生成队列，死亡creep对应角色编号是${role}`);
            }
            else {
                console.log(`添加任务到生成队列失败,canaddtask为false`)
            }
        }
    }

    let canSpawning = []
    for (let name in Game.spawns) {
        let spawn = Game.spawns[name];
        canSpawning.push(spawn.work())
    }

    myFunction.CheckCreepNum(20);

    const CREEP_HOSTILE = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS);
    const TOWERS_ROOM0 = Game.rooms[ROOM0].tower;

    // 如果没有charger了要赶紧补一个，用carrier来补充。
    let numCharger = _.filter(Game.creeps, creep => creep.memory.role == 'charger').length
    // console.log(`现存${numCharger}个charger`)
    if (numCharger == 0 && !canSpawning[0]) {
        for (let name in Game.creeps) {
            let creep = Game.creeps[name]
            if (creep.memory.role == 'carrier1' || creep.memory.role == 'carrier2') {
                creep.memory.role = 'charger'
                break;
            }
        }
    }

    if (!global.hostile) {
        global.hostile = [{}, {}]
    }

    if (CREEP_HOSTILE.length) {
        console.log('有敌人！')
        for (let hostiles of CREEP_HOSTILE) {
            if (!(hostiles.id in global.hostile[0]) && !(hostiles.id in global.hostile[1])) {
                if (hostiles.getActiveBodyparts(HEAL) > 0) {
                    global.hostile[0][hostiles.id] = '';
                }
                else if (hostiles.getActiveBodyparts(ATTACK) > 0 || hostiles.getActiveBodyparts(RANGED_ATTACK) > 0) {
                    global.hostile[1][hostiles.id] = '';
                }
            }
        }
        console.log('敌人有 '+(Object.keys(global.hostile[0]).length+Object.keys(global.hostile[1]).length)+'个')
    }
    

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'container1') {
            roleContainer.run(creep, [ROOM0, [5, 35]]);
        }
        if(creep.memory.role == 'container2') {
            roleContainer.run(creep, [ROOM0, [20, 27]]);
        }
        if(creep.memory.role == 'mineraler') {
            roleMineraler.run(creep, [ROOM0, [15, 42]]);
        }
        if(creep.memory.role == 'container11') {
            if (isRoom1Safe) {
                roleContainer.run(creep, [ROOM1, [30, 30]]); 
            }
            else {
                roleContainer.run(creep, [ROOM0, [5, 33]]); 
            }
        }
        if(creep.memory.role == 'container12') {
            if (isRoom1Safe) {
                roleContainer.run(creep, [ROOM1, [5, 16]]); 
            }
            else {
                roleContainer.run(creep, [ROOM0, [5, 34]]); 
            }
        }
        if(creep.memory.role == 'carrier1') {
            if (CREEP_HOSTILE.length) {
                roleCarryUpgrader.run(creep, [26, 38], TOWERS_ROOM0)
            }
            else {
                roleCarrier.run(creep, [ROOM0, 'left']);
            }
        }
        if(creep.memory.role == 'carrier2') {
            if (CREEP_HOSTILE.length) {
                roleCarryUpgrader.run(creep, [26, 38], TOWERS_ROOM0)
            }
            else {
                roleCarrier.run(creep, [ROOM0, 'right']);
            }
        }
        if(creep.memory.role == 'carrier3') {
            roleCarryMineral.run(creep, [ROOM0, [15, 42]]);
        }
        if(creep.memory.role == 'charger') {
            if (CREEP_HOSTILE.length) {
                roleCarryUpgrader.run(creep, [26, 38], TOWERS_ROOM0)
            }
            else {
                roleCharger.run(creep, TOWERS_ROOM0);
            }
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, [26, 38]);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep, ROOM0);
        }
        if(creep.memory.role == 'signer') {
            roleSigner.run(creep, 'W28S51');
        }
        if(creep.memory.role == 'reserver1') {
            roleReserver.run(creep, ROOM1, [16,40])
        }
        if(creep.memory.role == 'reserver2') {
            roleReserver.run(creep, ROOM2, [35,36])
        }
        if(creep.memory.role == 'reserver3') {
            roleReserver.run(creep, ROOM3, [34,21])
        }
        if(creep.memory.role == 'builder1') {
            if (isRoom1Safe) {
                roleBuilder.run(creep, ROOM1);
            }
            else {
                roleBuilder.run(creep, ROOM0);
            }
        }
        if(creep.memory.role == 'carrier11') {
            if (isRoom1Safe) {
                roleCarrier.run(creep, [ROOM1, 'right']);
            }
            else {
                roleCarrier.run(creep, [ROOM0, 'right']);
            }
        }
        if(creep.memory.role == 'carrier12') {
            if (isRoom1Safe) {
                roleCarrier.run(creep, [ROOM1, 'left']);
            }
            else {
                roleCarrier.run(creep, [ROOM0, 'left']);
            }
        }
        if(creep.memory.role == 'temp') {
            temp.run(creep);
        }
        if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep,ROOM1);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep,creep.room.rampart)
        }
        if(creep.memory.role == 'manager') {
            roleManager.run(creep, [19, 38])
        }
    }
    

    for (let tower of TOWERS_ROOM0) {
        actionTower.run(tower);
    }

    const centerlink = Game.rooms[ROOM0].link.filter(i => i.pos.x==19 && i.pos.y==39)[0];
    actionCenterLink.run(centerlink);
    

    if(Game.spawns['Spawn1'].spawning) { 
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 2, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }


    // 统计全局资源使用
    // myFunction.stateScanner()
})