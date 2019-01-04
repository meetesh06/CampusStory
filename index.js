/** @format */
import { Navigation } from "react-native-navigation";
import Initializing from "./screens/Initializing";
import Interests from "./screens/Interests";
import Home from './screens/Home';
import Discover from './screens/Discover';
import Profile from './screens/Profile';

Navigation.registerComponent(`Initializing Screen`, () => Initializing);
Navigation.registerComponent(`Interests Selection Screen`, () => Interests);
Navigation.registerComponent(`Home Screen`, () => Home);
Navigation.registerComponent(`Discover Screen`, () => Discover);
Navigation.registerComponent(`Profile Screen`, () => Profile);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: "Initializing Screen"
      }
    }
  });
});