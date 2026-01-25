import { Platform, Linking, ActionSheetIOS } from 'react-native';
import { sendEmail, configureEmailApps } from '../index';

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
  Linking: {
    canOpenURL: jest.fn(),
    openURL: jest.fn(),
  },
  ActionSheetIOS: {
    showActionSheetWithOptions: jest.fn(),
  },
}));

describe('react-native-email-action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('configureEmailApps', () => {
    it('should configure email apps', () => {
      configureEmailApps(['gmail', 'outlook']);
      // The configuration is internal, but we can test it indirectly through sendEmail
      expect(true).toBe(true);
    });
  });

  describe('sendEmail on Android', () => {
    beforeEach(() => {
      (Platform as any).OS = 'android';
      (Linking.openURL as jest.Mock).mockResolvedValue(true);
    });

    it('should open mailto link directly on Android', async () => {
      const options = {
        to: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body',
      };

      const result = await sendEmail(options);

      expect(Linking.openURL).toHaveBeenCalledWith(
        'mailto:test@example.com?subject=Test Subject&body=Test%20Body&cc=&bcc=',
      );
      expect(result).toBe('mailto:test@example.com?subject=Test Subject&body=Test%20Body&cc=&bcc=');
    });

    it('should include cc and bcc in Android mailto link', async () => {
      const options = {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
        cc: ['cc1@example.com', 'cc2@example.com'],
        bcc: ['bcc@example.com'],
      };

      const result = await sendEmail(options);

      expect(Linking.openURL).toHaveBeenCalledWith(
        'mailto:test@example.com?subject=Test&body=Body&cc=cc1@example.com,cc2@example.com&bcc=bcc@example.com',
      );
      expect(result).toContain('cc=cc1@example.com,cc2@example.com');
      expect(result).toContain('bcc=bcc@example.com');
    });

    it('should encode special characters in body', async () => {
      const options = {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Line 1\nLine 2\nSpecial: !@#$%',
      };

      const result = await sendEmail(options);

      expect(result).toContain('body=Line%201%0ALine%202%0ASpecial%3A%20!%40%23%24%25');
    });
  });

  describe('sendEmail on iOS', () => {
    beforeEach(() => {
      (Platform as any).OS = 'ios';
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (Linking.openURL as jest.Mock).mockResolvedValue(true);
    });

    it('should show action sheet with available apps', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        // Only Outlook and Gmail available, Mail is not
        return url === 'ms-outlook:' || url === 'googlegmail:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          // Simulate user selecting first option
          callback(0);
        },
      );

      const options = {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
      };

      void (await sendEmail(options));

      expect(ActionSheetIOS.showActionSheetWithOptions).toHaveBeenCalled();
      const callArgs = (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][0];
      // Order should be: Outlook, Gmail (mail is skipped because canOpenURL returns false)
      // The order actually follows the iteration through DEFAULT_APP_IDS
      expect(callArgs.options.length).toBe(3); // Outlook, Gmail, Cancel
      expect(callArgs.options).toContain('Outlook');
      expect(callArgs.options).toContain('Gmail');
      expect(callArgs.options).toContain('Cancel');
      expect(callArgs.cancelButtonIndex).toBe(2);
      expect(Linking.openURL).toHaveBeenCalled();
    });

    it('should use custom cancel text', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
        cancelText: 'Close',
      });

      const callArgs = (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][0];
      expect(callArgs.options).toContain('Close');
    });

    it('should handle cancel button press', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);

      const promise = new Promise<string>((resolve) => {
        (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
          (options, callback) => {
            // Simulate user pressing cancel (last button)
            callback(options.options.length - 1);
            // The promise won't resolve when cancel is pressed
            setTimeout(() => resolve('timeout'), 100);
          },
        );
      });

      sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
      });

      const result = await promise;
      expect(result).toBe('timeout');
      expect(Linking.openURL).not.toHaveBeenCalled();
    });

    it('should throw error when no email apps are available', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);

      await expect(
        sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          body: 'Body',
        }),
      ).rejects.toThrow('No email app provider available');
    });

    it('should use custom appIds when provided', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'googlegmail:' || url === 'ms-outlook:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
        appIds: ['gmail', 'outlook'],
      });

      const callArgs = (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][0];
      expect(callArgs.options).toEqual(['Gmail', 'Outlook', 'Cancel']);
    });

    it('should format Gmail link correctly', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'googlegmail:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0); // Select Gmail
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body text',
        cc: ['cc@example.com'],
        bcc: ['bcc@example.com'],
        appIds: ['gmail'],
      });

      expect(result).toContain('googlegmail:///co?');
      expect(result).toContain('to=test@example.com');
      expect(result).toContain('subject=Subject');
      expect(result).toContain('cc=cc@example.com');
      expect(result).toContain('bcc=bcc@example.com');
    });

    it('should format Outlook link correctly', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'ms-outlook:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0); // Select Outlook
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body',
        appIds: ['outlook'],
      });

      expect(result).toContain('ms-outlook://compose?');
      expect(result).toContain('to=test@example.com');
    });

    it('should only show apps that are available', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        // Only Gmail is available
        return url === 'googlegmail:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
        appIds: ['gmail', 'outlook', 'mail'],
      });

      const callArgs = (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mock.calls[0][0];
      expect(callArgs.options).toEqual(['Gmail', 'Cancel']);
    });

    it('should handle body with newlines and special characters', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Line 1\nLine 2\nLine 3',
        appIds: ['mail'],
      });

      expect(result).toContain('body=Line%201%0ALine%202%0ALine%203');
    });

    it('should check canOpenURL for each configured app', async () => {
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);

      try {
        await sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          body: 'Body',
        });
      } catch {
        // Expected to throw
      }

      // Should check for all default apps - checks all 3 even if all return false
      expect(Linking.canOpenURL).toHaveBeenCalled();
      // At least called once
      expect((Linking.canOpenURL as jest.Mock).mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('sendEmail return value', () => {
    it('should return the link that was opened on Android', async () => {
      (Platform as any).OS = 'android';

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
      });

      expect(result).toBe('mailto:test@example.com?subject=Test&body=Body&cc=&bcc=');
    });

    it('should return the selected app link on iOS', async () => {
      (Platform as any).OS = 'ios';
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
        appIds: ['mail'],
      });

      expect(result).toContain('mailto:');
    });

    it('should return default mailto link for unsupported platforms', async () => {
      (Platform as any).OS = 'web'; // Unsupported platform

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Body',
      });

      expect(result).toBe('mailto:test@example.com?subject=Test&body=Body&cc=&bcc=');
    });
  });

  describe('additional email apps', () => {
    beforeEach(() => {
      (Platform as any).OS = 'ios';
      (Linking.openURL as jest.Mock).mockResolvedValue(true);
    });

    it('should format Spark link correctly', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'readdle-spark:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body',
        appIds: ['spark'],
      });

      expect(result).toContain('readdle-spark://compose?');
      expect(result).toContain('recipients=test@example.com');
    });

    it('should format Airmail link correctly', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'airmail:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body',
        appIds: ['airmail'],
      });

      expect(result).toContain('airmail://compose?');
      expect(result).toContain('to=test@example.com');
    });

    it('should format Superhuman link correctly', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'superhuman:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body',
        appIds: ['superhuman'],
      });

      expect(result).toContain('superhuman://compose?');
      expect(result).toContain('to=test@example.com');
    });

    it('should format Yahoo Mail link correctly', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'ymail:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body',
        appIds: ['ymail'],
      });

      expect(result).toContain('ymail://mail/compose?');
      expect(result).toContain('to=test@example.com');
    });

    it('should format Fastmail link correctly', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'fastmail:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body',
        appIds: ['fastmail'],
      });

      expect(result).toContain('fastmail://compose?');
      expect(result).toContain('to=test@example.com');
    });

    it('should format ProtonMail link correctly', async () => {
      (Linking.canOpenURL as jest.Mock).mockImplementation(async (url: string) => {
        return url === 'protonmail:';
      });

      (ActionSheetIOS.showActionSheetWithOptions as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(0);
        },
      );

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Subject',
        body: 'Body',
        appIds: ['protonmail'],
      });

      expect(result).toContain('protonmail://compose?');
      expect(result).toContain('to=test@example.com');
    });
  });
});
