declare module 'react-native-email-action' {
  export type AppId =
    | 'mail'
    | 'gmail'
    | 'outlook'
    | 'spark'
    | 'airmail'
    | 'superhuman'
    | 'ymail'
    | 'fastmail'
    | 'protonmail';

  export interface SendEmailOptions {
    to: string;
    subject: string;
    body: string;
    cc?: string[];
    bcc?: string[];
    cancelText?: string;
    appIds?: AppId[];
  }

  export function sendEmail(options: SendEmailOptions): Promise<string>;
  export function configureEmailApps(appIds: AppId[]): void;
}
