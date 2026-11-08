import JSZip from 'jszip';
import { PROJECT_FILES, SORNA_LOGO_BASE64 } from '../data/projectFiles';

export async function generateAndDownloadProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Add all registered project files into the ZIP archive
  for (const file of PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  // Add binary PNG logo for Sorna Educational Group Android App Icon
  zip.file(
    'src-tauri/gen/android/app/src/main/res/drawable-nodpi/ic_launcher_logo.png',
    SORNA_LOGO_BASE64,
    { base64: true }
  );

  // Add gradle wrapper properties
  zip.file(
    'src-tauri/gen/android/gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip\nnetworkTimeout=10000\nvalidateDistributionUrl=true\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n`
  );

  // Add root package.json
  const rootPackageJson = {
    name: 'sorna-educational-group-mobile',
    version: '1.0.0',
    private: true,
    scripts: {
      build:
        "echo 'Building web assets for Sorna...' && mkdir -p dist && echo '<html><body><h1>Sorna Educational Group</h1></body></html>' > dist/index.html",
    },
  };
  zip.file('package.json', JSON.stringify(rootPackageJson, null, 2));

  // Add README in Persian and English
  zip.file(
    'README.md',
    `# پروژه اندروید گروه آموزشی سورنا (Sorna Educational Group)
Website: https://sornac.ir/
Package Identifier: ir.sornac.app

## ساخت خودکار خروجی APK در گیت‌هاب (GitHub Actions):
1. فایل \`.github/workflows/build-apk.yml\` را در مخزن گیت‌هاب خود قرار دهید.
2. به تب Actions بروید.
3. از بخش Artifacts در پایین صفحه Summary، فایل‌های \`sorna-debug-apk\` و \`sorna-release-apk\` را دانلود کنید!
`
  );

  // Generate ZIP blob
  const content = await zip.generateAsync({ type: 'blob' });

  // Trigger browser download
  const downloadUrl = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'sorna-android-tauri2-project.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
