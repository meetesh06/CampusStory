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
    stack: {
      id: 'Home Screen',
      children: [
        {
          component: {
            name: 'Home Screen',
          }
        }
    ],
    }
  }
})