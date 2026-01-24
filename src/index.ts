import { ActionSheetIOS, Linking, Platform } from 'react-native';
import { EMAIL_APPS, DEFAULT_APP_IDS, AppId, EmailApp } from './emailAppConfig';

let activeEmailAppIds: AppId[] = DEFAULT_APP_IDS;

/**
 * Configure which email apps should be available (iOS only)
 */
export const configureEmailApps = (appIds: AppId[]) => {
  activeEmailAppIds = appIds;
};

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

type AvailableApp = {
  id: AppId;
  displayName: string;
  linkFormat: EmailApp['linkFormat'];
};

export const sendEmail = async ({
  to,
  subject,
  body,
  cancelText = 'Cancel',
  cc = [],
  bcc = [],
  appIds,
}: SendEmailOptions): Promise<string> => {
  const encodedBody = encodeURIComponent(body);
  let link = `mailto:${to}?subject=${subject}&body=${encodedBody}&cc=${cc.join(',')}&bcc=${bcc.join(',')}`;

  const appsToCheck = appIds || activeEmailAppIds;

  if (Platform.OS === 'ios') {
    const availableApps: AvailableApp[] = [];

    // Check which apps are available
    for (const appId of appsToCheck) {
      const app = EMAIL_APPS[appId];
      if (app) {
        const canOpen = await Linking.canOpenURL(app.scheme);
        if (canOpen) {
          availableApps.push({
            id: appId,
            displayName: app.displayName,
            linkFormat: app.linkFormat,
          });
        }
      }
    }

    if (availableApps.length === 0) {
      throw new Error('No email app provider available');
    }

    const options = availableApps.map((app) => app.displayName);
    options.push(cancelText);

    return new Promise((resolve) => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        },
        (buttonIndex: number) => {
          if (buttonIndex !== options.length - 1) {
            const selectedApp = availableApps[buttonIndex];
            link = selectedApp.linkFormat(to, subject, encodedBody, cc, bcc);
            Linking.openURL(link);
            resolve(link);
          }
        },
      );
    });
  } else if (Platform.OS === 'android') {
    Linking.openURL(link);
    return link;
  }

  return link;
};
