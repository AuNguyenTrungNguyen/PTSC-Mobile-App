import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, Image, Text, TouchableOpacity, ActivityIndicator, Keyboard, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Helper from '../helper/Helper';
import LoginAPI from '../apis/LoginAPI';
import MessageAlert from './CustomViews/MessageAlert';

export default ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassord, setShowPassord] = useState(false);
  const [loading, setLoading] = useState(false);

  const nextInput = useRef(null);
  const _onSubmitEditingNextInput = () => {
    nextInput.current.focus();
  };

  const _onChangeUsername = text => {
    setUsername(text);
  };

  const _onChangePassword = text => {
    setPassword(text);
  };

  const _onPressClearUsername = () => {
    setUsername('');
  };

  const _onPressTogglePassword = () => {
    setShowPassord(!showPassord);
  };

  const _onPressLogin = () => {
    Keyboard.dismiss();
    setLoading(true);
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        MessageAlert('WARNING', 'Network not available!');
        setLoading(false);
      } else {
        if (username === '' || password === '') {
          MessageAlert('ERROR', 'The user name or password is invalid.');
          setLoading(false);
          return;
        }
        LoginAPI(username, password)
          .then(res => {
            if (res.error) {
              MessageAlert('ERROR', res.error_description);
              setLoading(false);
              return;
            }
            if (res.access_token) {
              Helper.storeData('TOKEN', res.access_token);
              Helper.storeData('USERNAME', res.userName);
              Helper.storeData('EXPIRES', res['.expires']);
              navigation.navigate('Home');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            }
          })
          .catch(error => {
            MessageAlert('ERROR', error.toString());
            setLoading(false);
          });
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode='stretch'
            source={require('../images/background.jpg')}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>PTSC M&C</Text>
        </View>
        <View style={styles.containerCenter} pointerEvents={loading ? 'none' : 'auto'}>
          <View style={styles.inputContainer}>
            <Icon name='user-circle' style={styles.inputIcon} />
            <TextInput
              style={styles.inputText}
              placeholder="Username ..."
              value={username}
              onChangeText={_onChangeUsername}
              blurOnSubmit={false}
              onSubmitEditing={_onSubmitEditingNextInput}
            />
            {username == ''
              ? null
              : <Icon name="times-circle" onPress={_onPressClearUsername} style={styles.inputIcon} />}
          </View>
          <View style={[styles.inputContainer, styles.inputContainerLast]}>
            <Icon name="unlock-alt" style={styles.inputIcon} />
            <TextInput
              blurOnSubmit={true}
              ref={nextInput}
              style={styles.inputText}
              placeholder="Password ..."
              value={password}
              secureTextEntry={!showPassord}
              onChangeText={_onChangePassword}
            />
            {password == ''
              ? null : (showPassord
                ? <Icon name="eye-slash" onPress={_onPressTogglePassword} style={styles.inputIcon} />
                : <Icon name="eye" onPress={_onPressTogglePassword} style={styles.inputIcon} />)}
          </View>
          {loading
            ? <TouchableOpacity style={styles.buttonContainer}>
              <ActivityIndicator size="large" color={OPP_COLOR} />
            </TouchableOpacity>
            : <TouchableOpacity style={styles.buttonContainer} onPress={_onPressLogin}>
              <Text style={styles.buttonTitle}>LOGIN</Text>
            </TouchableOpacity>}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  imageContainer: {
    height: Dimensions.get('window').height * 0.4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    height: Dimensions.get('window').height * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    color: BASE_COLOR,
    fontWeight: 'bold',
  },
  containerCenter: {
    height: Dimensions.get('window').height * 0.45,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: BASE_COLOR,
    borderWidth: 1,
    borderRadius: 32,
    height: 48,
    width: '100%',
  },
  inputText: {
    fontSize: 16,
    flex: 1,
    height: '100%',
    color: BASE_COLOR,
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 16,
    fontSize: 20,
    color: BASE_COLOR,
  },
  inputContainerLast: {
    marginTop: 16,
  },
  buttonContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BASE_COLOR,
    borderRadius: 32,
    marginTop: 48,
    width: '100%',
  },
  buttonTitle: {
    color: OPP_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
});