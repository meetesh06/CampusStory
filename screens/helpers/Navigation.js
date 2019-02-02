import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/SimpleLineIcons';

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

export const goHome = async () => {
  const homeIcon = await Icon.getImageSource('home', 30);
  const discoverIcon = await Icon1.getImageSource('heart', 30);
  const profileIcon = await Icon.getImageSource('user', 30);
  return Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        children: [
          {
            stack: {
              id: 'Home Stack',
              options: {
                topBar: {
                  visible: false,
                  animate: true,
                  hideOnScroll: true,
                  // buttonColor: 'black',
                  drawBehind: true,
                  
                  // subtitle: {
                  //   text: 'Title',
                  //   fontSize: 14,
                  //   color: 'red',
                  //   fontFamily: 'Helvetica',
                  //   alignment: 'center'
                  // },
                  // backButton: {
                  //   // icon: require('icon.png'),
                  //   visible: true
                  // },                  
                  // background: {
                  //   color: '#00ff00',
                  //   translucent: true,
                  //   component: {
                  //     name: 'homeTopBar'
                  //   }
                  // }
                },
                bottomTab: {
                  fontSize: 10,
                  selectedFontSize: 12,
                  text: 'Home',
                  icon: homeIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedIconColor: '#555'
                }
              },
              children: [
                {
                  component: {
                    name: 'Home Screen',
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
              id: 'Discover Stack',
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
                  selectedIconColor: '#555'
                }
              },
              children: [
                {
                  component: {
                    name: 'Discover Screen',
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
              id: 'Profile Stack',
              options: {
                bottomTab: {
                  text: 'Profile',
                  fontSize: 10,
                  selectedFontSize: 12,
                  icon: profileIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedIconColor: '#555'
                },
                topBar: {
                  visible: false,
                  drawBehind: true
                }
              },
              children: [
                {
                  component: {
                    name: 'Profile Screen'
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
