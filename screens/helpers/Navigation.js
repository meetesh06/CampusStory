import { Navigation } from 'react-native-navigation'

export const goToInterestsSelector = () => Navigation.setRoot({
    root: {
        stack: {
          id: 'Interests Selection Screen',
          children: [
            {
              component: {
                name: 'Interests Selection Screen',
              }
            }
        ],
        }
      }
});

export const goHome = () => Navigation.setRoot({
  root: {
    bottomTabs: {
      id: 'BottomTabsId',
      children: [
        {
          component: {
            name: 'Home Screen',
            options: {
              bottomTab: {
                fontSize: 12,
                text: 'Home',
                // icon: require('./signin.png')
              }
            }
          },
        },
        {
          component: {
            name: 'Discover Screen',
            options: {
              bottomTab: {
                text: 'Discover',
                fontSize: 12,
                // icon: require('./signup.png')
              }
            }
          },
        },
      ],
    }
  }
});