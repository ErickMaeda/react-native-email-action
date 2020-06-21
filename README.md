# React Native Email Action
[![npm version](https://badge.fury.io/js/react-native-email-action.svg)](https://badge.fury.io/js/react-native-email-action)
[![Downloads](http://img.shields.io/npm/dy/react-native-email-action.svg?style=flat-square)](https://img.shields.io/npm/dy/react-native-email-action)

A simple and customized way to open email linking (Best option for iOS that will ask you what email app you can use, if installed)

## Demo (iOS)
![Alt Text](https://raw.githubusercontent.com/ErickMaeda/react-native-email-action/master/example/ezgif.com-gif-maker.gif)

## Installation
```console
npm install --save react-native-email-action
```
or
```console
yarn add react-native-email-action
```
### iOS Only 
After iOS 9+, you need to add this information keys on Info.plist
```xml
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>message</string>
  <string>ms-outlook</string>
  <string>googlegmail</string>
</array>	
```
## Usage
```javascript
import { sendEmail } from 'react-native-email-action';

const options = {
  to: "erick.maeda26@gmail.com", 
  subject: "Very important!", 
  body: "Verify your email fast!",
};
sendMail(options);
```

## Available Options to sendMail

|  	|description  	|type  	|required  		
|-	|-	|-	|-
|to  	|Email to destination  	|string  	|Y  	
|subject  	|Email Subject   	|string  	|Y 	
|body  	|Email Content  	|string  	|Y  	
|cc  	|Email CC  	|array  	|N  	
|bcc  	|Email BCC  	|array  	|N  


## Available email app
### iOS (If installed)
- Gmail 
- Outlook 
- Mail
### Android
- All the apps installed.

## Roadmap
- Add other app emails for iOS
- Add attachment option

