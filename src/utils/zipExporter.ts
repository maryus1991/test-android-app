import JSZip from 'jszip';
import { PROJECT_FILES } from '../data/projectFiles';

export async function generateAndDownloadProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Add all registered project files into the ZIP archive
  for (const file of PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  // Add gradle wrapper properties
  zip.file(
    "src-tauri/gen/android/gradle/wrapper/gradle-wrapper.properties",
    `distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip\nnetworkTimeout=10000\nvalidateDistributionUrl=true\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n`
  );

  // Add root package.json for building web dist
  const rootPackageJson = {
    name: "amvaj-sarmad-mobile",
    version: "1.0.0",
    private: true,
    scripts: {
      "build": "echo 'Building web assets for Tauri 2...' && mkdir -p dist && echo '<html><body><h1>Amvaj Sarmad Mobile Gateway</h1></body></html>' > dist/index.html"
    }
  };
  zip.file("package.json", JSON.stringify(rootPackageJson, null, 2));

  // Add README in Persian and English
  zip.file("README.md", `# Amvaj Sarmad Android Mobile Project (Tauri 2 + WebView)
Target Website: https://amvajsarmad.com
Package Identifier: com.amvajsarmad.app

## How to Build the APK:

### Option 1 (Recommended): GitHub Actions (100% Free Cloud Build)
1. Push this folder to a GitHub repository.
2. Go to Actions -> 'Build Amvaj Sarmad Android APK'.
3. Download the ready 'app-debug.apk' from Artifacts!

### Option 2: Local Gradle Build
\`\`\`bash
cd src-tauri/gen/android
./gradlew assembleDebug
\`\`\`
The APK will be generated at:
src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk
`);

  // Generate ZIP blob
  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'amvaj-sarmad-android-tauri2-project.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
