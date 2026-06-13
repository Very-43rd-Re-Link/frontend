import { RecommendCard, type RecommendCardProps } from '@/features/home/components/recommend/recommend-card';

const recommendationCards: RecommendCardProps[] = [
  {
    title: '추천 1',
    date: '06/10 (일)',
    names: ['김마영', '김바영', '김사영', '김아영'],
    bars: [
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'yellow', 'yellow'],
    ],
    shadow: true,
  },
  {
    title: '추천 2',
    date: '06/09 (토)',
    names: ['김가영', '김나영', '김다영', '김라영'],
    bars: [
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'yellow'],
      ['yellow', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
    ],
    shadow: false,
  },
] as const;

export function RecommendationSection() {
  return (
    <>
      <div className="flex items-end justify-end pr-1">
        <p className="font-display text-md text-black/70 pt-1">추천 더보기</p>
      </div>
      <section className="flex items-start justify-between gap-1">
        {recommendationCards.map((card) => (
          <RecommendCard key={card.title} {...card} />
        ))}
      </section>
    </>
  );
}
