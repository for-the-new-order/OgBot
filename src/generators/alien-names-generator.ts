import { FormatUtility } from './format-utility';

// prettier-ignore
export class AlienNamesGenerator {
    private nm1 = ["b", "br", "c", "cr", "ch", "d", "dr", "g", "gr", "j", "k", "kr", "kn", "km", "p", "pr", "q", "qr", "ql", "r", "st", "str", "t", "tr", "v", "vr", "w", "wr", "x", "xr", "z", "zr", "", "", "", "", ""];
    private nm2 = ["a", "e", "i", "o", "u", "y", "au", "ou", "ei", "uy", "oe", "ua", "ue", "uo", "a", "e", "i", "o", "u", "y"];
    private nm3 = ["b", "c", "d", "g", "j", "k", "l", "m", "p", "q", "r", "s", "t", "v", "w", "x", "z", "br", "cr", "dr", "gr", "kr", "km", "pr", "qr", "st", "tr", "vr", "wr", "xx", "zz", "bb", "dd", "g", "kk", "q'", "k'", "rr", "r'", "t'", "tt", "vv", "v'", "wr", "x'", "z'", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    private nm4 = ["a", "e", "i", "o", "u", "y", "", "", "", "", "", ""];
    private nm5 = ["b", "d", "g", "gh", "hr", "ht", "hn", "hm", "hz", "hx", "hq", "k", "ks", "kx", "lk", "lz", "lp", "lt", "m", "mt", "nt", "p", "pt", "q", "r", "rs", "rt", "rq", "rk", "rc", "rb", "rd", "sk", "t", "th", "ts", "wth", "x", "z"];

    private nm6 = ["b", "bl", "c", "cl", "ch", "d", "f", "fr", "fl", "g", "gl", "gn", "h", "kl", "kn", "m", "n", "p", "pl", "ph", "q", "ql", "s", "st", "sl", "t", "v", "vl", "w", "z", "", "", "", "", "", "", "", "", ""];
    private nm7 = ["a", "e", "i", "o", "u", "y", "ae", "ea", "eo", "oe", "ie", "ue", "ua", "a", "e", "i", "o", "u", "y"];
    private nm8 = ["b", "c", "f", "g", "h", "k", "l", "m", "n", "p", "q", "r", "s", "w", "bb", "bl", "cl", "ff", "fl", "gl", "gn", "ks", "ll", "lh", "kh", "bh", "ch", "dh", "lm", "ln", "lph", "ls", "lf", "mm", "mn", "ms", "nn", "ns", "p", "ph", "ps", "rf", "ss", "st", "sh", "th", "ts", "s'", "l'", "n'", "m'", "f'", "h'"];
    private nm10 = ["", "b", "d", "g", "gh", "h", "hs", "ht", "hn", "hm", "hl", "k", "l", "ll", "kh", "lh", "lm", "ln", "lph", "ls", "lf", "m", "mm", "n", "nn", "ns", "p", "ms", "ph", "ps", "s", "ss", "sh", "th", "ts", "w"];
    private nm11 = ["a", "e", "i", "o", "u", "y", "ae", "ea", "eo", "oe", "ie", "ue", "ua", "", "", "", "", "", "", "", "", "", "", "", ""];

    private nm12 = ["b", "bl", "br", "c", "ch", "cl", "cr", "d", "dr", "f", "fl", "fr", "g", "gl", "gn", "gr", "h", "j", "k", "kl", "km", "kn", "kr", "m", "n", "p", "ph", "pl", "pr", "q", "ql", "qr", "r", "s", "sl", "sr", "st", "str", "t", "tl", "tr", "v", "vl", "vr", "w", "wr", "x", "xr", "z", "zr", "", "", "", "", "", "", ""];
    private nm13 = ["a", "ae", "au", "e", "ea", "ei", "eo", "i", "ie", "o", "oe", "ou", "u", "ua", "ue", "uo", "uy", "y"];
    private nm14 = ["b", "bb", "bh", "bl", "br", "c", "ch", "cl", "cr", "d", "dd", "dh", "dr", "f", "ff", "fl", "g", "gl", "gn", "gr", "h", "hh", "hl", "hm", "hn", "hs", "hsh", "j", "k", "k'", "kh", "kk", "km", "kr", "ks", "l", "lf", "lh", "ll", "lm", "ln", "lph", "ls", "m", "mm", "mn", "ms", "n", "nn", "ns", "p", "ph", "pr", "ps", "q", "q'", "qr", "r", "r'", "rf", "rr", "s", "sh", "ss", "st", "t", "t'", "th", "tr", "ts", "tt", "v", "v'", "vr", "vv", "w", "wr", "x", "x'", "xx", "z", "zz"];
    private nm15 = ["a", "e", "i", "o", "u", "y", "a", "ae", "au", "e", "ea", "ei", "eo", "i", "ie", "o", "oe", "ou", "u", "ua", "ue", "uo", "uy", "y", "", "", "", "", "", ""];
    private nm16 = ["b", "d", "g", "gh", "h", "hl", "hm", "hn", "hq", "hr", "hs", "hsh", "hst", "ht", "hx", "hz", "k", "kh", "ks", "kx", "l", "lf", "lh", "lk", "ll", "lm", "ln", "lp", "lph", "ls", "lst", "lt", "lz", "m", "mm", "mn", "ms", "mt", "n", "nn", "ns", "nt", "p", "ph", "ps", "pt", "q", "r", "rb", "rc", "rd", "rf", "rk", "rq", "rs", "rst", "rt", "s", "sh", "sk", "sp", "ss", "st", "t", "th", "ts", "w", "wth", "x", "z"];
    private nm17 = ["a", "e", "i", "o", "u", "y", "ae", "ea", "eo", "oe", "ie", "ue", "ua", "", "", "", "", "", "", "", "", "", "", "", ""];

    constructor(private formatUtility: FormatUtility) {}

    generate(): string {
        let name;
        const i = Math.floor(Math.random() * 10); // Simulate the original loop; but randomly instead
        if (i < 4) {
            const rnd = Math.floor(Math.random() * this.nm1.length);
            const rnd2 = Math.floor(Math.random() * this.nm2.length);
            const rnd3 = Math.floor(Math.random() * this.nm3.length);
            let rnd4 = Math.floor(Math.random() * this.nm4.length);
            if (rnd3 < 46) {
                while (rnd4 > 5) {
                    rnd4 = Math.floor(Math.random() * this.nm4.length);
                }
            }
            const rnd5 = Math.floor(Math.random() * this.nm5.length);
            name =
                this.nm1[rnd] +
                this.nm2[rnd2] +
                this.nm3[rnd3] +
                this.nm4[rnd4] +
                this.nm5[rnd5];
        } else if (i < 7) {
            const rnd = Math.floor(Math.random() * this.nm6.length);
            const rnd2 = Math.floor(Math.random() * this.nm7.length);
            const rnd3 = Math.floor(Math.random() * this.nm8.length);
            const rnd4 = Math.floor(Math.random() * this.nm4.length);
            let rnd5 = Math.floor(Math.random() * this.nm10.length);
            if (rnd4 > 5) {
                rnd5 = 0;
            }
            const rnd6 = Math.floor(Math.random() * this.nm11.length);
            name =
                this.nm6[rnd] +
                this.nm7[rnd2] +
                this.nm8[rnd3] +
                this.nm4[rnd4] +
                this.nm10[rnd5] +
                this.nm11[rnd6];
        } else {
            const rnd = Math.floor(Math.random() * this.nm12.length);
            const rnd2 = Math.floor(Math.random() * this.nm13.length);
            const rnd3 = Math.floor(Math.random() * this.nm14.length);
            let rnd4 = Math.floor(Math.random() * this.nm15.length);
            if (rnd3 < 46) {
                while (rnd4 > 5) {
                    rnd4 = Math.floor(Math.random() * this.nm15.length);
                }
            }
            const rnd5 = Math.floor(Math.random() * this.nm16.length);
            const rnd6 = Math.floor(Math.random() * this.nm17.length);
            name =
                this.nm12[rnd] +
                this.nm13[rnd2] +
                this.nm14[rnd3] +
                this.nm15[rnd4] +
                this.nm16[rnd5] +
                this.nm17[rnd6];
        }
        return this.formatUtility.capitalize(name);
    }
}
