// Base62 to Zhuyin mapping function
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const ZHUYIN = [
    'ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ',
    'ㄧ', 'ㄨ', 'ㄩ', 'ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ'
];

// Converts a Base62 character to its index
function base62ToIndex(char) {
    return BASE62.indexOf(char);
}

// Converts a 6-character Base62 string to a decimal number
function base62ToDecimal(str) {
    let value = 0;
    for (let i = 0; i < str.length; i++) {
        value = value * 62 + base62ToIndex(str[i]);
    }
    return value;
}

// Converts a decimal number to a 7-character Zhuyin string
function decimalToZhuyin(decimal) {
    const result = [];
    for (let i = 0; i < 7; i++) {
        result.unshift(ZHUYIN[decimal % 37]);
        decimal = Math.floor(decimal / 37);
    }
    return result.join('');
}

// Converts a Zhuyin character to its index
function zhuyinToIndex(char) {
    return ZHUYIN.indexOf(char);
}

// Converts a 7-character Zhuyin string to a decimal number
function zhuyinToDecimal(str) {
    let value = 0;
    for (let i = 0; i < str.length; i++) {
        value = value * 37 + zhuyinToIndex(str[i]);
    }
    return value;
}

// Converts a decimal number to a 6-character Base62 string
function decimalToBase62(decimal) {
    const result = [];
    for (let i = 0; i < 6; i++) {
        result.unshift(BASE62[decimal % 62]);
        decimal = Math.floor(decimal / 62);
    }
    return result.join('');
}

// Main function to map Zhuyin string back to Base62
function zhuyinToBase62(input) {
    const chunks = input.match(/.{1,7}/g); // Split input into chunks of 7 characters
    const base62Output = chunks.map(chunk => {
        const decimalValue = zhuyinToDecimal(chunk);
        return decimalToBase62(decimalValue);
    });
    return base62Output.join('');
}

// Main function to map Base62 string to Zhuyin
function base62ToZhuyin(input) {
    const chunks = input.match(/.{1,6}/g); // Split input into chunks of 6 characters
    const zhuyinOutput = chunks.map(chunk => {
        // Pad chunk to 6 characters if necessary
        const paddedChunk = chunk.padEnd(6, '0');
        const decimalValue = base62ToDecimal(paddedChunk);
        return decimalToZhuyin(decimalValue);
    });
    return zhuyinOutput.join(' ');
}

// Validate if input string contains only valid Zhuyin characters
function isValidZhuyin(input) {
    return [...input].every(char => ZHUYIN.includes(char));
}

// Entry function: Convert Zhuyin input to URL
function zhuyinToUrl(input) {
    if (!isValidZhuyin(input)) {
        throw new Error('Input contains invalid Zhuyin characters');
    }
    const base62 = zhuyinToBase62(input);
    return `https://reurl.cc/${base62}`;
}

// Extract the tail part of a URL
function extractTailFromUrl(url) {
    return new URL(url).pathname.split('/').at(-1);
}

// Extract the tail part of a URL
function extractQueryFromUrl(url) {
    const searchParams = new URL(url).searchParams;
    const token = searchParams.get("q") || searchParams.get("Q");
    return token;
}

// auto redirect on page load
try {
    const token = extractQueryFromUrl(location.href);
    if (token) {
        const translated = zhuyinToBase62(token);
        const newUrl = `https://reurl.cc/${translated}`;
        location.href = newUrl;
    }
} catch (e) {
    console.log(e);
}