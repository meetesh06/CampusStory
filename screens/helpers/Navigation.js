import { Navigation } from 'react-native-navigation'
import Icon from 'react-native-vector-icons/AntDesign';
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
  const areaChartIcon = await Icon.getImageSource('linechart', 30);
  const profileIcon = await Icon.getImageSource('profile', 30);
  return Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabsId',
        children: [
          {
            stack: {
              id: "Home Stack",
              options: {
                topBar: {
                  visible: false,
                  drawBehind: true
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
                    name: 'Home Screen'
                  }
                }
              ]
            }
          },
          {
            component: {
              name: 'Discover Screen',
              options: {
                bottomTab: {
                  text: 'Discover',
                  fontSize: 10,
                  selectedFontSize: 12,
                  icon: homeIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedIconColor: '#555'
                },
                topBar: {
                  visible: false,
                  drawBehind: true
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
                  icon: homeIcon,
                  iconColor: '#c0c0c0',
                  textColor: '#c0c0c0',
                  selectedIconColor: '#555'
                },
                topBar: {
                  visible: false,
                  drawBehind: true
                }
              }
            },
          },
        ],
      }
    }
  });
}

    

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