import { useGameStore } from '@cosmic-cults/game';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Main game screen
 *
 * Note: BabylonJS React Native integration requires native modules.
 * For initial development, we start with a placeholder that will be
 * replaced with the full BabylonJS canvas once native builds are configured.
 */
export default function GameScreen() {
  const turn = useGameStore((state) => state.turn);
  const currentFaction = useGameStore((state) => state.currentFaction);
  const phase = useGameStore((state) => state.phase);
  const isPaused = useGameStore((state) => state.isPaused);
  const togglePause = useGameStore((state) => state.togglePause);
  const nextTurn = useGameStore((state) => state.nextTurn);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Game Canvas Placeholder */}
      <View style={styles.gameCanvas}>
        <Text style={styles.placeholderText}>🎮 BabylonJS Canvas</Text>
        <Text style={styles.placeholderSubtext}>
          Native build required for 3D rendering
        </Text>
        <Text style={styles.placeholderSubtext}>
          Run: npx expo run:android or npx expo run:ios
        </Text>
      </View>

      {/* HUD Overlay */}
      <View style={styles.hud}>
        <View style={styles.hudTop}>
          <Text style={styles.hudText}>
            Turn {turn} - {currentFaction.replace('-', ' ').toUpperCase()}
          </Text>
          <Text style={styles.hudText}>Phase: {phase}</Text>
          {isPaused && (
            <Text style={[styles.hudText, styles.pausedText]}>PAUSED</Text>
          )}
        </View>
      </View>

      {/* Touch Controls */}
      <View style={styles.controls}>
        <View style={styles.controlButton} onTouchEnd={togglePause}>
          <Text style={styles.controlText}>{isPaused ? '▶️' : '⏸️'}</Text>
        </View>
        <View style={styles.controlButton} onTouchEnd={nextTurn}>
          <Text style={styles.controlText}>⏭️</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a12',
  },
  gameCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a12',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  hud: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
  },
  hudTop: {
    flexDirection: 'column',
    gap: 4,
  },
  hudText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  pausedText: {
    color: '#ff6b6b',
  },
  controls: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 24,
  },
});
