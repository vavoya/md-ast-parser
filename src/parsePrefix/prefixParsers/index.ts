import parseHashLineToBlock from "./parseHashLineToBlock";
import parseDashLineToBlock from "./parseDashLineToBlock";
import parseBacktickLineToBlock from "./parseBacktickLineToBlock";
import parseNumberLineToBlock from "./parseNumberLineToBlock";
import parseGreaterThanLineToBlock from './parseGreaterThanLineToBlock';

const prefixparsers = {
    '#': parseHashLineToBlock,
    '-': parseDashLineToBlock,
    '>': parseGreaterThanLineToBlock,
    '`': parseBacktickLineToBlock,
    '0': parseNumberLineToBlock,
    '1': parseNumberLineToBlock,
    '2': parseNumberLineToBlock,
    '3': parseNumberLineToBlock,
    '4': parseNumberLineToBlock,
    '5': parseNumberLineToBlock,
    '6': parseNumberLineToBlock,
    '7': parseNumberLineToBlock,
    '8': parseNumberLineToBlock,
    '9': parseNumberLineToBlock,
};

export default prefixparsers;