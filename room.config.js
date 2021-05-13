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

let creepConfigs = [
    {
        role: 'container1',
        spawn: 'Spawn1',
        body: FillBody(8,[[WORK,5],[MOVE,3]]),
        number: 1
    },
    {
        role: 'container2',
        spawn: 'Spawn1',
        body: FillBody(8,[[WORK,5],[MOVE,3]]),
        number: 1
    },
    {
        role: 'charger',
        spawn: 'Spawn1',
        body: FillBody(24,[[CARRY,16],[MOVE,8]]),
        number: 1
    },
    {
        role: 'carrier1',
        spawn: 'Spawn1',
        body: FillBody(11,[[CARRY,7],[MOVE,4]]),
        number: 1
    },
    {
        role: 'carrier2',
        spawn: 'Spawn1',
        body: FillBody(12,[[CARRY,8],[MOVE,4]]),
        number: 1
    },
    {
        role: 'upgrader',
        spawn: 'Spawn1',
        body: FillBody(17,[[WORK,10],[CARRY,2],[MOVE,5]]),
        number: 3
    },
    {
        role: 'builder',
        spawn: 'Spawn1',
        body: FillBody(18,[[WORK,6],[CARRY,6],[MOVE,6]]),
        number: 0
    },
    {
        role: 'signer',
        spawn: 'Spawn1',
        body: FillBody(1,[[MOVE,1]]),
        number: 0
    },
    {
        role: 'attacker',
        spawn: 'Spawn1',
        body: FillBody(12,[[TOUGH,3],[MOVE,5],[RANGED_ATTACK,1],[HEAL,1],[ATTACK,1],[MOVE,1]]),
        number: 0
    },
    {
        role: 'container11',
        spawn: 'Spawn1',
        body: FillBody(8,[[WORK,5],[MOVE,3]]),
        number: 1
    },
    {
        role: 'carrier11',
        spawn: 'Spawn1',
        body: FillBody(18,[[CARRY,12],[MOVE,6]]),
        number: 2
    },
    {
        role: 'reserver1',
        spawn: 'Spawn1',
        body: FillBody(3,[[CLAIM,2],[MOVE,1]]),
        number: 1
    },
    {
        role: 'builder1',
        spawn: 'Spawn1',
        body: FillBody(12,[[WORK,4],[CARRY,4],[MOVE,4]]),
        number: 1
    },
    {
        role: 'container12',
        spawn: 'Spawn1',
        body: FillBody(8,[[WORK,5],[MOVE,3]]),
        number: 1
    },
    {
        role: 'carrier12',
        spawn: 'Spawn1',
        body: FillBody(24,[[CARRY,16],[MOVE,8]]),
        number: 2
    },
    {
        role: 'carrierupgrader',
        spawn: 'Spawn1',
        body: FillBody(9,[[CARRY,6],[MOVE,3]]),
        number: 0
    },
    {
        role: 'mineraler',
        spawn: 'Spawn1',
        body: FillBody(9,[[WORK,6],[MOVE,3]]),
        number: 1
    },
    {
        role: 'carrier3',
        spawn: 'Spawn1',
        body: FillBody(3,[[CARRY,2],[MOVE,1]]),
        number: 1
    },
    {
        role: 'manager',
        spawn: 'Spawn1',
        body: FillBody(20,[[CARRY,16],[MOVE,4]]),
        number: 1
    },
    
]

const room1role = ['container11', 'container12','carrier11','carrier12','reserver1','builder1','']

const room2num = {
    'W29S53': 0, 'W29S52': 1, 'W29S51': 2, 'W28S52': 3,
}

export {creepConfigs, room2num, room1role};