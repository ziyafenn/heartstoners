import { Tables } from "@/types/supabase.type";

// Define the average metrics
const averageMetrics = {
  likes: 1,
  copies: 1,
  views: 1,
};

// Define weights for each metric
const weights = {
  likes: 3,
  copies: 2,
  views: 1,
};

type DeckInteraction = Pick<Tables<"deck_interactions">, "copies" | "views"> & {
  likes: number;
};

function calculatePopularityScore(
  deck: DeckInteraction,
  averages = averageMetrics,
  metricWeights = weights,
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

export function getDeckPopularity(deck: DeckInteraction) {
  const score = calculatePopularityScore(deck);
  const rating = getPopularityRating(score);

  return rating;
}
