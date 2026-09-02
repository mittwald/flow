import { createContext, useContext } from "react";

interface RatingSegmentContext {
  /** The one-based position of the segment inside the rating. */
  value: number;
  /** The total number of segments of the rating. */
  count: number;
}

const ratingSegmentContext = createContext<RatingSegmentContext>({
  value: 1,
  count: 1,
});

export const useRatingSegmentContext = (): RatingSegmentContext =>
  useContext(ratingSegmentContext);

export const RatingSegmentContextProvider = ratingSegmentContext.Provider;
