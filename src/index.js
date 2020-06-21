import { ActionSheetIOS, Linking, Platform } from "react-native";

export const sendEmail = ({
  to,
  subject,
  body,
  cancelText = "Cancel",
  cc = [],
  bcc = [],
}) =>
  new Promise(async (resolve, reject) => {
    body = encodeURIComponent(body);
    let link = `mailto:${to}?subject=${subject}&body=${body}&cc=${cc.join(
      ","
    )}&bcc=${bcc.join(",")}`;

    if (Platform.OS === `ios`) {
      const canOpenGmail = await Linking.canOpenURL("googlegmail:");
      const canOpenOutlook = await Linking.canOpenURL("ms-outlook:");
      const canOpenMessage = await Linking.canOpenURL("message:");
      const options = [];

      if (canOpenGmail) {
        options.push("Gmail");
      }
      if (canOpenOutlook) {
        options.push("Outlook");
      }
      if (canOpenMessage) {
        options.push("Mail");
      }
      if (options.length == 0) {
        reject(new Error("No email app provider available"));
      } else {
        options.push(cancelText);
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex: options.length - 1,
          },
          (buttonIndex) => {
            if (buttonIndex != options.length - 1) {
              if (options[buttonIndex] == "Gmail") {
                link = `googlegmail:///co?subject=${subject}&body=${body}&to=${to}&cc=${cc.join(
                  ","
                )}&bcc=${bcc.join(",")}`;
              } else if (options[buttonIndex] == "Outlook") {
                link = `ms-outlook://compose?to=${to}&subject=${subject}&body=${body}&cc=${cc.join(
                  ","
                )}&bcc=${bcc.join(",")}`;
              }
              Linking.openURL(link);
              resolve(link);
            }
          }
        );
      }
    } else if (Platform.OS === `android`) {
      Linking.openURL(link);
      resolve(link);
    }
  });
