import {City} from './city.model';

export class Search {
    constructor(
        public id: number,
        public userAuthId: number,
        public registeredPharmacyName: string,
        public pharmacistFullName: string,
        public drugLicenseNumber: string,
        public addressLine1: string,
        public addressLine2: string,
        public city: City,
        public cityId: number,
        public whatsappNumber: string,
        public imageLogoUrl: string,
        public displayName: string,
        public phoneNumber: string,
        public monStartHour: string,
        public tueStartHour: string,
        public wedStartHour: string,
        public thuStartHour: string,
        public friStartHour: string,
        public satStartHour: string,
        public sunStartHour: string,
        public monEndHour: string,
        public tueEndHour: string,
        public wedEndHour: string,
        public thuEndHour: string,
        public friEndHour: string,
        public satEndHour: string,
        public sunEndHour: string,
        public status: string,
        public statusReason: string,
        public storeNumber: string
    ) {
    }
}

export class StoreTiming {
  isOpen: boolean;
  startHour;
  closeHour: string;
  nextDay;

}
