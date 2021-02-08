import {State} from './state.model';

export class City {
    constructor(
        public id: number,
        public cityName: string,
        public pinCode: string,
        public state: State
    ) { }
}
