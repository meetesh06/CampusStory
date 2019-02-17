import { Navigation } from 'react-native-navigation';
import Icon1 from 'react-native-vector-icons/Foundation';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import Icon3 from 'react-native-vector-icons/MaterialIcons';

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
                  text: 'Basic Details',
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

export const goHome = async (first) => {
  const homeIcon = await Icon1.getImageSource('home', 25);
  const discoverIcon = await Icon2.getImageSource('free-breakfast', 25);
  const profileIcon = await Icon2.getImageSource('notifications', 25);
  return Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        options: {
          bottomTabs: {
            backgroundColor: '#222'
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
                background: {
                  color: '#333'
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
                        // hideOnScroll: true,
                        visible: true,
                        animate: true,
                        background: {
                          color: '#222',
                          component: {
                            name: 'homeTopBar'
                          }
                        },
                        rightButtons: [
                          {
                            id: 'InterestedEvents',
                            component: {
                              name: 'app.HeartIcon'
                            }
                          }]
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
                        // hideOnScroll: true,
                        // visible: true,
                        // animate: true,
                        // background: {
                        //   color: '#222',
                        //   component: {
                        //     name: 'homeTopBar'
                        //   }
                        // }
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
                  // visible: true,
                  // drawBehind: true
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
                        // hideOnScroll: true,
                        visible: true,
                        animate: true,
                        background: {
                          color: '#222'
                        },
                        title: {
                          text: 'Updates',
                          color: '#fff'
                        },
                        rightButtons: [
                          {
                            id: 'Settings',
                            component: {
                              name: 'app.SettingsIcon'
                            }
                          }]
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
