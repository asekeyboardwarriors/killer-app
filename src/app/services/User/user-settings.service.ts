import { Injectable } from '@angular/core';
import { File, Folder, knownFolders } from 'file-system';
import { forkJoin } from 'rxjs';
import { IUserPreferences } from '~/app/models/User/user-settings';

@Injectable({
    providedIn: 'root'
})
export class UserSettingsService {
    private _preferencesFile: File;
    private _userPreferences: IUserPreferences;

    constructor() {
        const documents: Folder = knownFolders.documents() as Folder;
        const folder: Folder = documents.getFolder('domFolder') as Folder;
        this._preferencesFile = folder.getFile('preferencesFile.json');

        // Ensure default settings exist
        this._preferencesFile.readText().then(text => {
            console.log(text);
            if (!text) {
                const defaultSettings: IUserPreferences = {
                    locationUpdateFrequency: 60000
                };
                this._preferencesFile.writeText(JSON.stringify(defaultSettings));
                this._userPreferences = defaultSettings;
            } else {
                this._userPreferences = JSON.parse(text);
            }
        });

    }

    /**
     * Updates the user preferences settings stored in phone
     * @param userPreferences The user preferences stored in phone storage
     */
    updateUserPreferences(userPreferences: IUserPreferences): Promise<any> {
        this._userPreferences = userPreferences;

        return forkJoin([
            this._preferencesFile.remove(),
            this._preferencesFile.writeText(JSON.stringify(this._userPreferences))
        ]).toPromise();
    }

    /**
     * Gets the in memory preferences
     */
    get userPreferences(): IUserPreferences {
        return this._userPreferences;
    }

    get preferencesFile(): IUserPreferences {
        return JSON.parse(this._preferencesFile.readTextSync());
    }
}
