import { StarRating } from '#/components/ui/star-rating'
import { Skeleton } from '#/components/ui/skeleton'
import { useReviews } from '#/hooks/use-reviews'
import type { ReviewWithProfile } from '#/hooks/use-reviews'

type ReviewListProps = {
  productId: string
}

export function ReviewList({ productId }: ReviewListProps) {
  const { data: reviews, isLoading } = useReviews(productId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-xl border border-brand-gray-100 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="rounded-xl border border-brand-gray-100 bg-brand-gray-50 p-8 text-center">
        <p className="text-sm text-brand-gray-400">No reviews yet. Be the first to review this product.</p>
      </div>
    )
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="font-display text-3xl uppercase text-brand-black">
          {avgRating.toFixed(1)}
        </span>
        <div className="flex flex-col gap-1">
          <StarRating rating={Math.round(avgRating)} size="md" />
          <span className="text-xs text-brand-gray-400">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewWithProfile }) {
  const initials = review.profiles?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??'

  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="rounded-xl border border-brand-gray-100 p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gray-100 text-xs font-bold text-brand-black">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-brand-black">
            {review.profiles?.full_name ?? 'Anonymous'}
          </span>
          <span className="text-[10px] text-brand-gray-400">{date}</span>
        </div>
        <div className="ml-auto">
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>

      {review.comment && (
        <p className="text-sm leading-relaxed text-brand-gray-700">{review.comment}</p>
      )}
    </div>
  )
}
