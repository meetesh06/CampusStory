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

export const goInitializing = () => Navigation.setRoot({
    root: {
        stack: {
          id: 'Initializing Screen',
          children: [
            {
              component: {
                name: 'Initializing Screen',
                options: {
                  topBar: {
                    visible: false,
                    drawBehind: true,
                  }
                }
              }
            },
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
          stack: {
            id: "Home Stack",
            options: {
              topBar: {
                visible: false
              }
            },
            children: [
              {
                component: {
                  name: 'Home Screen',
                  options: {
                    bottomTab: {
                      fontSize: 10,
                      selectedFontSize: 12,
                      text: 'Home',
                      icon: require('../../media/navigation/home-not.png'),
                      selectedIcon: require('../../media/navigation/home.png')
                    }
                  }
                }
              }
            ]
          }
        },
        // {
        //   component: {
        //     name: 'Home Screen',
        //     options: {
        //       bottomTab: {
        //         fontSize: 10,
        //         selectedFontSize: 12,
        //         text: 'Home',
        //         icon: require('../../media/navigation/home-not.png'),
        //         selectedIcon: require('../../media/navigation/home.png')
        //       }
              
        //     }
        //   },
        // },
        {
          component: {
            name: 'Discover Screen',
            options: {
              bottomTab: {
                text: 'Discover',
                fontSize: 10,
                selectedFontSize: 12,
                icon: require('../../media/navigation/home-not.png'),
                selectedIcon: require('../../media/navigation/home.png')
              }
            }
          },
        },
        {
          component: {
            name: 'Profile Screen',
            options: {
              bottomTab: {
                text: 'Profile',
                fontSize: 10,
                selectedFontSize: 12,
                icon: require('../../media/navigation/home-not.png'),
                selectedIcon: require('../../media/navigation/home.png')
              },
              topBar: {
                visible: false
              }
            }
          },
        },
      ],
    }
  }
});