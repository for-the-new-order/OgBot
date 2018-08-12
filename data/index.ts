export { motivations } from './motivation';
export { personalityTraits } from './personality';

import * as surnameData from './us-census/surname';
import * as femaleFirstname from './gutenberg/female-firstname';
import * as gutenbergLastname from './gutenberg/lastname';
import * as maleFirstname from './gutenberg/male-firstname';
import * as placesData from './gutenberg/places';

export const nameData = {
    usCensus: {
        surname: surnameData.data
    },
    gutenberg: {
        firstname: {
            female: femaleFirstname.data,
            male: maleFirstname.data
        },
        surname: gutenbergLastname.data,
        places: placesData.data
    },
    all: {
        firstname: femaleFirstname.data.concat(maleFirstname.data),
        surname: gutenbergLastname.data.concat(surnameData.data),
        places: placesData.data
    }
};
