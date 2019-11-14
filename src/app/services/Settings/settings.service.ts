import { Injectable } from '@angular/core';
import { FileReadResult, FilesystemDirectory, FilesystemEncoding, FileWriteResult, Plugins } from '@capacitor/core';
import { SettingsModel } from '../../settings/settings.model';
import { ToastController } from '@ionic/angular';

const {Filesystem} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private readonly filePath = 'settings/user_settings.json';
    private _settings: SettingsModel = new SettingsModel();

    constructor(private _toastController: ToastController) {
        // Check if file exists
    }

    askPermissionsAndCreateDefault(): void {
        this._readSettingsIfAny().then((exists: boolean) => {
            if (!exists) {
                this._createDefaultSettings()
                    .catch(() => {
                        this._toastController.create({
                            message: 'Failed to create user settings!',
                            duration: 2500
                        }).then(toast => {
                            toast.present();
                        });
                    });
            }
        });
    }

    /**
     * Saves the new user settings model into phone storage
     * Will delete old file thus the new model should include the old settings
     * @param newUserSettings The new settings to save
     */
    async saveSettings(newUserSettings: SettingsModel): Promise<void> {
        try {
            await this._deleteFileIfExists();
            await this._createFileWithSettings(newUserSettings);
            const toast = await this._toastController.create({
                message: 'Saved Successfully!',
                duration: 2500
            });
            await toast.present();
        } catch (e) {
            const toast = await this._toastController.create({
                message: 'Failed to save new settings',
                duration: 2500
            });
            await toast.present();
        }
    }

    /**
     * Attempts to create the default settings on the users device
     * Will present an error if failure
     */
    private _createDefaultSettings(): Promise<FileWriteResult> {
        return Filesystem.writeFile({
            path: this.filePath,
            data: JSON.stringify(this.settings),
            directory: FilesystemDirectory.Documents,
            encoding: FilesystemEncoding.UTF8
        });
    }

    private async _createFileWithSettings(settings: SettingsModel): Promise<void> {
        await Filesystem.writeFile({
            path: this.filePath,
            data: JSON.stringify(settings),
            directory: FilesystemDirectory.Documents,
            encoding: FilesystemEncoding.UTF8
        });
    }

    private async _deleteFileIfExists(): Promise<void> {
        try {
            await Filesystem.deleteFile({
                path: this.filePath,
                directory: FilesystemDirectory.Documents
            });
        } catch (e) {
            // Ignore
        }
    }

    private async _readSettingsIfAny(): Promise<boolean> {
        try {
            const contents: FileReadResult = await Filesystem.readFile({
                path: 'secrets/text.txt',
                directory: FilesystemDirectory.Documents,
                encoding: FilesystemEncoding.UTF8
            });
            this._settings = JSON.parse(contents.data) as SettingsModel;

            return true;
        } catch (e) {
            // File doesnt exist
            return false;
        }
    }

    get settings(): SettingsModel {
        return this._settings;
    }
}
