import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font } from '@/lib/theme'

export default function SavedRolesScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={s.pageTitle}>Saved roles</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={s.empty}>
        <View style={s.emptyIcon}>
          <Ionicons name="bookmark-outline" size={32} color={colors.text3} />
        </View>
        <Text style={s.emptyTitle}>No saved roles yet</Text>
        <Text style={s.emptySub}>When you save a role from your matches, it appears here so you can come back to it later.</Text>
        <TouchableOpacity style={s.cta} onPress={() => router.push('/(tabs)/opportunities')}>
          <Text style={s.ctaText}>Browse matches</Text>
          <Ionicons name="arrow-forward" size={15} color="#fff" />
        </TouchableOpacity>
      </View>

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

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 12 },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: font.md, fontWeight: '700', color: colors.text1, textAlign: 'center' },
  emptySub: { fontSize: font.sm, color: colors.text3, textAlign: 'center', lineHeight: 20 },
  cta: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.blue, borderRadius: 24,
    paddingHorizontal: 20, paddingVertical: 11, marginTop: 8,
  },
  ctaText: { color: '#fff', fontSize: font.base, fontWeight: '700' },
})
