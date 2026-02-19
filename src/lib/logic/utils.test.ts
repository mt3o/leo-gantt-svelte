import {deepMerge, type DeepPartial} from "$lib/logic/utils";
import {describe, it, expect} from 'vitest';

describe('deep merge',()=>{
    it('works',()=>{


        interface UserSettings {
            theme: {
                mode: 'dark' | 'light';
                accent: string;
            };
            notifications: boolean;
        }

        const defaultSettings: UserSettings = {
            theme: { mode: 'light', accent: 'blue' },
            notifications: true
        };

        const userOverride: DeepPartial<UserSettings> = {
            theme: { accent: 'red' }
        };

        const backendData: DeepPartial<UserSettings> = {
            notifications: false
        };

        // Merged will be inferred as UserSettings
        const finalSettings = deepMerge(defaultSettings, userOverride, backendData);

        expect(finalSettings.theme.mode).toBe('light'); //from defaults
        expect(finalSettings.theme.accent).toBe('red'); //from user
        expect(finalSettings.notifications).toBe(false); //from backend


    })
})
