import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './src/Route';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs();

AppRegistry.registerComponent(appName, () => App);