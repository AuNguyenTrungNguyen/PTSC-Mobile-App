import { Alert } from 'react-native';
const MessageAlert = (title, message) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: 'Cancel',
            },
        ],
        { cancelable: false },
    );
};

module.exports = MessageAlert;