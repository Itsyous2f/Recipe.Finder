// app/(tabs)/about.tsx
import { Platform, StyleSheet } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AboutScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFEBE6', dark: '#1A1A1A' }}
      headerImage={
        <IconSymbol
          size={280}
          color="#FF6F61"
          name="fork.knife"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Recipe Finder</ThemedText>
      </ThemedView>

      <Collapsible title="What is Recipe Finder?">
        <ThemedText>
          Recipe Finder is a mobile app that helps users discover recipes by searching for meal
          names or selecting a category. It uses data from{' '}
          <ThemedText type="defaultSemiBold">TheMealDB API</ThemedText>.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Features">
        <ThemedText>• Search meals by name</ThemedText>
        <ThemedText>• Filter meals by category</ThemedText>
        <ThemedText>• View detailed meal instructions</ThemedText>
        <ThemedText>• Toggle between light and dark mode</ThemedText>
        <ThemedText>• Open original source links for meals</ThemedText>
      </Collapsible>

      <Collapsible title="Technologies Used">
        <ThemedText>• React Native</ThemedText>
        <ThemedText>• Expo</ThemedText>
        <ThemedText>• Axios</ThemedText>
        <ThemedText>• TheMealDB REST API</ThemedText>
      </Collapsible>

      <Collapsible title="Get the Source Code">
        <ThemedText>
          This app is open-source. You can explore or contribute to it on GitHub.
        </ThemedText>
        <ExternalLink href="https://github.com/YOUR_REPO_LINK_HERE">
          <ThemedText type="link">View on GitHub</ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="Compatibility">
        <ThemedText>
          Recipe Finder runs on Android, iOS, and the web. Use{' '}
          <ThemedText type="defaultSemiBold">expo start --web</ThemedText> to test the web version.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Acknowledgements">
        <ThemedText>
          Special thanks to <ThemedText type="defaultSemiBold">TheMealDB</ThemedText> for their
          public API and to all open-source libraries used in this project.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#FF6F61',
    bottom: -80,
    left: -30,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
