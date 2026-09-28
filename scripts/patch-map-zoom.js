/* eslint-env node */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../node_modules/react-native-maps/ios/AirMaps');

function replaceOnce(file, from, to, label) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) return;
  const source = fs.readFileSync(target, 'utf8');
  if (source.includes(to)) return;
  if (!source.includes(from)) {
    console.warn(`patch-map-zoom: ${label} was not applied`);
    return;
  }
  fs.writeFileSync(target, source.replace(from, to));
}

// A camera zoom range makes MapKit drop small outward pinches. Only apply one
// when both distances are real, and otherwise clear any range that was set.
replaceOnce(
  'RNMapsMapView.mm',
  `        MKMapCameraZoomRange* zoomRange = [[MKMapCameraZoomRange alloc] initWithMinCenterCoordinateDistance:newViewProps.cameraZoomRange.minCenterCoordinateDistance maxCenterCoordinateDistance:newViewProps.cameraZoomRange.maxCenterCoordinateDistance];
        [_view setCameraZoomRange:zoomRange animated:newViewProps.cameraZoomRange.animated];
        _view.legacyZoomConstraintsEnabled = NO;`,
  `        _view.legacyZoomConstraintsEnabled = NO;
        double minDistance = newViewProps.cameraZoomRange.minCenterCoordinateDistance;
        double maxDistance = newViewProps.cameraZoomRange.maxCenterCoordinateDistance;
        if (minDistance > 0 && maxDistance > minDistance) {
            MKMapCameraZoomRange* zoomRange = [[MKMapCameraZoomRange alloc] initWithMinCenterCoordinateDistance:minDistance maxCenterCoordinateDistance:maxDistance];
            [_view setCameraZoomRange:zoomRange animated:newViewProps.cameraZoomRange.animated];
        } else {
            [_view setCameraZoomRange:nil animated:NO];
        }`,
  'camera zoom range'
);

// The extra double-tap recognizer waits out MKMapView's own pinch, so zoom-out
// is ignored until the gesture is repeated. This app does not use onDoublePress.
replaceOnce(
  'AIRMapManager.m',
  `    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleMapTap:)];
    UITapGestureRecognizer *doubleTap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleMapDoubleTap:)];
    [doubleTap setNumberOfTapsRequired:2];
    [tap requireGestureRecognizerToFail:doubleTap];`,
  `    // No extra double-tap recognizer. It waits out MKMapView's pinch, so
    // zooming out is ignored until the gesture is repeated.
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleMapTap:)];`,
  'double tap recognizer'
);

replaceOnce(
  'AIRMapManager.m',
  `    tap.cancelsTouchesInView = NO;
    doubleTap.cancelsTouchesInView = NO;
    longPress.cancelsTouchesInView = NO;

    doubleTap.delegate = self;`,
  `    tap.cancelsTouchesInView = NO;
    longPress.cancelsTouchesInView = NO;`,
  'double tap setup'
);

replaceOnce(
  'AIRMapManager.m',
  `    [map addGestureRecognizer:tap];
    [map addGestureRecognizer:doubleTap];
    [map addGestureRecognizer:longPress];`,
  `    [map addGestureRecognizer:tap];
    [map addGestureRecognizer:longPress];`,
  'double tap install'
);

replaceOnce(
  'AIRMap.mm',
  'self.compassOffset = CGPointMake(0, 0);\n        self.legacyZoomConstraintsEnabled = YES;',
  'self.compassOffset = CGPointMake(0, 0);\n        self.legacyZoomConstraintsEnabled = NO;',
  'initial zoom clamp'
);
