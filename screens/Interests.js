import React from 'react';
import { View, Text, BackHandler, StyleSheet, FlatList, ScrollView, TouchableOpacity, Platform} from 'react-native';
import AdvertCard from '../components/AdvertCard';
// import Icon from 'react-native-vector-icons/AntDesign';

class Interests extends React.Component {
    constructor(props) {
        super(props);
    }
    static options(passProps) {
        return {
          topBar: {
            title: {
              text: 'Select your Interests'
            },
            // drawBehind: true,
            visible: true,
          }
        };
      }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      }
    
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      }
    
      handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
      }
    
    render() {
        return(
            <View style={{ flex: 1 }}>
                {/* <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 25, marginTop: Platform.OS === 'ios' ? 70 : 10, marginBottom: 10 }}> Select your Interests </Text> */}
                <ScrollView style={{ flex: 1, backgroundColor: '#fff', borderRadius: 10, marginBottom: 5 }}>
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                        Official Channels 
                    </Text>
                    {/* <TouchableOpacity style={{ marginLeft: 5, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                                Official Channels 
                            </Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                            <Icon name="right" style={{ fontSize: 20, marginRight: 10, color: '#FF4A3F' }} />
                        </View>
                    </TouchableOpacity> */}
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[ {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'} ]} 
                        renderItem={({item}) => <AdvertCard onChecked={() => console.log(item.title + ' clicked')} image="https://pmcwwd.files.wordpress.com/2018/07/rag-bone-x-eminem-2.jpg?crop=0px%2C451px%2C4000px%2C2671px&resize=640%2C415" title={item.title} /> } 
                    />
                    
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                        Recommended  
                    </Text>
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[ {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'} ]} 
                        renderItem={({item}) => <AdvertCard title={item.title} /> } 
                    />
                    
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                        Art and Craft 
                    </Text>
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[ {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'} ]} 
                        renderItem={({item}) => <AdvertCard title={item.title} /> } 
                    />
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                        Art and Craft 
                    </Text>
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[ {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'} ]} 
                        renderItem={({item}) => <AdvertCard title={item.title} /> } 
                    />
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                        Art and Craft 
                    </Text>
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[ {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'} ]} 
                        renderItem={({item}) => <AdvertCard title={item.title} /> } 
                    />
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                        Art and Craft 
                    </Text>
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[ {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'} ]} 
                        renderItem={({item}) => <AdvertCard title={item.title} /> } 
                    />
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                        Art and Craft 
                    </Text>
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[ {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'} ]} 
                        renderItem={({item}) => <AdvertCard title={item.title} /> } 
                    />
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 5 }}> 
                        Art and Craft 
                    </Text>
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={[ {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'}, {title: 'item 1', key: 'item 1'} ]} 
                        renderItem={({item}) => <AdvertCard title={item.title} /> } 
                    />
                </ScrollView>
                <View style={{ height: Platform.OS === 'ios' ? 70 : 50, paddingTop: 10 }}>
                    <TouchableOpacity style={{ alignSelf: 'center' }}>
                        <Text style={{ color: 'red', fontSize: 20, fontFamily: 'Roboto-Light' }}> continue </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginTop: 10,
        fontSize: 16,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f9f5ed',
        color: '#666666',
    },
});

export default Interests;