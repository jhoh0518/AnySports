import { AppDataSnapshot } from '../types/domain';
import { mockSnapshot } from '../data/mockData';

export interface SportsDataProvider {
  getSnapshot(): Promise<AppDataSnapshot>;
  refresh(): Promise<AppDataSnapshot>;
}

class MockSportsDataProvider implements SportsDataProvider {
  async getSnapshot(): Promise<AppDataSnapshot> {
    return mockSnapshot;
  }

  async refresh(): Promise<AppDataSnapshot> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return mockSnapshot;
  }
}

// Supabase 연결 단계에서는 이 인스턴스만 SupabaseSportsDataProvider로 교체합니다.
// 화면과 상태 로직은 데이터 출처를 알 필요가 없습니다.
export const sportsDataProvider: SportsDataProvider = new MockSportsDataProvider();

