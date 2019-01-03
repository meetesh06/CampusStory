import React from 'react';
import { Image, Picker, View, Text, RefreshControl, StyleSheet, FlatList, ScrollView, TouchableOpacity, Platform} from 'react-native';
import AdvertCard from '../components/AdvertCard';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
// import Icon from 'react-native-vector-icons/AntDesign';
class Interests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            college: "MRDC",
            categories: []
        }
    }
    componentDidMount() {
        this._onRefresh();
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
    
    _onRefresh = () => {
        this.setState({refreshing: true});
        formData = new FormData();
        formData.append("dummy", "");
        axios.post("https://www.mycampusdock.com/users/get-category-list", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            //   'x-access-token': this.props.auth.user_token
            }
          })
          .then( (result) => {
            result = result.data;
            console.log(result);
            if(!result.error) {
                this.setState({ categories: result.mssg });
            }
          })
          .catch( (err) => console.log(err) )
          .finally( () => {
            // if(this.mounted)
                this.setState({ refreshing: false });
          } )
    }

    render() {
        return(
            <View style={{ flex: 1 }}>
                {/* <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 25, marginTop: Platform.OS === 'ios' ? 70 : 10, marginBottom: 10 }}> Select your Interests </Text> */}
                <ScrollView 
                    style={{ flex: 1, backgroundColor: '#fff', borderRadius: 10, marginBottom: 5 }}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                    }
                >

                    <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10 }}> 
                        Select your interests 
                    </Text>
                    <FlatList 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.categories} 
                        renderItem={({item}) => <AdvertCard width={200} height={150} onChecked={() => console.log(item.value + ' clicked')} image={"https://www.mycampusdock.com/"+item.media} /> } 
                    />

                    <Text style={{ textAlign: 'center', fontFamily: 'Roboto-Light', fontSize: 25, marginLeft: 10, marginTop: 50 }}> 
                        Select your college
                    </Text>
                    <Picker
                        selectedValue={this.state.college}
                        style={{ flex: 1}}
                        onValueChange={(itemValue, itemIndex) => this.setState({ college: itemValue })}>
                        <Picker.Item label="MRIIRS" value="MRIIRS" />
                        <Picker.Item label="MRDC" value="MRDC" />
                        <Picker.Item label="MRU" value="MRU" />
                    </Picker>
                    
                    <LinearGradient style={{ flex: 1, height: 320, margin: 5, borderRadius: 10}} colors={['#FF4A3F', '#FF6A15']}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontSize: 15, padding: 15, color: 'white' }}>
                            Thank you for installing Campus Story
                        </Text>
                        <Image source={require('../media/LogoWhite.png')} style={{ width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center' }} />
                        <Text style={{ textAlign: 'center', fontFamily: 'Roboto', fontSize: 20, padding: 15, color: 'white' }}>
                            We hope to be your companion and bring you useful information.
                        </Text>
                    </LinearGradient>
                    
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