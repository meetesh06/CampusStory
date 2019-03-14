import { Navigation } from 'react-native-navigation';
import Icon1 from 'react-native-vector-icons/Foundation';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { Platform } from 'react-native';

export const goToInterestsSelector = () => Navigation.setRoot({
  root: {
    stack: {
      id: 'Interests Selection Screen',
      children: [
        {
          component: {
            name: 'Interests Selection Screen',
            options: {
              topBar: {
                title: {
                  text: 'Your Basic Details',
                  color: '#c0c0c0'
                },
                background: {
                  color: '#222',
                }
              }
            }
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

const androidRight = [
  {
    id : 'help',
    component : {
      name : 'app.HelpIcon'
    }
  },
  {
    id: 'Settings',
    component: {
      name: 'app.SettingsIcon'
    }
  }
];

const iosRight = [
  {
    id: 'Settings',
    component: {
      name: 'app.SettingsIcon'
    }
  },
  
];

const androidLeft = [];
const iosLeft = [
  {
    id : 'help',
    component : {
      name : 'app.HelpIcon'
    }
  }
];

export const goHome = async (first) => {
  const homeIcon = await Icon1.getImageSource('home', 22);
  const discoverIcon = await Icon2.getImageSource('free-breakfast', 22);
  const profileIcon = await Icon2.getImageSource('notifications-active', 22);
  return Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        options: {
          bottomTabs: {
            backgroundColor: '#222'
          },
          topBar: {
            visible: false,
            drawBehind: true,
            background: {
              color: '#222'
            }
          }
        },
        children: [
          {
            stack: {
              id: 'HomeStack',
              options: {
                bottomTab: {
                  fontSize: 10,
                  selectedFontSize: 12,
                  text: 'Home',
                  icon: homeIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedTextColor: '#FF6A15',
                  selectedIconColor: '#FF6A15'
                },
                topBar: {
                  visible: true,
                  // drawBehind: false,
                  drawBehind: Platform.OS === 'ios' ? true : false,
                  hideOnScroll: true,
                  background: {
                    color: '#222'
                  }
                }
              },
              children: [
                {
                  component: {
                    id: 'home',
                    name: 'Home Screen',
                    passProps: {
                      first
                    },
                    options: {
                      topBar: {
                        visible: true,
                        animate: true,
                        hideOnScroll: Platform.OS === 'ios' ? true : false,
                        // hideOnScroll: true,
                        title: {
                          component: Platform.OS === 'android' ? undefined : {
                            name: 'homeTopBar',
                            alignment: 'fill'
                          }
                        },
                        background: {
                          color: '#222',
                          component: Platform.OS === 'ios' ? undefined : {
                            name: 'homeTopBar',
                            alignment: 'fill'
                          }
                        },
                        rightButtons: [
                          {
                            id: 'InterestedEvents',
                            component: {
                              name: 'app.HeartIcon'
                            }
                          }],
                        leftButtons: Platform.OS === 'android' ? undefined : [
                          {
                            id: 'InterestedEvents',
                            component: {
                              name: 'app.LeftDummy'
                            }
                          }],
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            stack: {
              id: 'DiscoverStack',
              options: {
                topBar: {
                  visible: false,
                  drawBehind: true
                },
                bottomTab: {
                  fontSize: 10,
                  selectedFontSize: 12,
                  text: 'Discover',
                  icon: discoverIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedTextColor: '#FF6A15',
                  selectedIconColor: '#FF6A15'
                }
              },
              children: [
                {
                  component: {
                    id: 'discover',
                    name: 'Discover Screen',
                    passProps: {
                      first
                    },
                    options: {
                      topBar: {
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            stack: {
              id: 'ProfileStack',
              options: {
                bottomTab: {
                  text: 'Updates',
                  fontSize: 10,
                  selectedFontSize: 12,
                  icon: profileIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedTextColor: '#FF6A15',
                  selectedIconColor: '#FF6A15'
                },
                topBar: {
                }
              },
              children: [
                {
                  component: {
                    id: 'profile',
                    name: 'Profile Screen',
                    passProps: {
                      first
                    },
                    options: {
                      topBar: {
                        visible: true,
                        animate: true,
                        background: {
                          color: '#222'
                        },
                        title: {
                          text: 'Updates For You',
                          color: '#fff'
                        },
                        rightButtons: Platform.OS === 'android' ? androidRight : iosRight,
                        leftButtons: Platform.OS === 'android' ? androidLeft : iosLeft,
                      }
                    }
                  }
                }
              ]
            }
          }
        ],
      }
    }
  });
};
