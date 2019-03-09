import * as React from 'react';
import { View, Dimensions, SafeAreaView } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import DiscoverFeed from './DiscoverFeed';
import CategoryCard from '../components/CategoryCard';
import { categoriesNew } from './helpers/values';

export default class Discover extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'food', title: 'Food' },
      { key: 'mad', title: 'Music and Dance' },
      { key: 'fun', title: 'Fun' },
      { key: 'aat', title: 'Art and Theatre' },
      { key: 'tech', title: 'Technology' },
      { key: 'sports', title: 'Sports' },
      { key: 'business', title: 'Business' },
      { key: 'society', title: 'Society' },
      { key: 'fashion', title: 'Fashion' }
    ],
  };

  renderScene = ({ route }) => {
    const {
      index,
      routes
    } = this.state;
    if (Math.abs(index - routes.indexOf(route)) === 0) { /* LOADING ONLY THE VISIBLE TAB */
      return <DiscoverFeed category={route.key} />;
    }
    return <View />;
  };

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: '#222',
          flex : 1,
        }}
      >
      <TabView
        animationEnabled={false}
        lazy
        swipeEnabled
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: '#FF6A15' }}
            labelStyle={{ color: '#fff' }}
            style={{
              backgroundColor: '#222'
            }}
            tabStyle={{
              width: 100
            }}
            renderLabel={val => (
              <CategoryCard
                width={80}
                height={50}
                name={val.route.title}
                image={categoriesNew[val.route.key]}
              />
            )}
          />
        )}
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      />
      </SafeAreaView>
    );
  }
}
