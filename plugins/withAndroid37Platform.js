const { withAppBuildGradle, withProjectBuildGradle } = require('expo/config-plugins');

// Platform 37 is installed as android-37.0. compileSdk 37 looks up android-37
// unless the minor API level is set.
const ROOT_SNIPPET = `
// Platform 37 is published as android-37.0. An integer compileSdk of 37
// looks up android-37, so set the minor API level after modules configure.
subprojects { subproject ->
  def applyCompileSdk = {
    def androidExt = subproject.extensions.findByName("android")
    if (androidExt != null) {
      androidExt.compileSdk {
        version = release(37) {
          minorApiLevel = 0
        }
      }
    }
  }
  if (subproject.state.executed) {
    applyCompileSdk()
  } else {
    subproject.afterEvaluate(applyCompileSdk)
  }
}
`;

function contentsOf(modResults) {
  return typeof modResults === 'string' ? modResults : modResults.contents;
}

function withContents(modResults, contents) {
  if (typeof modResults === 'string') return contents;
  return { ...modResults, contents };
}

function withAndroid37Platform(config) {
  config = withProjectBuildGradle(config, (cfg) => {
    let contents = contentsOf(cfg.modResults);
    if (!contents.includes('minorApiLevel = 0')) {
      contents += ROOT_SNIPPET;
    }
    cfg.modResults = withContents(cfg.modResults, contents);
    return cfg;
  });

  config = withAppBuildGradle(config, (cfg) => {
    let contents = contentsOf(cfg.modResults);
    contents = contents.replace(
      'compileSdk rootProject.ext.compileSdkVersion',
      `compileSdk {
        version = release(rootProject.ext.compileSdkVersion) {
            minorApiLevel = 0
        }
    }`
    );
    cfg.modResults = withContents(cfg.modResults, contents);
    return cfg;
  });

  return config;
}

module.exports = withAndroid37Platform;
