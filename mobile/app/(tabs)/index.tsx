import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font, companyColor } from '@/lib/theme'
import { MOCK_APPLICATIONS, AppStage } from '@/lib/mock-data'

type MessageType = 'interest' | 'interview' | 'update' | 'offer'

interface Message {
  id: string
  type: MessageType
  company: string
  role: string
  preview: string
  time: string
  unread: boolean
}

const MESSAGES: Message[] = [
  {
    id: '0',
    type: 'interview',
    company: 'Peach Payments',
    role: 'Junior Software Engineer',
    preview: "Hi Thabo — we'd like to invite you to a 45-min video interview. Please pick a time that works for you: Mon 30 Jun 9:00 AM, Mon 30 Jun 2:00 PM, or Tue 1 Jul 10:00 AM.",
    time: 'Just now',
    unread: true,
  },
  {
    id: '1',
    type: 'interest',
    company: 'Peach Payments',
    role: 'Junior Software Engineer',
    preview: "We reviewed your Skills Passport and think you'd be a great fit. We'd love to chat.",
    time: '2h ago',
    unread: false,
  },
  {
    id: '2',
    type: 'interview',
    company: 'Takealot',
    role: 'Graduate Developer',
    preview: "You've been shortlisted! Please pick a time for a 30-min video interview.",
    time: '5h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'update',
    company: 'FNB Tech',
    role: 'Software Engineer Intern',
    preview: "Your application is under review. We'll be in touch within 5 business days.",
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '4',
    type: 'interest',
    company: 'Yoco',
    role: 'Frontend Developer',
    preview: "Hi Thabo, your React skills caught our eye. Are you open to a quick call this week?",
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '5',
    type: 'update',
    company: 'Discovery',
    role: 'React Developer',
    preview: "Thank you for applying. We've received your application and will review it shortly.",
    time: '2 days ago',
    unread: false,
  },
]

const TYPE_CONFIG: Record<MessageType, { icon: React.ComponentProps<typeof Ionicons>['name']; color: string }> = {
  interest:  { icon: 'star-outline',         color: colors.yellow },
  interview: { icon: 'videocam-outline',      color: colors.blue   },
  update:    { icon: 'document-text-outline', color: colors.text3  },
  offer:     { icon: 'trophy-outline',        color: colors.green  },
}

const STAGE_ORDER: AppStage[] = ['applied', 'reviewing', 'interview', 'offer']

const STAGE_META: Record<AppStage, { label: string; color: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  applied:   { label: 'Applied',       color: colors.text3,  icon: 'paper-plane-outline'  },
  reviewing: { label: 'Under review',  color: colors.blue,   icon: 'hourglass-outline'    },
  interview: { label: 'Interview',     color: colors.yellow, icon: 'videocam-outline'     },
  offer:     { label: 'Offer',         color: colors.green,  icon: 'trophy-outline'       },
  rejected:  { label: 'Not selected',  color: '#DC2626',     icon: 'close-circle-outline' },
}

export default function InboxScreen() {
  const [tab, setTab] = useState<'messages' | 'applications'>('messages')
  const [messages, setMessages] = useState(MESSAGES)
  const unreadCount = messages.filter(m => m.unread).length

  const activeApps = MOCK_APPLICATIONS.filter(a => a.stage !== 'rejected')
  const rejectedApps = MOCK_APPLICATIONS.filter(a => a.stage === 'rejected')

  function markRead(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m))
  }
  function markAllRead() {
    setMessages(prev => prev.map(m => ({ ...m, unread: false })))
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.pageTitle}>Inbox</Text>
          {tab === 'messages' && unreadCount > 0 && (
            <Text style={s.sub}>{unreadCount} new message{unreadCount !== 1 ? 's' : ''}</Text>
          )}
          {tab === 'applications' && (
            <Text style={s.sub}>{activeApps.length} active application{activeApps.length !== 1 ? 's' : ''}</Text>
          )}
        </View>
        {tab === 'messages' && unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={s.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab toggle */}
      <View style={s.toggleWrap}>
        <TouchableOpacity
          style={[s.toggleBtn, tab === 'messages' && s.toggleBtnActive]}
          onPress={() => setTab('messages')}
        >
          <Text style={[s.toggleText, tab === 'messages' && s.toggleTextActive]}>Messages</Text>
          {unreadCount > 0 && (
            <View style={s.pill}><Text style={s.pillText}>{unreadCount}</Text></View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, tab === 'applications' && s.toggleBtnActive]}
          onPress={() => setTab('applications')}
        >
          <Text style={[s.toggleText, tab === 'applications' && s.toggleTextActive]}>Applications</Text>
          <View style={[s.pill, { backgroundColor: colors.green }]}>
            <Text style={s.pillText}>{activeApps.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── MESSAGES ── */}
      {tab === 'messages' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {unreadCount === 0 && (
            <View style={s.allReadBanner}>
              <Ionicons name="checkmark-circle" size={15} color={colors.green} />
              <Text style={s.allReadText}>You're all caught up</Text>
            </View>
          )}
          <View style={s.msgCard}>
            {messages.map((msg, i) => {
              const cfg = TYPE_CONFIG[msg.type]
              const col = companyColor(msg.company)
              const abbr = msg.company.split(' ').map(w => w[0]).join('').slice(0, 2)
              return (
                <TouchableOpacity
                  key={msg.id}
                  style={[s.row, msg.unread && s.rowUnread, i === messages.length - 1 && s.rowLast]}
                  onPress={() => markRead(msg.id)}
                  activeOpacity={0.7}
                >
                  <View style={s.avatarWrap}>
                    <View style={[s.avatar, { backgroundColor: col }]}>
                      <Text style={s.avatarTxt}>{abbr}</Text>
                    </View>
                    <View style={[s.typeIcon, { backgroundColor: cfg.color }]}>
                      <Ionicons name={cfg.icon} size={9} color="#fff" />
                    </View>
                  </View>
                  <View style={s.msgBody}>
                    <View style={s.msgTop}>
                      <Text style={[s.company, msg.unread && s.companyBold]} numberOfLines={1}>{msg.company}</Text>
                      <Text style={s.time}>{msg.time}</Text>
                    </View>
                    <Text style={[s.roleTxt, msg.unread && s.roleBold]} numberOfLines={1}>{msg.role}</Text>
                    <Text style={s.preview} numberOfLines={2}>{msg.preview}</Text>
                  </View>
                  {msg.unread && <View style={s.dot} />}
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      )}

      {/* ── APPLICATIONS ── */}
      {tab === 'applications' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.appsScroll} showsVerticalScrollIndicator={false}>

          {/* Summary bar */}
          <View style={s.summaryBar}>
            {STAGE_ORDER.map((sk, i) => {
              const count = MOCK_APPLICATIONS.filter(a => a.stage === sk).length
              const meta = STAGE_META[sk]
              return (
                <View key={sk} style={[s.summaryCell, i < STAGE_ORDER.length - 1 && { borderRightWidth: 1, borderRightColor: colors.border }]}>
                  <Text style={[s.summaryNum, { color: meta.color }]}>{count}</Text>
                  <Text style={s.summaryLabel}>{meta.label}</Text>
                </View>
              )
            })}
          </View>

          {/* Active applications */}
          {activeApps.map(app => {
            const meta = STAGE_META[app.stage]
            const col = companyColor(app.company)
            const abbr = app.company.split(' ').map(w => w[0]).join('').slice(0, 2)
            const stageIdx = STAGE_ORDER.indexOf(app.stage as any)
            return (
              <View key={app.id} style={s.appCard}>
                <View style={s.appTop}>
                  <View style={[s.appAvatar, { backgroundColor: col }]}>
                    <Text style={s.appAvatarTxt}>{abbr}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.appRole}>{app.role}</Text>
                    <Text style={s.appCo}>{app.company} · {app.city}</Text>
                  </View>
                  <View style={[s.stageBadge, { backgroundColor: `${meta.color}18` }]}>
                    <Ionicons name={meta.icon} size={11} color={meta.color} />
                    <Text style={[s.stageBadgeTxt, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                </View>

                {/* Progress track */}
                <View style={s.track}>
                  {STAGE_ORDER.map((sk, i) => (
                    <View
                      key={sk}
                      style={[
                        s.trackSeg,
                        i < STAGE_ORDER.length - 1 && { marginRight: 3 },
                        { backgroundColor: i <= stageIdx ? meta.color : colors.border },
                      ]}
                    />
                  ))}
                </View>

                {app.note && <Text style={s.appNote} numberOfLines={2}>{app.note}</Text>}

                <View style={s.appFooter}>
                  <Text style={s.appliedAgo}>Applied {app.appliedDaysAgo} days ago</Text>
                  {app.actionLabel && (
                    <TouchableOpacity style={[s.actionBtn, { borderColor: meta.color }]}>
                      <Text style={[s.actionTxt, { color: meta.color }]}>{app.actionLabel}</Text>
                      <Ionicons name="arrow-forward" size={12} color={meta.color} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )
          })}

          {/* Rejected */}
          {rejectedApps.length > 0 && (
            <>
              <Text style={s.sectionLabel}>Not selected</Text>
              {rejectedApps.map(app => {
                const col = companyColor(app.company)
                const abbr = app.company.split(' ').map(w => w[0]).join('').slice(0, 2)
                return (
                  <View key={app.id} style={[s.appCard, { opacity: 0.6 }]}>
                    <View style={s.appTop}>
                      <View style={[s.appAvatar, { backgroundColor: col }]}>
                        <Text style={s.appAvatarTxt}>{abbr}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.appRole}>{app.role}</Text>
                        <Text style={s.appCo}>{app.company} · {app.city}</Text>
                      </View>
                      <View style={[s.stageBadge, { backgroundColor: '#FEE2E2' }]}>
                        <Text style={[s.stageBadgeTxt, { color: '#DC2626' }]}>Not selected</Text>
                      </View>
                    </View>
                    {app.note && <Text style={s.appNote} numberOfLines={2}>{app.note}</Text>}
                  </View>
                )
              })}
            </>
          )}

        </ScrollView>
      )}

    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: 12,
  },
  pageTitle: { color: '#fff', fontSize: font.xl, fontWeight: '800' },
  sub:       { color: colors.yellow, fontSize: font.sm, fontWeight: '600', marginTop: 2 },
  markAll:   { color: 'rgba(255,255,255,0.45)', fontSize: font.sm, fontWeight: '600', paddingTop: 4 },

  toggleWrap: {
    flexDirection: 'row', backgroundColor: colors.navy,
    paddingHorizontal: spacing.xl, gap: 4, paddingBottom: 0,
  },
  toggleBtn:       { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: radius.lg },
  toggleBtnActive: { backgroundColor: colors.bg },
  toggleText:       { fontSize: font.sm, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  toggleTextActive: { color: colors.text1 },
  pill:     { backgroundColor: colors.blue, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  pillText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  allReadBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: `${colors.green}12`, marginHorizontal: spacing.lg, marginTop: spacing.md,
    borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: `${colors.green}25`,
  },
  allReadText: { fontSize: font.sm, color: colors.green, fontWeight: '600' },

  msgCard: {
    backgroundColor: '#fff', marginHorizontal: spacing.lg, marginTop: spacing.md,
    borderRadius: radius.xl, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
  },
  row:       { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: spacing.lg, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowUnread: { backgroundColor: `${colors.blue}04` },
  rowLast:   { borderBottomWidth: 0 },
  avatarWrap: { position: 'relative', marginTop: 2 },
  avatar:     { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  avatarTxt:  { color: '#fff', fontWeight: '700', fontSize: font.sm },
  typeIcon:   { position: 'absolute', bottom: -2, right: -2, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff' },
  msgBody:    { flex: 1 },
  msgTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  company:    { fontSize: font.sm, color: colors.text2, fontWeight: '500', flex: 1 },
  companyBold:{ color: colors.text1, fontWeight: '700' },
  time:       { fontSize: 11, color: colors.text3, marginLeft: 8 },
  roleTxt:    { fontSize: font.base, color: colors.text2, fontWeight: '500', marginBottom: 3 },
  roleBold:   { color: colors.text1, fontWeight: '700' },
  preview:    { fontSize: font.sm, color: colors.text3, lineHeight: 18 },
  dot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.blue, marginTop: 18 },

  appsScroll: { padding: spacing.lg, paddingBottom: 32, gap: spacing.md },

  summaryBar: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  summaryCell:  { flex: 1, alignItems: 'center', paddingVertical: 12 },
  summaryNum:   { fontSize: font.md, fontWeight: '800' },
  summaryLabel: { fontSize: 10, color: colors.text3, fontWeight: '500', marginTop: 2 },

  appCard: { backgroundColor: '#fff', borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: 10 },
  appTop:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appAvatar:    { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  appAvatarTxt: { color: '#fff', fontWeight: '700', fontSize: font.sm },
  appRole: { fontSize: font.base, fontWeight: '700', color: colors.text1 },
  appCo:   { fontSize: font.sm, color: colors.text3, marginTop: 1 },
  stageBadge:    { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4 },
  stageBadgeTxt: { fontSize: 11, fontWeight: '700' },

  track:    { flexDirection: 'row' },
  trackSeg: { flex: 1, height: 4, borderRadius: 2 },

  appNote: { fontSize: font.sm, color: colors.text2, lineHeight: 19 },

  appFooter:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appliedAgo: { fontSize: 11, color: colors.text3 },
  actionBtn:  { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  actionTxt:  { fontSize: font.sm, fontWeight: '700' },

  sectionLabel: { fontSize: font.sm, fontWeight: '700', color: colors.text3, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
})
