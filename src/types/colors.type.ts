import { platform } from "../const/platform.const";

export type TColors = {
    fgBlack: string,
    fgRed: string,
    fgGreen: string,
    fgYellow: string,
    fgBlue: string,
    fgMagenta: string,
    fgCyan: string,
    fgWhite: string,
    bgBlack: string,
    bgRed: string,
    bgGreen: string,
    bgYellow: string,
    bgBlue: string,
    bgMagenta: string,
    bgCyan: string,
    bgWhite: string,
    bgBlackBright: string,
    bgRedBright: string,
    bgGreenBright: string,
    bgYellowBright: string,
    bgBlueBright: string,
    bgMagentaBright: string,
    bgCyanBright: string,
    bgWhiteBright: string,
    reset: string,
    bright: string,
    dim: string,
    underscore: string,
}

export const nodeColors: TColors = {
    fgBlack: "\x1b[30m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
    bgBlackBright: "\x1b[100m",
    bgRedBright: "\x1b[101m",
    bgGreenBright: "\x1b[102m",
    bgYellowBright: "\x1b[103m",
    bgBlueBright: "\x1b[104m",
    bgMagentaBright: "\x1b[105m",
    bgCyanBright: "\x1b[106m",
    bgWhiteBright: "\x1b[107m",
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m"
}

const webColors = {
    fgBlack: "color:#000000;",
    fgRed: "color:#d91a31;",
    fgGreen: "color:#00ff00;",
    fgYellow: "color:#ffff00;",
    fgBlue: "color:#0000ff;",
    fgMagenta: "color:#a91ad9;",
    fgCyan: "color:#00ffff;",
    fgWhite: "color:#ffffff;",
    bgBlack: "background-color:#000000;",
    bgRed: "background-color:#d91a31;",
    bgGreen: "background-color:#00ff00;",
    bgYellow: "background-color:#ffff00;",
    bgBlue: "background-color:#0000ff;",
    bgMagenta: "background-color:#a91ad9;",
    bgCyan: "background-color:#00ffff;",
    bgWhite: "background-color:#ffffff;",
    bgBlackBright: "background-color:#000000;",
    bgRedBright: "background-color:#ff0000;",
    bgGreenBright: "background-color:#00ff00;",
    bgYellowBright: "background-color:#ffff00;",
    bgBlueBright: "background-color:#0000ff;",
    bgMagentaBright: "background-color:#ff00ff;",
    bgCyanBright: "background-color:#00ffff;",
    bgWhiteBright: "background-color:#ffffff;",
    reset: "",
    bright: "font-weight:bold;",
    dim: "opacity:0.6;",
    underscore: "text-decoration:underline;"
}

export type TColor = keyof TColors;

export type TColorsMap<T extends string> = {
    [key in T]?: TColor[];
};

export const getColor = (key: TColor) => {
    switch (platform) {
        case 'Browser':
            return webColors[key];
        case 'NodeJS':
            return nodeColors[key];
        default:
            throw `Unsupported platform: ${platform}`
    }
}