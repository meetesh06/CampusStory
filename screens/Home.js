import React from 'react';
import { ScrollView, Image, Platform, FlatList, AsyncStorage, View, Text } from 'react-native';
import { goInitializing } from './helpers/Navigation';
import Constants from '../constants';
import EventCard from '../components/EventCard';
import StoryIcon from '../components/StoryIcon';
import ImageGradient from 'react-native-image-gradient';
const SET_UP_STATUS = Constants.SET_UP_STATUS;
import FastImage from 'react-native-fast-image'
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        
    }

    state = {
        stories: [
            { image: "https://manavrachna.edu.in/wp-content/uploads/2017/07/WILD-CATS-new.jpg", read: false },
            { image: "https://manavrachna.edu.in/wp-content/uploads/2017/07/air-falcons-new.jpg", read: true },
            { image: "https://manavrachna.edu.in/wp-content/uploads/2017/07/WATER-SHARKS-new.jpg", read: false },
            { image: "https://manavrachna.edu.in/wp-content/uploads/2017/07/FOREST-RHINOS-new.jpg", read: false },
        ],
        eventsToday: [
            { creator: 'Wild Cats', location: 'Manav Rachna', title: 'Music Festival 2018', image: "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/934590/300/200/m1/fpnw/wm0/music-festival-poster-7-.jpg?1453743028&s=fd59fe8609d4ee63a8f04a8c96b40f25" },
            { creator: 'Water Sharks', location: 'Manav Rachna', title: 'Aritificial Intelligence', image: "https://www.burniegroup.com/wp-content/uploads/2018/03/960x0-1-300x200.jpg" },
            { creator: 'Slim Shady', location: 'Manav Rachna', title: 'TED Talk - Sanjay Bhandalkar', image: "http://www.personalbrandingblog.com/wp-content/uploads/2016/05/3256398629_019f3444aa-300x200.jpg" },
            { creator: 'Tupac Shakur', location: 'Manav Rachna', title: 'CSGO Lan Party', image: "https://hdwallpaperim.com/wp-content/uploads/2017/09/16/54422-Counter-Strike-Counter-Strike_Global_Offensive-300x200.jpg" },
        ],
        eventsChannels: [],
    }

    handleLogout = async () => {
        try {
            await AsyncStorage.removeItem(SET_UP_STATUS);
            goInitializing();
            console.log('go initializing');
        } catch(e) {
            console.log(e);
        }
    }

    handleEventClick = (item) => {
        console.log(item.image);
    }
    render() {
        return(
            <View style={{ flex: 1 }}>
                <View elevation={5} 
                    style = {{ 
                        backgroundColor : '#fff', 
                        minHeight : Platform.OS === 'android' ? 70 : 90, 
                        paddingTop : Platform.OS === 'android'? 8 : 30, 
                        shadowColor: "#000000",
                        shadowOpacity: 0.1,
                        shadowRadius: 0.5,
                        shadowOffset: {
                            height: 2,
                            width: 2
                        }
                }}>
                    <Image style={{ margin: 5, alignSelf: 'center', width: 50, height: 50 }} source={require('../media/app-bar/logo.png')}></Image>
                </View>
                <ScrollView style={{ paddingTop: 10 }}>
					<FlatList 
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						data={this.state.stories} 
						renderItem={({item}) => 
                            <StoryIcon pressed={this.handleEventClick} width={100} height={80} item={item} />
                        } 
					/>
                    {/* <LinearGradient style={{ flex: 1 }} colors={['#FF4A3F', '#FF6A15']}>
                        <EventCard pressed={this.handleEventClick} width={250} height={200} item={this.state.eventsToday[0]} />
                    </LinearGradient> */}
                    <ImageGradient
                        mainStyle={{ height: 250, flexDirection: 'column' }}
                        // gradientStyle={['#FF4A3F', '#FF6A15']}
                        localImage={false}
                        imageUrl={this.state.eventsToday[0].image}
                        startPosition ={{x:0,y:0}}
                        rgbcsvStart={'0,0,0'}
                        rgbcsvEnd={'10,10,10'}
                        opacityStart={0.9}
                        opacityEnd={0.5}
                    >
                        <Text style={{ marginTop: 10, fontFamily: 'Roboto', color: 'white', fontSize: 25 }}>
                            In the spotlight
                        </Text>
                        <View >
                            <FastImage
                                style={{ width: 150, height: 100, borderRadius: 10, margin: 10 }}
                                source={{ uri: "https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/934590/300/200/m1/fpnw/wm0/music-festival-poster-7-.jpg?1453743028&s=fd59fe8609d4ee63a8f04a8c96b40f25" }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            {/* <EventCard pressed={this.handleEventClick} width={150} height={100} item={{ image: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/934590/300/200/m1/fpnw/wm0/music-festival-poster-7-.jpg?1453743028&s=fd59fe8609d4ee63a8f04a8c96b40f25' }} /> */}
                        </View>
                        <View style={{ flex: 1, paddingTop: 5}}>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 20, color: '#fff' }}>
                                {this.state.eventsToday[0].title}
                            </Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Thin', fontSize: 20, color: '#fff' }}>
                                Manav Rachna
                            </Text>
                            <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Thin', fontSize: 15, color: '#fff' }}>
                                20-10-2018 9:30
                            </Text>
                        </View>
                    </ImageGradient>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
						All about today 
					</Text>
					<FlatList 
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						data={this.state.eventsToday} 
						renderItem={({item}) => 
                            <EventCard pressed={this.handleEventClick} width={200} height={150} item={item} />
                        } 
					/>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
						Some other things 
					</Text>
					<FlatList 
						horizontal={true}
						showsHorizontalScrollIndicator={false}
						data={this.state.eventsToday} 
						renderItem={({item}) => 
                            <EventCard pressed={this.handleEventClick} width={200} height={150} item={item} />
                        } 
					/>
                    
                </ScrollView>
                
            </View>
        );
    }

}

export default Home;