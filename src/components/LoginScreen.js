import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, TextInput, Image, Text, TouchableOpacity, ActivityIndicator, Keyboard, Dimensions } from 'react-native';
import { Container, Content } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import LoginAPI from '../apis/Login';
import MessageAlert from './CustomViews/MessageAlert';

const BASE_COLOR = '#344955';
const OPP_COLOR = 'white';

const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        MessageAlert('CATCH', error.toString());
    }
}

export default ({ navigation }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassord, setShowPassord] = useState(false);
    const [loading, setLoading] = useState(false);

    const _onChangeUsername = text => {
        setUsername(text);
    };

    const _onChangePassword = text => {
        setPassword(text);
    };

    const _pressClearUsername = () => {
        setUsername('');
    }

    const _pressTogglePassword = () => {
        setShowPassord(!showPassord);
    }

    const _login = () => {
        Keyboard.dismiss();
        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                MessageAlert('WARNING', 'The internet not connect.');
            } else {
                if (username === '' || password === '') {
                    MessageAlert('ERROR', 'The user name or password is invalid.');
                    return;
                }
                setLoading(true);
                LoginAPI(username, password)
                    .then(res => {
                        setLoading(false);
                        if (res == null) {
                            return;
                        }
                        if (res.error_description) {
                            MessageAlert('ERROR', res.error_description);
                            return;
                        }
                        storeData('USERNAME', res.userName);
                        navigation.navigate('Home');
                    })
                    .catch(error => {
                        setLoading(false);
                        MessageAlert('CATCH', error.toString());
                    });
            }
        });
    };

    return (
        <Container>
            <Content>
                <SafeAreaView style={styles.safeArea}>
                    <Image
                        resizeMode='contain'
                        style={styles.image}
                        source={require('../images/background.jpg')}
                    />
                    <Text style={styles.title}>PTCS CLOUD</Text>
                    <View style={styles.containerCenter} pointerEvents={loading ? 'none' : 'auto'}>
                        <View style={styles.inputContainer}>
                            <Icon name='user-circle' style={styles.inputIcon} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="Username ..."
                                value={username}
                                onChangeText={_onChangeUsername}
                            />
                            {username == ''
                                ? null
                                : <Icon name="times-circle" onPress={_pressClearUsername} style={styles.inputIcon} />}
                        </View>
                        <View style={[styles.inputContainer, styles.inputContainerLast]}>
                            <Icon name="unlock-alt" style={styles.inputIcon} />
                            <TextInput
                                style={styles.inputText}
                                placeholder="Password ..."
                                value={password}
                                secureTextEntry={!showPassord}
                                onChangeText={_onChangePassword}
                            />
                            {password == ''
                                ? null : (showPassord
                                    ? <Icon name="eye-slash" onPress={_pressTogglePassword} style={styles.inputIcon} />
                                    : <Icon name="eye" onPress={_pressTogglePassword} style={styles.inputIcon} />)}
                        </View>
                        {loading
                            ? <TouchableOpacity style={[styles.buttonContainer]}>
                                <ActivityIndicator size="large" color={OPP_COLOR} />
                            </TouchableOpacity>
                            : <TouchableOpacity style={styles.buttonContainer} onPress={_login}>
                                <Text style={styles.buttonTitle}>LOGIN</Text>
                            </TouchableOpacity>}
                        <Text style={styles.forgotPassword}>Forgot password</Text>
                    </View>
                </SafeAreaView>
            </Content>
        </Container>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width * 8640 / 12960,
    },
    title: {
        fontSize: 42,
        color: BASE_COLOR,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 16,
        textAlign: 'center',
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    containerCenter: {
        flex: 1,
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
    buttonDisable: {
        opacity: 0.5,
    },
    buttonTitle: {
        color: OPP_COLOR,
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotPassword: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 32,
        color: BASE_COLOR,
    },
});