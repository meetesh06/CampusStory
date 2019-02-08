import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';

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
                  text: 'Basic Details'
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
  const homeIcon = await Icon2.getImageSource('home', 30);
  const discoverIcon = await Icon3.getImageSource('heart-multiple', 30);
  const profileIcon = await Icon3.getImageSource('ticket', 30);
  return Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
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
                          color: '#FF6A15',
                          component: {
                            name: 'homeTopBar'
                          }
                        }
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
                  // visible: false,
                  // drawBehind: true

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
                        visible: true,
                        animate: true,
                        background: {
                          color: '#FF6A15',
                          component: {
                            name: 'homeTopBar'
                          }
                        }
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
                  text: 'Profile',
                  fontSize: 10,
                  selectedFontSize: 12,
                  icon: profileIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedTextColor: '#FF6A15',
                  selectedIconColor: '#FF6A15'
                },
                topBar: {
                  visible: false,
                  drawBehind: true
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
                          color: '#FF6A15',
                          component: {
                            name: 'homeTopBar'
                          }
                        }
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


// export const goHome = () => Navigation.setRoot({
//   root: {
//     bottomTabs: {
//       id: 'BottomTabsId',
//       children: [
//         {
//           stack: {
//             id: "Home Stack",
//             options: {
//               topBar: {
//                 visible: false,
//                 drawBehind: true
//               }
//             },
//             children: [
//               {
//                 component: {
//                   name: 'Home Screen',
//                   options: {
//                     bottomTab: {
//                       fontSize: 10,
//                       selectedFontSize: 12,
//                       text: 'Home',
//                       icon: require('../../media/navigation/home-not.png'),
//                       selectedIcon: require('../../media/navigation/home.png')
//                     }
//                   }
//                 }
//               }
//             ]
//           }
//         },
//         {
//           component: {
//             name: 'Discover Screen',
//             options: {
//               bottomTab: {
//                 text: 'Discover',
//                 fontSize: 10,
//                 selectedFontSize: 12,
//                 icon: require('../../media/navigation/home-not.png'),
//                 selectedIcon: require('../../media/navigation/home.png')
//               }
//             }
//           },
//         },
//         {
//           component: {
//             name: 'Profile Screen',
//             options: {
//               bottomTab: {
//                 text: 'Profile',
//                 fontSize: 10,
//                 selectedFontSize: 12,
//                 icon: require('../../media/navigation/home-not.png'),
//                 selectedIcon: require('../../media/navigation/home.png')
//               },
//               topBar: {
//                 visible: false
//               }
//             }
//           },
//         },
//       ],
//     }
//   }
// });
