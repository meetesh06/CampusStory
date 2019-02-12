import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import CategoryView from './CategoryView';
import CategoryCard from '../components/CategoryCard';
import { categoriesNew } from './helpers/values';

export default class Discover extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'cs', title: 'Campus Story' },
      { key: 'food', title: 'Food' },
      { key: 'art', title: 'Art and Theatre' },
      { key: 'mad', title: 'Music and Dance' },
      { key: 'society', title: 'Society' },
      { key: 'sports', title: 'Sports' },
      { key: 'fun', title: 'Fun' },
    ],
  };

  renderScene = ({ route }) => {
    const {
      index,
      routes
    } = this.state;
    if (Math.abs(index - routes.indexOf(route)) > 2) {
      return <View />;
    }
    if (route.key === 'cs') return <CategoryView category={route.key} />;
    return <CategoryView category={route.key} />;
  };

  render() {
    return (
      <TabView
        style={{
          backgroundColor: '#222'
        }}
        animationEnabled={false}
        lazy
        swipeEnabled
        renderTabBar={props => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: '#FF6A15' }}
            // pressOpacity={0.6}
            // initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
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
                // selected={this.state.routes[this.state.index].key === val.route.key}
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
    );
  }
}
