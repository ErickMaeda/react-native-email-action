import React from 'react';
import {
  View,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {sendEmail} from 'react-native-email-action';

const App = () => {
  const openEmailOptions = () => {
    sendEmail({
      to: 'test@gmail.com',
      subject: 'Subject Test',
      body: 'Email Body',
      cc: ['cc@test.com', 'cc2@test.com'],
      bcc: ['bcc@test.com', 'bcc2@test.com'],
    })
      .then((link) => console.log('On open!', link))
      .catch((error) => console.log('Something went wrong!', error.message));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <TouchableOpacity
          style={styles.containerButton}
          onPress={openEmailOptions}>
          <Text style={styles.textButton}>SEND EMAIL</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  textButton: {
    color: '#fff',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default App;
