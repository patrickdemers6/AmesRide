import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';

class ImagePin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tracksViewChanges: true,
      lastImage: props.image,
    };

    this.stopTrackingViewChanges = this.stopTrackingViewChanges.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  componentDidUpdate() {
    if (!this.tracksViewChanges)
      this.setState(() => ({
        tracksViewChanges: true,
      }));
  }

  stopTrackingViewChanges() {
    this.setState(() => ({
      tracksViewChanges: false,
    }));
  }

  onPress() {
    this.props.onPress(this.props.details);
  }

  render() {
    return (
      <Marker
        tracksViewChanges={false}
        onPress={this.onPress}
        coordinate={{
          latitude: this.props.details.Latitude,
          longitude: this.props.details.Longitude,
        }}
        anchor={{ x: 0.5, y: 0.5 }}>
        <View
          style={{
            width: 25,
            height: 25,
            zIndex: 5,
          }}>
          {this.props.children}
        </View>
      </Marker>
    );
  }
}

export default ImagePin;
