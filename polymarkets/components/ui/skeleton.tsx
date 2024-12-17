import { cn } from "@/lib/utils"
import React from "react"

// interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

// const Card = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement>
// >(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "rounded-xl border bg-card text-card-foreground shadow",
//       className
//     )}
//     {...props}
//   />
// ))
// Card.displayName = "Card"

// export function Skeleton({ className, ...props }) {
//   return (
//     <div
//       className={cn("animate-pulse rounded-md bg-muted", className)}
//       {...props}
//       role="status"
//       aria-label="Loading..."
//     />
//   )
// }


export const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
      <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
      role="status"
      aria-label="Loading..."
    />
))
Skeleton.displayName = "Skeleton"