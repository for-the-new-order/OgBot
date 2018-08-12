export { motivations } from './motivation';
export { personalityTraits } from './personality';
export { ranks } from './ranks';

import { data as surnameData } from './us-census/surname';
import { data as femaleFirstname } from './gutenberg/female-firstname';
import { data as gutenbergLastname } from './gutenberg/lastname';
import { data as maleFirstname } from './gutenberg/male-firstname';
import { data as placesData } from './gutenberg/places';

export const nameData = {
    usCensus: {
        surname: surnameData
    },
    gutenberg: {
        firstname: {
            female: femaleFirstname,
            male: maleFirstname
        },
        surname: gutenbergLastname,
        places: placesData
    },
    all: {
        firstname: femaleFirstname.concat(maleFirstname),
        surname: gutenbergLastname.concat(surnameData),
        places: placesData
    }
};
