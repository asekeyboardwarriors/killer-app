export class SettingsModel {
    constructor(
        public locInterval = 60,
        public distance = 50,
        public gradientBool = false,
        public localExtrema = true) {
    }
}
