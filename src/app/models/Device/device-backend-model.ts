export class DeviceModel {
    private _deviceId: string;
    private _phoneNumber?: string;
    private _phoneType: string;
    private _countryCode: string;

    constructor(deviceId = '',
                phoneNumber = '',
                phoneType = '',
                countryCode = '') {
        this._deviceId = deviceId;
        this._phoneNumber = phoneNumber;
        this._phoneType = phoneType;
        this._countryCode = countryCode;
    }

    get deviceId(): string {
        return this._deviceId;
    }

    set deviceId(value: string) {
        this._deviceId = value;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    get phoneType(): string {
        return this._phoneType;
    }

    set phoneType(value: string) {
        this._phoneType = value;
    }

    get countryCode(): string {
        return this._countryCode;
    }

    set countryCode(value: string) {
        this._countryCode = value;
    }
}
