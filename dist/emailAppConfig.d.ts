/**
 * Email App Configuration (TypeScript)
 */
export type AppId = 'gmail' | 'outlook' | 'mail' | 'spark' | 'airmail' | 'superhuman' | 'ymail' | 'fastmail' | 'protonmail';
export interface EmailApp {
    displayName: string;
    scheme: string;
    linkFormat: (to: string, subject: string, body: string, cc: string[], bcc: string[]) => string;
}
export declare const EMAIL_APPS: Record<AppId, EmailApp>;
export declare const DEFAULT_APP_IDS: AppId[];
