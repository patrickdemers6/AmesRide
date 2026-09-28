import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';

// The icon is 25pt. Width includes padding, so the old 25pt box with 10pt of
// padding left a few points of content. The previous renderer still treated
// the overflowing icon as tappable. This one does not.
const HIT_SIZE = 44;

class ImagePin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lastImage: props.image,
      tracksViewChanges: true,
    };

    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    // Google Maps shows its default red pin until the custom icon has been
    // drawn once. Tracking has to stay on for that first paint, then stop,
    // or every stop keeps redrawing and pinches get cancelled.
    this.stopTracking = setTimeout(() => {
      this.setState({ tracksViewChanges: false });
    }, 800);
  }

  componentWillUnmount() {
    clearTimeout(this.stopTracking);
  }

  onPress(event) {
    // without stopping propogation of event, the stop details will close, if already open
    event.stopPropagation?.();
    event.preventDefault?.();
    this.props.onPress(this.props.details);
  }

  render() {
    return (
      <Marker
        tracksViewChanges={this.state.tracksViewChanges}
        onPress={this.onPress}
        coordinate={{
          latitude: this.props.details.latitude,
          longitude: this.props.details.longitude,
        }}
        anchor={{ x: 0.5, y: 0.5 }}>
        <View
          collapsable={false}
          pointerEvents="none"
          style={{
            width: HIT_SIZE,
            height: HIT_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {this.props.children}
        </View>
      </Marker>
    );
  }
}

export default ImagePin;
