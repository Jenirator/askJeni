import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font } from '@/lib/theme'

const TIPS = [
  { icon: 'time-outline', text: 'Keep it under 90 seconds — employers watch many profiles' },
  { icon: 'bulb-outline', text: 'Mention one project or achievement that sets you apart' },
  { icon: 'sunny-outline', text: 'Film in good natural light, facing a window' },
  { icon: 'mic-outline', text: 'Use earphones for clearer audio' },
]

export default function VideoIntroScreen() {
  const router = useRouter()
  const [recorded, setRecorded] = useState(false)

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={s.pageTitle}>Video intro</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Preview area */}
        <View style={s.videoBox}>
          {recorded ? (
            <>
              <View style={s.videoPlaceholder}>
                <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.8)" />
              </View>
              <View style={s.recordedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={colors.green} />
                <Text style={s.recordedText}>Video recorded</Text>
              </View>
            </>
          ) : (
            <View style={s.videoPlaceholder}>
              <Ionicons name="videocam-outline" size={40} color="rgba(255,255,255,0.4)" />
              <Text style={s.noVideoText}>No video yet</Text>
            </View>
          )}
        </View>

        {/* Impact callout */}
        <View style={s.callout}>
          <Ionicons name="trending-up-outline" size={18} color={colors.blue} />
          <Text style={s.calloutText}>Profiles with a video intro get <Text style={{ fontWeight: '800', color: colors.blue }}>3× more</Text> employer views</Text>
        </View>

        {/* Tips */}
        <View style={s.tipsCard}>
          <Text style={s.tipsTitle}>Tips for a great intro</Text>
          {TIPS.map((tip, i) => (
            <View key={i} style={s.tipRow}>
              <View style={s.tipIcon}>
                <Ionicons name={tip.icon as any} size={15} color={colors.blue} />
              </View>
              <Text style={s.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <TouchableOpacity style={s.recordBtn} onPress={() => setRecorded(true)}>
          <Ionicons name="radio-button-on" size={18} color="#fff" />
          <Text style={s.recordBtnText}>{recorded ? 'Re-record video' : 'Record video'}</Text>
        </TouchableOpacity>

        {recorded && (
          <TouchableOpacity style={s.deleteBtn} onPress={() => setRecorded(false)}>
            <Text style={s.deleteBtnText}>Remove video</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { padding: 4 },
  pageTitle: { flex: 1, color: '#fff', fontSize: font.md, fontWeight: '700' },

  content: { padding: spacing.lg, paddingBottom: 32, gap: spacing.md },

  videoBox: { borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.navyMid },
  videoPlaceholder: {
    height: 180, alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  noVideoText: { fontSize: font.sm, color: 'rgba(255,255,255,0.35)', fontWeight: '500' },
  recordedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: `${colors.green}15`, borderTopWidth: 1, borderTopColor: `${colors.green}25`,
  },
  recordedText: { fontSize: font.sm, color: colors.green, fontWeight: '600' },

  callout: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: `${colors.blue}08`, borderRadius: radius.lg,
    padding: 14, borderWidth: 1, borderColor: `${colors.blue}20`,
  },
  calloutText: { flex: 1, fontSize: font.sm, color: colors.text2, lineHeight: 19 },

  tipsCard: {
    backgroundColor: '#fff', borderRadius: radius.xl,
    padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: 12,
  },
  tipsTitle: { fontSize: font.sm, fontWeight: '700', color: colors.text1, marginBottom: 2 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: `${colors.blue}10`, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  tipText: { flex: 1, fontSize: font.sm, color: colors.text2, lineHeight: 19 },

  recordBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.blue, borderRadius: 24, paddingVertical: 14,
  },
  recordBtnText: { color: '#fff', fontSize: font.base, fontWeight: '700' },

  deleteBtn: { alignItems: 'center', paddingVertical: 8 },
  deleteBtnText: { fontSize: font.sm, color: '#DC2626', fontWeight: '600' },
})
