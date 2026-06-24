import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font } from '@/lib/theme'

const EMAIL = 'thabo@gmail.com'

interface PrefRow {
  id: string
  icon: React.ComponentProps<typeof Ionicons>['name']
  iconColor: string
  title: string
  sub: string
  email: boolean
  push: boolean
  urgency: 'instant' | 'digest'
}

export default function NotificationsScreen() {
  const router = useRouter()

  const [prefs, setPrefs] = useState<PrefRow[]>([
    {
      id: 'interest',
      icon: 'star',
      iconColor: colors.yellow,
      title: 'Employer interest',
      sub: 'When an employer views or saves your profile',
      email: true,
      push: true,
      urgency: 'instant',
    },
    {
      id: 'interview',
      icon: 'videocam',
      iconColor: colors.blue,
      title: 'Interview invites',
      sub: 'When you are shortlisted for an interview',
      email: true,
      push: true,
      urgency: 'instant',
    },
    {
      id: 'message',
      icon: 'chatbubble',
      iconColor: '#7C3AED',
      title: 'New messages',
      sub: 'When an employer sends you a message',
      email: true,
      push: true,
      urgency: 'instant',
    },
    {
      id: 'status',
      icon: 'document-text',
      iconColor: colors.text3,
      title: 'Application updates',
      sub: 'Status changes on roles you applied for',
      email: true,
      push: false,
      urgency: 'digest',
    },
    {
      id: 'matches',
      icon: 'briefcase',
      iconColor: colors.green,
      title: 'New role matches',
      sub: 'When new roles match your profile',
      email: false,
      push: true,
      urgency: 'digest',
    },
    {
      id: 'passport',
      icon: 'shield-checkmark',
      iconColor: colors.blue,
      title: 'Passport nudges',
      sub: 'Reminders to complete your Skills Passport',
      email: false,
      push: false,
      urgency: 'digest',
    },
  ])

  function toggle(id: string, field: 'email' | 'push') {
    setPrefs(prev => prev.map(p => p.id === id ? { ...p, [field]: !p[field] } : p))
  }

  const activeEmail = prefs.filter(p => p.email).length
  const activePush  = prefs.filter(p => p.push).length

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={s.pageTitle}>Notifications</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Email address banner */}
      <View style={s.emailBanner}>
        <View style={s.emailLeft}>
          <Ionicons name="mail" size={16} color={colors.blue} />
          <View>
            <Text style={s.emailLabel}>Sending emails to</Text>
            <Text style={s.emailAddress}>{EMAIL}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.changeBtn}>
          <Text style={s.changeBtnText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Summary chips */}
      <View style={s.summaryRow}>
        <View style={s.summaryChip}>
          <Ionicons name="mail-outline" size={13} color={colors.blue} />
          <Text style={s.summaryText}>{activeEmail} email alerts on</Text>
        </View>
        <View style={s.summaryChip}>
          <Ionicons name="notifications-outline" size={13} color="#7C3AED" />
          <Text style={s.summaryText}>{activePush} push alerts on</Text>
        </View>
      </View>

      {/* Preference rows */}
      <View style={s.card}>
        {prefs.map((pref, i) => (
          <View key={pref.id} style={[s.row, i === prefs.length - 1 && s.rowLast]}>
            <View style={[s.rowIcon, { backgroundColor: `${pref.iconColor}15` }]}>
              <Ionicons name={pref.icon} size={16} color={pref.iconColor} />
            </View>
            <View style={s.rowInfo}>
              <Text style={s.rowTitle}>{pref.title}</Text>
              <Text style={s.rowSub} numberOfLines={1}>{pref.sub}</Text>
              <View style={s.urgencyRow}>
                <Ionicons
                  name={pref.urgency === 'instant' ? 'flash' : 'time-outline'}
                  size={10}
                  color={pref.urgency === 'instant' ? colors.yellow : colors.text3}
                />
                <Text style={[s.urgencyText, pref.urgency === 'instant' && s.urgencyInstant]}>
                  {pref.urgency === 'instant' ? 'Instant' : 'Daily digest'}
                </Text>
              </View>
            </View>
            <View style={s.toggles}>
              <View style={s.toggleCol}>
                <Ionicons name="mail-outline" size={11} color={pref.email ? colors.blue : colors.text3} />
                <Switch
                  value={pref.email}
                  onValueChange={() => toggle(pref.id, 'email')}
                  trackColor={{ false: colors.border, true: `${colors.blue}60` }}
                  thumbColor={pref.email ? colors.blue : '#fff'}
                  style={s.switch}
                />
              </View>
              <View style={s.toggleCol}>
                <Ionicons name="notifications-outline" size={11} color={pref.push ? '#7C3AED' : colors.text3} />
                <Switch
                  value={pref.push}
                  onValueChange={() => toggle(pref.id, 'push')}
                  trackColor={{ false: colors.border, true: '#7C3AED60' }}
                  thumbColor={pref.push ? '#7C3AED' : '#fff'}
                  style={s.switch}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Footer note */}
      <Text style={s.footerNote}>
        ⚡ Instant alerts send immediately · Daily digest sends at 8am
      </Text>

    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 24,
  },
  backBtn:   { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  pageTitle: { color: '#fff', fontSize: font.lg, fontWeight: '800' },

  emailBanner: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    marginTop: -14,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  emailLeft:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
  emailLabel:   { fontSize: 11, color: colors.text3, fontWeight: '500' },
  emailAddress: { fontSize: font.base, color: colors.text1, fontWeight: '600', marginTop: 1 },
  changeBtn:    { backgroundColor: colors.bluePale, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm },
  changeBtnText:{ fontSize: font.sm, color: colors.blue, fontWeight: '700' },

  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryText: { fontSize: 11, color: colors.text2, fontWeight: '600' },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },

  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: font.base, fontWeight: '600', color: colors.text1 },
  rowSub:   { fontSize: 11, color: colors.text3, marginTop: 1 },

  urgencyRow:     { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  urgencyText:    { fontSize: 10, color: colors.text3, fontWeight: '500' },
  urgencyInstant: { color: colors.yellow },

  toggles:   { flexDirection: 'row', gap: 8 },
  toggleCol: { alignItems: 'center', gap: 2 },
  switch:    { transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] },

  footerNote: {
    fontSize: 11,
    color: colors.text3,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
})
