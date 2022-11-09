import React, { PureComponent } from 'react';
import { Image, View } from 'react-native';
import { Marker } from 'react-native-maps';

import stopImage from '../../../assets/circle.png';
import favoriteStopImage from '../../../assets/star.png';

class StopView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tracksViewChanges: true,
    };

    this.stopTrackingViewChanges = this.stopTrackingViewChanges.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  componentDidUpdate() {
    if (this.props.favorite && !this.tracksViewChanges)
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
    this.props.onPress(this.props.stop);
  }

  render() {
    return (
      <Marker
        tracksViewChanges={this.state.tracksViewChanges}
        onPress={this.onPress}
        coordinate={{ latitude: this.props.stop.Latitude, longitude: this.props.stop.Longitude }}
        anchor={{ x: 0.5, y: 0.5 }}>
        <View style={{ width: 20, height: 20, zIndex: 5 }}>
          <Image
            style={{ width: '100%', height: '100%' }}
            source={this.props.favorite ? favoriteStopImage : stopImage}
            onLoad={this.stopTrackingViewChanges}
            fadeDuration={0}
          />
        </View>
      </Marker>
    );
  }
}

export default StopView;
