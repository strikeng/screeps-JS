import {room2num, creepConfigs, room1role} from './room.config';

// 全局在loop函数外使用的函数

function FillBody(length, nam2numArr) {
    let body = new Array(length);
    let i = 0;
    for (let part of nam2numArr) {
        body.fill(part[0], i, i+part[1])
        i += part[1];
    }
    if (i != length) throw 'lengtherror'
    return body;
}


function SafeRoomOut(roomName) {
    // memory.outerHostileTime=[null,12,null,null]记录房间外敌人初次出现时间，分别对应房间0,1,2,3
    if (!Game.spawns['Spawn1'].room.memory.outerHostileTime) Game.spawns['Spawn1'].room.memory.outerHostileTime = [];
    if (!Game.spawns['Spawn1'].room.memory.outerHostileTime[room2num[roomName]]) {
        if (!Game.rooms[roomName]) return true;
        else {
            const hostileNum = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS).length;
            if (hostileNum) {
                Game.spawns['Spawn1'].room.memory.outerHostileTime[room2num[roomName]] = Game.time;
                return false;
            }
            else {
                return true;
            }
        }
    }
    else {
        if (Game.time-Game.spawns['Spawn1'].room.memory.outerHostileTime[room2num[roomName]]>1500) {
            Game.spawns['Spawn1'].room.memory.outerHostileTime[room2num[roomName]] = null;
            return true
        }
        else {
            return false;
        }
    }
}

function CheckCreepNum (timeInterval) {
    if (Game.time % timeInterval == 0) {
        let isRoom1Safe = myFunction.SafeRoomOut('W29S52'); // ROOM1是否安全

        for (let i in creepConfigs) {
            let spawnName = creepConfigs[i].spawn;
            let role = creepConfigs[i].role;
            let roleNum =  _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
            let planNum
            if (!Game.spawns[spawnName].memory.spawnList) {
                planNum = 0;
            }
            else {
                planNum = Game.spawns[spawnName].memory.spawnList.filter(task => task == role).length;
            }
            if (roleNum+planNum<creepConfigs[i].number) {
                if (isRoom1Safe || !room1role.includes(role)) {
                    Game.spawns[spawnName].addTask(role);
                    console.log(`新增creep:role:${creepConfigs[i].role}`)
                }            
            } 
            else if(roleNum+planNum>creepConfigs[i].number) {
                console.log(`task名称:${i},role:${creepConfigs[i].role},已有数量:${roleNum+planNum},初始化数量:${creepConfigs[i].number},已超出`)
            }
        }
    }
}


/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
const stateScanner = function () {
    // 每 20 tick 运行一次
    if (Game.time % 20) return 

    if (!Memory.stats) Memory.stats = {}

    // 统计 GCL / GPL 的升级百分比和等级
    Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100
    Memory.stats.gclLevel = Game.gcl.level
    Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100
    Memory.stats.gplLevel = Game.gpl.level
    // CPU 的当前使用量
    Memory.stats.cpu = Game.cpu.getUsed()
    // bucket 当前剩余量
    Memory.stats.bucket = Game.cpu.bucket
}

const myFunction = {FillBody, SafeRoomOut, CheckCreepNum, stateScanner}


export default myFunction;