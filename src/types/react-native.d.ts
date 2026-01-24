declare module 'react-native' {
  export const ActionSheetIOS: {
    showActionSheetWithOptions(
      options: { options: string[]; cancelButtonIndex?: number },
      callback: (buttonIndex: number) => void,
    ): void;
  };

  export const Linking: {
    canOpenURL(url: string): Promise<boolean>;
    openURL(url: string): Promise<void>;
  };

  export const Platform: {
    OS: 'ios' | 'android' | 'windows' | 'macos' | 'web' | string;
  };
}
