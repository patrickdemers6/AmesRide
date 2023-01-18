import React, { PureComponent } from 'react';
import { Platform, View } from 'react-native';
import { Marker } from 'react-native-maps';

class ImagePin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lastImage: props.image,
    };

    this.onPress = this.onPress.bind(this);
  }

  onPress(event) {
    // without stopping propogation of event, the stop details will close, if already open
    event.stopPropagation();
    event.preventDefault();
    this.props.onPress(this.props.details);
  }

  render() {
    return (
      <Marker
        tracksViewChanges={Platform.OS === 'ios'}
        onPress={this.onPress}
        coordinate={{
          latitude: this.props.details.Latitude,
          longitude: this.props.details.Longitude,
        }}
        style={{ width: 45, height: 45 }}
        anchor={{ x: 0.5, y: 0.5 }}>
        <View
          style={{
            width: 25,
            height: 25,
            padding: 10,
            zIndex: 5,
          }}>
          {this.props.children}
        </View>
      </Marker>
    );
  }
}

export default ImagePin;
