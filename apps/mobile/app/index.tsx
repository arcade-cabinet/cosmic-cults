import { useGameStore } from '@cosmic-cults/game';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BabylonCanvas } from '../components/BabylonCanvas';
import { GameScene } from '../components/GameScene';

/**
 * Main game screen
 *
 * BabylonJS + Reactylon integration for the Lovecraftian 4X RTS
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
      {/* Game Canvas */}
      <View style={styles.gameCanvas}>
        <BabylonCanvas>
          <GameScene />
        </BabylonCanvas>
      </View>

      {/* HUD Overlay */}
      <View style={styles.hud} pointerEvents="box-none">
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
      <View style={styles.controls} pointerEvents="box-none">
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
    backgroundColor: '#0a0a12',
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  controlText: {
    fontSize: 24,
  },
});
