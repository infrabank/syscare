const { calculateScore } = require('../syscare_v0.1/js/system-check');

describe('calculateScore', () => {
  test('returns low risk with high-scoring configuration', () => {
    const data = {
      employees: '1-10',
      os: ['windows', 'linux'],
      server: '6-10',
      network: 'enterprise',
      backup: 'realtime',
      security: 'enterprise',
      updates: 'automated',
      issues: 'none',
      manager: 'full-time'
    };

    const result = calculateScore(data);

    expect(result).toEqual({
      score: 100,
      riskLevel: 'low',
      recommendations: []
    });
  });

  test('flags high risk when critical safeguards are missing', () => {
    const data = {
      employees: '11-50',
      os: ['windows'],
      server: '2-5',
      network: 'managed',
      backup: 'none',
      security: 'none',
      updates: 'none',
      issues: ['security', 'data'],
      manager: 'none'
    };

    const result = calculateScore(data);

    expect(result.score).toBe(25);
    expect(result.riskLevel).toBe('high');
    expect(result.recommendations).toEqual(
      expect.arrayContaining([
        '⚠️ 즉시 백업 시스템을 구축하세요. 데이터 손실 위험이 매우 높습니다.',
        '⚠️ 기본적인 보안 솔루션을 즉시 도입하세요.',
        '정기적인 시스템 업데이트가 필요합니다.',
        '현재 겪고 있는 문제들을 우선적으로 해결하세요.',
        '전산 관리 담당자를 지정하거나 외부 전문가의 도움을 받으세요.'
      ])
    );
  });

  test('assigns medium risk for partially prepared environments', () => {
    const data = {
      employees: '51-100',
      os: ['windows', 'mac'],
      server: '10+',
      network: 'managed',
      backup: 'manual',
      security: 'firewall',
      updates: 'scheduled',
      issues: ['performance'],
      manager: 'external'
    };

    const result = calculateScore(data);

    expect(result.score).toBe(61);
    expect(result.riskLevel).toBe('medium');
    expect(result.recommendations).toContain('현재 겪고 있는 문제들을 우선적으로 해결하세요.');
  });

  test('treats single-value responses consistently for optional groups', () => {
    const data = {
      employees: '11-50',
      os: 'windows',
      server: '2-5',
      network: 'managed',
      backup: 'daily',
      security: 'firewall',
      updates: 'scheduled',
      issues: 'none',
      manager: 'external'
    };

    const result = calculateScore(data);

    expect(result).toEqual({
      score: 84,
      riskLevel: 'low',
      recommendations: []
    });
  });
});
