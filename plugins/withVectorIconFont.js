const { withDangerousMod, withInfoPlist } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const FONT = 'MaterialCommunityIcons.ttf';

// The vector-icons pod already copies this file into the iOS app. Adding it
// again as an app resource makes the archive fail with a duplicate output.
// iOS still needs the filename listed under UIAppFonts or the glyphs stay blank.
function withVectorIconFont(config) {
  config = withInfoPlist(config, (modConfig) => {
    const fonts = modConfig.modResults.UIAppFonts ?? [];
    if (!fonts.includes(FONT)) fonts.push(FONT);
    modConfig.modResults.UIAppFonts = fonts;
    return modConfig;
  });

  return withDangerousMod(config, [
    'android',
    (modConfig) => {
      const fontsDir = path.join(
        modConfig.modRequest.platformProjectRoot,
        'app/src/main/assets/fonts'
      );
      const source = path.join(
        modConfig.modRequest.projectRoot,
        'node_modules/react-native-vector-icons/Fonts',
        FONT
      );
      fs.mkdirSync(fontsDir, { recursive: true });
      fs.copyFileSync(source, path.join(fontsDir, FONT));
      return modConfig;
    },
  ]);
}

module.exports = withVectorIconFont;
