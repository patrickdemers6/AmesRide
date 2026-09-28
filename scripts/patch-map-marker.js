/* eslint-env node */
const fs = require('fs');
const path = require('path');

const file = path.join(
  __dirname,
  '../node_modules/react-native-maps/android/src/main/java/com/rnmaps/maps/MapMarker.java'
);

let source = fs.readFileSync(file, 'utf8');
const patched = `        if (getChildCount() == 0) {
            if (hasCustomMarkerView) {
                // update(true) swaps in the default red pin and leaves it behind
                // when a stop's custom view unmounts. Do not remove the marker
                // here: vehicle icons hit an empty layout while they are still
                // on the map, and destroying them makes every bus disappear.
                hasCustomMarkerView = false;
                clearDrawableCache();
                updateTracksViewChanges();
            }
        } else {`;

if (!source.includes('vehicle icons hit an empty layout while they are still')) {
  const previousPatches = [
    `        if (getChildCount() == 0) {
            if (hasCustomMarkerView) {
                // update(true) here swaps in Google's default red pin, which is
                // left behind after a stop unmounts. doDestroy() immediately
                // also deletes live markers whose view is empty for a moment,
                // which removes every vehicle on the next position update.
                hasCustomMarkerView = false;
                clearDrawableCache();
                updateTracksViewChanges();
                post(() -> {
                    if (getChildCount() == 0 && getParent() != null) {
                        doDestroy();
                    }
                });
            }
        } else {`,
    `        if (getChildCount() == 0) {
            if (hasCustomMarkerView) {
                // The custom view is going away. Updating now swaps in Google's
                // default red pin and that pin is left on the map. Remove it.
                hasCustomMarkerView = false;
                clearDrawableCache();
                updateTracksViewChanges();
                doDestroy();
            }
        } else {`,
    `        if (getChildCount() == 0) {
            if (hasCustomMarkerView) {
                hasCustomMarkerView = false;
                clearDrawableCache();
                updateTracksViewChanges();
                update(true);
            }
        } else {`,
  ];

  const found = previousPatches.find((block) => source.includes(block));
  if (!found) {
    console.error('patch-map-marker: MapMarker.requestLayout did not match');
    process.exit(1);
  }

  source = source.replace(found, patched);
}

// Marker `image` bitmaps are drawn at their pixel size. assets/arrow.png is
// 512px, which covers the campus. Scale every loaded marker image to 25dp.
// A missing drawable id throws from getDrawable and kills the React instance,
// which blanks the map the moment a bus marker mounts.
const scaleMethod = `
    private Bitmap scaleMarkerBitmap(Bitmap bitmap) {
        if (bitmap == null) return bitmap;
        float density = getResources().getDisplayMetrics().density;
        int target = Math.round(25f * density);
        int largest = Math.max(bitmap.getWidth(), bitmap.getHeight());
        if (largest <= target || largest == 0) return bitmap;
        float scale = target / (float) largest;
        return Bitmap.createScaledBitmap(
                bitmap,
                Math.max(1, Math.round(bitmap.getWidth() * scale)),
                Math.max(1, Math.round(bitmap.getHeight() * scale)),
                true);
    }

`;

if (!source.includes('scaleMarkerBitmap')) {
  const anchor = '    private int getDrawableResourceByName(String name) {';
  if (!source.includes(anchor)) {
    console.error('patch-map-marker: getDrawableResourceByName was not found');
    process.exit(1);
  }
  source = source.replace(anchor, scaleMethod + anchor);
}

const frescoOriginal = `                                if (bitmap != null) {
                                    bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                                    iconBitmap = bitmap;
                                    iconBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);
                                }`;
const frescoPatched = `                                if (bitmap != null) {
                                    bitmap = scaleMarkerBitmap(bitmap.copy(Bitmap.Config.ARGB_8888, true));
                                    iconBitmap = bitmap;
                                    iconBitmapDescriptor = BitmapDescriptorFactory.fromBitmap(bitmap);
                                }`;
if (source.includes(frescoOriginal)) {
  source = source.replace(frescoOriginal, frescoPatched);
} else if (!source.includes('scaleMarkerBitmap(bitmap.copy')) {
  console.error('patch-map-marker: fresco image callback did not match');
  process.exit(1);
}

const resourceOriginal = `        } else {
            iconBitmapDescriptor = getBitmapDescriptorByName(uri);
            int drawableId = getDrawableResourceByName(uri);
            iconBitmap = BitmapFactory.decodeResource(getResources(), drawableId);
            if (iconBitmap == null) { // VectorDrawable or similar
                Drawable drawable = getResources().getDrawable(drawableId);
                iconBitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
                drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
                Canvas canvas = new Canvas(iconBitmap);
                drawable.draw(canvas);
            }
            if (this.markerManager != null) {
                this.markerManager.getSharedIcon(uri).updateIcon(iconBitmapDescriptor, iconBitmap);
            }
            update(true);
        }`;
const resourcePatched = `        } else {
            int drawableId = getDrawableResourceByName(uri);
            if (drawableId == 0) {
                iconBitmapDescriptor = null;
                iconBitmap = null;
            } else {
                iconBitmap = BitmapFactory.decodeResource(getResources(), drawableId);
                if (iconBitmap == null) { // VectorDrawable or similar
                    Drawable drawable = getResources().getDrawable(drawableId);
                    iconBitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
                    drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
                    Canvas canvas = new Canvas(iconBitmap);
                    drawable.draw(canvas);
                }
                iconBitmap = scaleMarkerBitmap(iconBitmap);
                iconBitmapDescriptor = iconBitmap == null
                        ? null
                        : BitmapDescriptorFactory.fromBitmap(iconBitmap);
            }
            if (this.markerManager != null) {
                this.markerManager.getSharedIcon(uri).updateIcon(iconBitmapDescriptor, iconBitmap);
            }
            update(true);
        }`;
if (source.includes(resourceOriginal)) {
  source = source.replace(resourceOriginal, resourcePatched);
} else if (!source.includes('if (drawableId == 0)')) {
  console.error('patch-map-marker: setImage resource branch did not match');
  process.exit(1);
}

fs.writeFileSync(file, source);
