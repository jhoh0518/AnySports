import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LeagueMark } from '../components/LeagueMark';
import { ScreenHeader } from '../components/ScreenHeader';
import { SettingsRow } from '../components/SettingsRow';
import { useAppState } from '../state/AppState';
import { colors, radii } from '../theme';
import { ContentLeagueId, FollowedEntity, LeagueId } from '../types/domain';

const leagueOrder: ContentLeagueId[] = ['epl', 'lck', 'f1'];

export function SettingsScreen() {
  const { data, preferences, updatePreferences, toggleFollow, setSelectedLeague } = useAppState();
  const [interestOpen, setInterestOpen] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState(false);
  const followedEntities = data.entities.filter((entity) => preferences.followedEntityIds.includes(entity.id));

  const chooseDefault = (league: LeagueId) => {
    updatePreferences({ defaultLeague: league });
    setSelectedLeague(league);
    setDefaultOpen(false);
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="PERSONALIZE" title="설정" />

        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>AS</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>AnySports 사용자</Text>
            <Text style={styles.profileCaption}>개인 프로토타입 · 로컬 모드</Text>
          </View>
          <View style={styles.localPill}><View style={styles.localDot} /><Text style={styles.localText}>LOCAL</Text></View>
        </View>

        <Text style={styles.sectionLabel}>관심 스포츠</Text>
        <View style={styles.teamGrid}>
          {followedEntities.filter((entity) => entity.role !== 'observer').map((entity) => (
            <View key={entity.id} style={styles.teamCard}>
              <LeagueMark leagueId={entity.leagueId} size={32} />
              <View style={{ flex: 1 }}><Text numberOfLines={1} style={styles.teamTitle}>{entity.name}</Text><Text style={styles.teamRole}>{entity.role === 'constructor' ? '컨스트럭터' : '팀'}</Text></View>
              <View style={[styles.entityDot, { backgroundColor: entity.color }]} />
            </View>
          ))}
          <Pressable onPress={() => setInterestOpen(true)} style={({ pressed }) => [styles.addTeam, pressed && styles.pressed]}>
            <Text style={styles.addIcon}>＋</Text><Text style={styles.addText}>관심 설정 편집</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>홈</Text>
        <View style={styles.group}>
          <SettingsRow title="시작 화면" subtitle="앱을 열 때 먼저 보이는 카테고리" icon="⌂" onPress={() => setDefaultOpen(true)} trailing={preferences.defaultLeague === 'all' ? '전체' : data.leagues.find((l) => l.id === preferences.defaultLeague)?.name} />
          <SettingsRow title="새 소식 알림" subtitle="관심 팀의 새 기사와 일정 변경" icon="●" value={preferences.newsNotifications} onValueChange={(value) => updatePreferences({ newsNotifications: value })} />
        </View>

        <Text style={styles.sectionLabel}>캘린더</Text>
        <View style={styles.group}>
          <SettingsRow title="캘린더 동기화" subtitle="기기 캘린더 연동은 데이터 연결 단계에서 활성화됩니다" icon="□" value={preferences.calendarSync} onValueChange={(value) => updatePreferences({ calendarSync: value })} />
          <SettingsRow title="경기 전 알림" subtitle="경기 시작 30분 전에 알려줍니다" icon="◷" value={preferences.eventReminder} onValueChange={(value) => updatePreferences({ eventReminder: value })} />
        </View>

        <Text style={styles.sectionLabel}>데이터</Text>
        <View style={styles.group}>
          <SettingsRow title="데이터 소스" subtitle="현재 샘플 데이터 · 추후 Supabase 연결" icon="◇" trailing="로컬" />
          <SettingsRow title="수집 주기" subtitle="백엔드가 새 일정과 소식을 확인하는 주기" icon="↻" trailing="1시간" />
          <SettingsRow title="앱 버전" icon="i" trailing="0.1.0" />
        </View>

        <View style={styles.securityBox}>
          <Text style={styles.securityTitle}>SECURITY NOTE</Text>
          <Text style={styles.securityCopy}>모바일 앱에는 공개용 Supabase 키만 사용합니다. 데이터베이스 비밀번호와 관리자 키는 앱에 포함하지 않습니다.</Text>
        </View>
      </ScrollView>

      <InterestModal visible={interestOpen} entities={data.entities} selectedIds={preferences.followedEntityIds} onToggle={toggleFollow} onClose={() => setInterestOpen(false)} />

      <Modal visible={defaultOpen} transparent animationType="fade" onRequestClose={() => setDefaultOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setDefaultOpen(false)} />
        <View style={styles.centerCard}>
          <Text style={styles.modalTitle}>시작 화면</Text>
          <Text style={styles.modalCaption}>앱을 열었을 때 선택할 카테고리입니다.</Text>
          {(['all', 'epl', 'lck', 'f1'] as LeagueId[]).map((league) => {
            const selected = preferences.defaultLeague === league;
            return (
              <Pressable key={league} onPress={() => chooseDefault(league)} style={[styles.option, selected && styles.optionSelected]}>
                {league === 'all' ? <Text style={styles.allMark}>전체</Text> : <LeagueMark leagueId={league} size={31} />}
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{league === 'all' ? '모든 스포츠 통합' : data.leagues.find((item) => item.id === league)?.name}</Text>
                <Text style={selected ? styles.checkSelected : styles.check}>{selected ? '●' : '○'}</Text>
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </>
  );
}

interface InterestModalProps {
  visible: boolean;
  entities: FollowedEntity[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

function InterestModal({ visible, entities, selectedIds, onToggle, onClose }: InterestModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalScreen}>
        <View style={styles.modalHeader}>
          <View><Text style={styles.modalEyebrow}>FOLLOWING</Text><Text style={styles.interestTitle}>관심 설정</Text></View>
          <Pressable onPress={onClose} style={styles.done}><Text style={styles.doneText}>완료</Text></Pressable>
        </View>
        <Text style={styles.interestHelp}>팀은 여러 개 선택할 수 있습니다. 리그 전체 소식이 필요하다면 ‘관찰자’를 선택하세요.</Text>
        <ScrollView contentContainerStyle={styles.interestContent}>
          {leagueOrder.map((league) => (
            <View key={league} style={styles.leagueGroup}>
              <View style={styles.leagueTitleRow}>
                <LeagueMark leagueId={league} size={36} />
                <Text style={styles.leagueTitle}>{league === 'epl' ? '프리미어리그' : league === 'lck' ? 'LCK' : 'Formula 1'}</Text>
              </View>
              {entities.filter((entity) => entity.leagueId === league).map((entity) => {
                const selected = selectedIds.includes(entity.id);
                return (
                  <Pressable key={entity.id} onPress={() => onToggle(entity.id)} style={[styles.entityRow, entity.role === 'observer' && styles.observerRow, selected && styles.entityRowSelected]}>
                    <View style={[styles.entityBadge, { backgroundColor: entity.color }]}><Text style={[styles.entityShort, entity.color === '#E9EEF5' && { color: colors.background }]}>{entity.shortName.slice(0, 3)}</Text></View>
                    <View style={{ flex: 1 }}><Text style={styles.entityName}>{entity.name}</Text><Text style={styles.entityType}>{entity.role === 'observer' ? '리그 전체 소식 · 전체 일정 선택 가능' : entity.role === 'constructor' ? '컨스트럭터' : '팀'}</Text></View>
                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>{selected ? <Text style={styles.tick}>✓</Text> : null}</View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 36 },
  profileCard: { marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: radii.lg, padding: 15, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#06110D', fontWeight: '900' },
  profileName: { color: colors.text, fontSize: 15, fontWeight: '900' },
  profileCaption: { color: colors.textMuted, fontSize: 10, marginTop: 4 },
  localPill: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 5, borderRadius: radii.pill, backgroundColor: colors.mintSoft },
  localDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.mint },
  localText: { color: colors.mint, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  sectionLabel: { color: colors.textSubtle, fontSize: 9, letterSpacing: 1.6, fontWeight: '900', marginHorizontal: 20, marginTop: 25, marginBottom: 9 },
  teamGrid: { marginHorizontal: 20, gap: 8 },
  teamCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border },
  teamTitle: { color: colors.text, fontSize: 13, fontWeight: '800' },
  teamRole: { color: colors.textMuted, fontSize: 9, marginTop: 3 },
  entityDot: { width: 8, height: 8, borderRadius: 4 },
  addTeam: { minHeight: 46, borderRadius: radii.md, borderWidth: 1, borderStyle: 'dashed', borderColor: '#355247', flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' },
  addIcon: { color: colors.mint, fontSize: 17 },
  addText: { color: colors.mint, fontSize: 12, fontWeight: '800' },
  pressed: { opacity: 0.65 },
  group: { marginHorizontal: 20, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  securityBox: { marginHorizontal: 20, marginTop: 25, borderRadius: radii.md, padding: 14, backgroundColor: '#10181D', borderWidth: 1, borderColor: '#22313A' },
  securityTitle: { color: colors.mint, fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  securityCopy: { color: colors.textMuted, fontSize: 10, lineHeight: 16, marginTop: 7 },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.68)' },
  centerCard: { position: 'absolute', left: 22, right: 22, top: '24%', padding: 20, backgroundColor: colors.surfaceRaised, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  modalCaption: { color: colors.textMuted, fontSize: 11, marginTop: 5, marginBottom: 15 },
  option: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 11, borderRadius: 13 },
  optionSelected: { backgroundColor: colors.mintSoft },
  allMark: { width: 31, textAlign: 'center', color: colors.textMuted, fontSize: 11, fontWeight: '900' },
  optionText: { flex: 1, color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  optionTextSelected: { color: colors.text },
  check: { color: colors.textSubtle, fontSize: 17 },
  checkSelected: { color: colors.mint, fontSize: 17 },
  modalScreen: { flex: 1, backgroundColor: colors.background, paddingTop: 42 },
  modalHeader: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalEyebrow: { color: colors.mint, fontSize: 9, letterSpacing: 1.5, fontWeight: '900' },
  interestTitle: { color: colors.text, fontSize: 27, fontWeight: '900', marginTop: 4 },
  done: { backgroundColor: colors.mint, borderRadius: 13, paddingHorizontal: 16, paddingVertical: 10 },
  doneText: { color: '#06110D', fontSize: 12, fontWeight: '900' },
  interestHelp: { color: colors.textMuted, fontSize: 11, lineHeight: 18, marginHorizontal: 20, marginTop: 16 },
  interestContent: { padding: 20, paddingBottom: 40 },
  leagueGroup: { marginBottom: 26 },
  leagueTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  leagueTitle: { color: colors.text, fontSize: 17, fontWeight: '900' },
  entityRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 10, marginBottom: 7, borderRadius: 15, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  entityRowSelected: { borderColor: '#3E735F', backgroundColor: '#101D19' },
  observerRow: { marginTop: 4, borderStyle: 'dashed' },
  entityBadge: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  entityShort: { color: colors.white, fontSize: 9, fontWeight: '900' },
  entityName: { color: colors.text, fontSize: 13, fontWeight: '800' },
  entityType: { color: colors.textMuted, fontSize: 9, marginTop: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1, borderColor: colors.textSubtle, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: colors.mint, borderColor: colors.mint },
  tick: { color: '#06110D', fontWeight: '900', fontSize: 13 },
});
