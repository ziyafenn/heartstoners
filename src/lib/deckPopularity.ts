import type { Tables } from "@/types/supabase.type";

// Define the average metrics
// TODO: get average metrics from database
const averageMetrics = {
  likes: 5,
  copies: 10,
  views: 30,
};

// Define weights for each metric
const weights = {
  likes: 3,
  copies: 2,
  views: 1,
};

type DeckInteraction = Pick<
  Tables<"deck_interactions">,
  "copies" | "views" | "likes"
>;

function calculatePopularityScore(
  deck: DeckInteraction,
  averages = averageMetrics,
  metricWeights = weights
) {
  const { likes, copies, views } = deck;
  const likeScore = (likes / averages.likes) * metricWeights.likes;
  const copyScore = (copies / averages.copies) * metricWeights.copies;
  const viewScore = (views / averages.views) * metricWeights.views;

  const totalScore = likeScore + copyScore + viewScore;
  const maxPossibleScore =
    metricWeights.likes + metricWeights.copies + metricWeights.views;

  // Convert to a 5-point scale
  return (totalScore / maxPossibleScore) * 5;
}

function getPopularityRating(score: number) {
  if (score > 4.5) return 5;
  if (score > 3.5) return 4;
  if (score > 2.5) return 3;
  if (score > 1.5) return 2;
  return 1;
}

export function getDeckPopularity({
  copies = 0,
  likes = 0,
  views = 0,
}: Partial<DeckInteraction>) {
  const score = calculatePopularityScore({ copies, likes, views });
  const rating = getPopularityRating(score);

  return rating;
}
