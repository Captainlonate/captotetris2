"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessBreaks = void 0;
const NUMROWS = 15;
const NUMCOLS = 7;
const DROP_ORDER = [0, 6, 1, 5, 2, 4, 3]; // .length === NUMCOLS
const PIECE_TYPES = {
    EMPTY: 'E',
    CEMENT: 'C',
    BLOCKS: {
        RED: 'r',
        GREEN: 'g',
        BLUE: 'b',
        YELLOW: 'y',
    },
    BREAKERS: {
        RED: 'R',
        GREEN: 'G',
        BLUE: 'B',
        YELLOW: 'Y',
    },
    CEMENTS: {
        RED: 'rc',
        GREEN: 'gc',
        BLUE: 'bc',
        YELLOW: 'yc',
    },
    CEMENTS_VISIBLE: {
        RED: 'rv',
        GREEN: 'gv',
        BLUE: 'bv',
        YELLOW: 'yv',
    },
};
const BLOCKS = Object.values(PIECE_TYPES.BLOCKS);
const BREAKERS = Object.values(PIECE_TYPES.BREAKERS);
const CEMENTS = Object.values(PIECE_TYPES.CEMENTS);
const CEMENTS_VISIBLE = Object.values(PIECE_TYPES.CEMENTS_VISIBLE);
// ====================================================
const add = (a, b) => a + b;
/**
 * Given an array, choose and return one randomly selected element.
 */
const getRandom = (arr) => (arr[Math.floor(Math.random() * arr.length)]);
/**
 * Given some number of blocks broken, compute how many trash blocks
 * should be generated. This does not consider other factors such
 * as combo levels, or number of breaks per turn.
 *
 * This function may seem complicated because the values are memoized
 * so as to not re-compute trash per input. Also, the most likely
 * values are precomputed ahead of time.
 * @returns
 */
const getTrashCountForBrokenBlocks = (() => {
    const cache = {};
    function checkCacheOrCompute(numBroken) {
        if (!(numBroken in cache)) {
            // Compute the number of trash blocks given how many was broken
            // 1 Trash for every 3 broken, and a bonus one for every 8.
            cache[numBroken] = Math.ceil(numBroken / 3) + Math.floor(numBroken / 8);
        }
        return cache[numBroken];
    }
    // Precompute the most likely-used values up front
    for (let num = 1; num < 105; num++) {
        cache[num] = Math.ceil(num / 3) + Math.floor(num / 8);
    }
    return checkCacheOrCompute;
})();
/**
 * Compute the amount of trash for a single turn/step of a combo.
 * This will consider how many breaks were part of this turn.
 * This does not consider which step/level of a combo it's on.
 */
const ComputeTrashForOneBreak = (blocksBroken, breakersThisTurn) => {
    const baseCount = getTrashCountForBrokenBlocks(blocksBroken);
    const breaksModifier = (breakersThisTurn > 1)
        ? baseCount + (baseCount * (breakersThisTurn * .1))
        : baseCount;
    return Math.floor(breaksModifier);
};
/**
 *
 * @param baseNumber
 * @param comboCount
 * @returns
 */
const ComputeComboBonus = (baseNumber, comboCount) => ((comboCount > 1)
    ? baseNumber * (comboCount * .1)
    : 0);
/**
 *
 * @param breaks
 * @returns
 */
const ComputeTotalNumberOfTrashBlocks = (breaks) => {
    let totalNumberOfTrashBlocks = 0;
    for (const turn of breaks) {
        const numberBroken = Array.isArray(turn) ? turn.reduce(add, 0) : turn;
        const breakersThisTurn = Array.isArray(turn) ? turn.length : 1;
        totalNumberOfTrashBlocks += ComputeTrashForOneBreak(numberBroken, breakersThisTurn);
    }
    totalNumberOfTrashBlocks += ComputeComboBonus(totalNumberOfTrashBlocks, breaks.length);
    return Math.floor(totalNumberOfTrashBlocks);
};
/**
 *
 * @param totalNumberOfTrashBlocks
 * @returns
 */
const GetBlockCountPerColumn = (totalNumberOfTrashBlocks) => {
    const trashPerColumn = (new Array(DROP_ORDER.length)).fill(0);
    for (let idx = 0; idx < totalNumberOfTrashBlocks; idx++) {
        const index = DROP_ORDER[idx % trashPerColumn.length];
        trashPerColumn[index]++;
    }
    return trashPerColumn;
};
/*

*/
const ConvertTrashCountToCements = (arrayOfTrashPerCol) => (arrayOfTrashPerCol.map((count) => ((new Array(count)).fill(null).map(() => getRandom(CEMENTS)))));
/*

*/
const ProcessBreaks = (breaks) => {
    const totalNumberOfTrashBlocks = ComputeTotalNumberOfTrashBlocks(breaks);
    const blockCountPerColumn = GetBlockCountPerColumn(totalNumberOfTrashBlocks);
    return ConvertTrashCountToCements(blockCountPerColumn);
};
exports.ProcessBreaks = ProcessBreaks;
console.clear();
// Test Data
const breaksArray = [8, [4, 7], 3];
console.log((0, exports.ProcessBreaks)(breaksArray));
