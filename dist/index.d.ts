import { AppId } from './emailAppConfig';
/**
 * Configure which email apps should be available (iOS only)
 */
export declare const configureEmailApps: (appIds: AppId[]) => void;
export interface SendEmailOptions {
    to: string;
    subject: string;
    body: string;
    cancelText?: string;
    cc?: string[];
    bcc?: string[];
    /** Only for iOS: restrict choices for this call */
    appIds?: AppId[];
}
export declare const sendEmail: ({ to, subject, body, cancelText, cc, bcc, appIds, }: SendEmailOptions) => Promise<string>;
