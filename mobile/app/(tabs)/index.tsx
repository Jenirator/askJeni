import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, radius, spacing, font, companyColor } from '@/lib/theme'

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
    id: '1',
    type: 'interest',
    company: 'Peach Payments',
    role: 'Junior Software Engineer',
    preview: "We reviewed your Skills Passport and think you'd be a great fit. We'd love to chat.",
    time: '2h ago',
    unread: true,
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

const TYPE_CONFIG: Record<MessageType, { icon: React.ComponentProps<typeof Ionicons>['name']; color: string; label: string }> = {
  interest:  { icon: 'star-outline',        color: colors.yellow,  label: 'Interested' },
  interview: { icon: 'videocam-outline',     color: colors.blue,    label: 'Interview' },
  update:    { icon: 'document-text-outline',color: colors.text3,   label: 'Update' },
  offer:     { icon: 'trophy-outline',       color: colors.green,   label: 'Offer' },
}

export default function InboxScreen() {
  const [messages, setMessages] = useState(MESSAGES)
  const unreadCount = messages.filter(m => m.unread).length

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
          {unreadCount > 0 && (
            <Text style={s.unreadSub}>{unreadCount} new message{unreadCount !== 1 ? 's' : ''}</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={s.markAllBtn}>
            <Text style={s.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty unread banner */}
      {unreadCount === 0 && (
        <View style={s.allReadBanner}>
          <Ionicons name="checkmark-circle" size={16} color={colors.green} />
          <Text style={s.allReadText}>You're all caught up</Text>
        </View>
      )}

      {/* Message list */}
      <View style={s.list}>
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
              {/* Avatar */}
              <View style={s.avatarWrap}>
                <View style={[s.avatar, { backgroundColor: col }]}>
                  <Text style={s.avatarText}>{abbr}</Text>
                </View>
                <View style={[s.typeIcon, { backgroundColor: cfg.color }]}>
                  <Ionicons name={cfg.icon} size={9} color="#fff" />
                </View>
              </View>

              {/* Content */}
              <View style={s.content}>
                <View style={s.contentTop}>
                  <Text style={[s.company, msg.unread && s.companyUnread]} numberOfLines={1}>
                    {msg.company}
                  </Text>
                  <Text style={s.time}>{msg.time}</Text>
                </View>
                <Text style={[s.role, msg.unread && s.roleUnread]} numberOfLines={1}>
                  {msg.role}
                </Text>
                <Text style={s.preview} numberOfLines={2}>{msg.preview}</Text>
              </View>

              {/* Unread dot */}
              {msg.unread && <View style={s.unreadDot} />}
            </TouchableOpacity>
          )
        })}
      </View>

      {/* CTA if no unread */}
      {unreadCount === 0 && (
        <View style={s.footer}>
          <View style={s.footerCard}>
            <Ionicons name="rocket-outline" size={22} color={colors.blue} />
            <Text style={s.footerTitle}>Get more employer interest</Text>
            <Text style={s.footerSub}>Complete your Skills Passport and add a video intro to stand out.</Text>
          </View>
        </View>
      )}

    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    backgroundColor: colors.navy,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: 24,
  },
  pageTitle:  { color: '#fff', fontSize: font.xl, fontWeight: '800' },
  unreadSub:  { color: colors.yellow, fontSize: font.sm, fontWeight: '600', marginTop: 2 },
  markAllBtn: { paddingTop: 4 },
  markAllText:{ color: 'rgba(255,255,255,0.45)', fontSize: font.sm, fontWeight: '600' },

  allReadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.green}12`,
    marginHorizontal: spacing.lg,
    marginTop: -14,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: `${colors.green}25`,
  },
  allReadText: { fontSize: font.sm, color: colors.green, fontWeight: '600' },

  list: {
    backgroundColor: '#fff',
    marginHorizontal: spacing.lg,
    marginTop: -14,
    borderRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowUnread: { backgroundColor: `${colors.blue}04` },
  rowLast:   { borderBottomWidth: 0 },

  avatarWrap: { position: 'relative', marginTop: 2 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: font.sm },
  typeIcon: {
    position: 'absolute',
    bottom: -2, right: -2,
    width: 16, height: 16,
    borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },

  content:    { flex: 1 },
  contentTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  company:       { fontSize: font.sm, color: colors.text2, fontWeight: '500', flex: 1 },
  companyUnread: { color: colors.text1, fontWeight: '700' },
  time:          { fontSize: 11, color: colors.text3, marginLeft: 8 },
  role:          { fontSize: font.base, color: colors.text2, fontWeight: '500', marginBottom: 3 },
  roleUnread:    { color: colors.text1, fontWeight: '700' },
  preview:       { fontSize: font.sm, color: colors.text3, lineHeight: 18 },

  unreadDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.blue,
    marginTop: 18,
  },

  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  footerCard: {
    backgroundColor: '#fff',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerTitle: { fontSize: font.base, fontWeight: '700', color: colors.text1 },
  footerSub:   { fontSize: font.sm, color: colors.text3, textAlign: 'center', lineHeight: 18 },
})
