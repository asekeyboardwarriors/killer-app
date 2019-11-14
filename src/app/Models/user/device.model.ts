export class DeviceModel {
    constructor(public deviceId = '',
                public phoneNumber: number = 0,
                public phoneType: string = '',
                public countryCode: string = '') {
    }
}
