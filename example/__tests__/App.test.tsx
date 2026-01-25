/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Alert, TouchableOpacity, StatusBar } from 'react-native';
import App from '../App';
import { sendEmail } from 'react-native-email-action';

// Mock the sendEmail function
jest.mock('react-native-email-action', () => ({
  sendEmail: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', async () => {
    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<App />);
    });
  });

  test('displays the correct title', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });

    const title = component!.root
      .findAllByType('Text')
      .find(el => el.props.children === 'React Native Email Action');
    expect(title).toBeDefined();
  });

  test('displays the correct subtitle', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });

    const subtitle = component!.root
      .findAllByType('Text')
      .find(
        el =>
          el.props.children ===
          'Opens installed email clients with prefilled recipients, subject, and body.',
      );
    expect(subtitle).toBeDefined();
  });

  test('has a "Send Test Email" button', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });

    const button = component!.root
      .findAllByType('Text')
      .find(el => el.props.children === 'Send Test Email');
    expect(button).toBeDefined();
  });

  test('calls sendEmail when button is pressed', async () => {
    const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
    mockSendEmail.mockResolvedValue('mailto:test@gmail.com');

    let component: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });

    const button = component!.root.findByType(TouchableOpacity);

    await ReactTestRenderer.act(async () => {
      await button.props.onPress();
    });

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith({
      to: 'test@gmail.com',
      cc: ['cc@test.com', 'cc2@test.com'],
      bcc: ['bcc@test.com', 'bcc2@test.com'],
      subject: 'Subject Test',
      body: '1st line.\n2nd line.\n3rd line.\n4th line.',
    });
  });

  test('logs success message when email client opens successfully', async () => {
    const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
    const consoleLogSpy = jest.spyOn(console, 'log');
    mockSendEmail.mockResolvedValue('mailto:test@gmail.com');

    let component: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });

    const button = component!.root.findByType(TouchableOpacity);

    await ReactTestRenderer.act(async () => {
      await button.props.onPress();
    });

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Email client opened',
      'mailto:test@gmail.com',
    );

    consoleLogSpy.mockRestore();
  });

  test('shows alert when sendEmail fails', async () => {
    const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const error = new Error('No email client available');
    mockSendEmail.mockRejectedValue(error);

    let component: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });

    const button = component!.root.findByType(TouchableOpacity);

    await ReactTestRenderer.act(async () => {
      await button.props.onPress();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to open email client',
      error,
    );
    expect(Alert.alert).toHaveBeenCalledWith(
      'Email unavailable',
      'Could not open an email client on this device.',
    );

    consoleErrorSpy.mockRestore();
  });

  test('renders StatusBar with correct props', async () => {
    let component: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(<App />);
    });

    const statusBar = component!.root.findByType(StatusBar);
    expect(statusBar.props.barStyle).toBe('light-content');
  });
});
