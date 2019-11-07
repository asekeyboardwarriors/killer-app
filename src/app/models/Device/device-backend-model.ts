export class DeviceModel {
    deviceId: string;
    phoneNumber?: string;
    phoneType: string;
    countryCode: string;

    constructor(deviceId = '',
                phoneNumber = '',
                phoneType = '',
                countryCode = '') {
        this.deviceId = deviceId;
        this.phoneNumber = phoneNumber;
        this.phoneType = phoneType;
        this.countryCode = countryCode;
    }

}
