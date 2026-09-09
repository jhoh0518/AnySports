import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LeagueFilter } from '../components/LeagueFilter';
import { LeagueMark } from '../components/LeagueMark';
import { NewsCard } from '../components/NewsCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppState } from '../state/AppState';
import { colors, radii } from '../theme';
import { NewsItem } from '../types/domain';
import { formatRelativeTime, matchesLeague } from '../utils/format';
import { isVisibleForFollowing } from '../utils/visibility';

export function NewsScreen() {
  const { data, preferences, selectedLeague, setSelectedLeague, readNewsIds, markNewsRead } = useAppState();
  const [openItem, setOpenItem] = useState<NewsItem | null>(null);
  const followed = new Set(preferences.followedEntityIds);
  const news = data.news
    .filter((item) => isVisibleForFollowing(item, followed, data.entities))
    .filter((item) => matchesLeague(item, selectedLeague))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const unreadByLeague: Partial<Record<'all' | 'epl' | 'lck' | 'f1', boolean>> = {};
  data.news.forEach((item) => {
    if (!readNewsIds.has(item.id) && isVisibleForFollowing(item, followed, data.entities)) {
      unreadByLeague[item.leagueId] = true;
      unreadByLeague.all = true;
    }
  });

  const open = (item: NewsItem) => {
    markNewsRead(item.id);
    setOpenItem(item);
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="PERSONALIZED FEED" title="스포츠 소식" />
        <LeagueFilter value={selectedLeague} unreadByLeague={unreadByLeague} onChange={setSelectedLeague} />
        <View style={styles.summary}>
          <View>
            <Text style={styles.heading}>나를 위한 소식</Text>
            <Text style={styles.caption}>읽으면 새 소식 표시가 사라집니다</Text>
          </View>
          <Text style={styles.unreadCount}>{news.filter((item) => !readNewsIds.has(item.id)).length} NEW</Text>
        </View>
        <View style={styles.stack}>
          {news.map((item, index) => (
            <NewsCard key={item.id} item={item} featured={index === 0} read={readNewsIds.has(item.id)} onPress={() => open(item)} />
          ))}
          {news.length === 0 ? <Text style={styles.empty}>선택한 리그의 소식이 없습니다.</Text> : null}
        </View>
      </ScrollView>

      <Modal visible={!!openItem} transparent animationType="slide" onRequestClose={() => setOpenItem(null)}>
        <Pressable style={styles.backdrop} onPress={() => setOpenItem(null)} />
        {openItem ? (
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetMeta}>
              <View style={styles.sourceRow}><LeagueMark leagueId={openItem.leagueId} size={30} /><Text style={styles.source}>{openItem.source}</Text></View>
              <Text style={styles.sheetTime}>{formatRelativeTime(openItem.publishedAt)}</Text>
            </View>
            <Text style={styles.sheetTitle}>{openItem.title}</Text>
            <Text style={styles.sheetBody}>{openItem.summary}</Text>
            <View style={styles.prototypeBox}><Text style={styles.prototypeText}>프로토타입에서는 요약만 표시합니다. 데이터 연동 후 원문 열기와 AI 요약이 추가됩니다.</Text></View>
            <Pressable onPress={() => setOpenItem(null)} style={styles.closeButton}><Text style={styles.closeText}>확인</Text></Pressable>
          </View>
        ) : null}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  summary: { marginHorizontal: 20, marginTop: 27, marginBottom: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  heading: { color: colors.text, fontSize: 20, fontWeight: '900' },
  caption: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  unreadCount: { color: colors.mint, fontWeight: '900', fontSize: 10, letterSpacing: 1 },
  stack: { paddingHorizontal: 20, gap: 10 },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: 40 },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.62)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.surfaceRaised, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 22, paddingBottom: 34, borderWidth: 1, borderColor: colors.border },
  handle: { width: 38, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 23 },
  sheetMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sourceRow: { flexDirection: 'row', gap: 9, alignItems: 'center' },
  source: { color: colors.textMuted, fontWeight: '800', fontSize: 12 },
  sheetTime: { color: colors.textSubtle, fontSize: 11 },
  sheetTitle: { color: colors.text, fontWeight: '900', fontSize: 24, lineHeight: 32, letterSpacing: -0.5, marginTop: 22 },
  sheetBody: { color: colors.textMuted, fontSize: 14, lineHeight: 23, marginTop: 13 },
  prototypeBox: { marginTop: 22, borderRadius: radii.md, padding: 13, backgroundColor: colors.mintSoft },
  prototypeText: { color: '#A6DCC8', fontSize: 11, lineHeight: 18 },
  closeButton: { marginTop: 22, borderRadius: 14, backgroundColor: colors.mint, height: 48, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#06110D', fontWeight: '900' },
});
