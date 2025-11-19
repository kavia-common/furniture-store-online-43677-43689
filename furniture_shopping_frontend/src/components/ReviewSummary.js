import React from "react";

/**
 * PUBLIC_INTERFACE
 * ReviewSummary component displays average rating, rating count, and a rating distribution bar.
 * Props:
 * - reviews: array of {rating: Number, ...}
 */
function ReviewSummary({ reviews = [] }) {
  const count = reviews.length;
  if (count === 0) {
    return (
      <div style={{ padding: "1.2em 0 1.4em" }}>
        <span style={{
          color: "var(--text)",
          fontSize: "1.09em"
        }}>No reviews yet.</span>
      </div>
    );
  }
  const avg =
    Math.round(
      (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / count) * 10
    ) / 10;

  // Distribution: {5: n, 4: n, ...}
  const ratingDist = {};
  for (let i = 1; i <= 5; ++i) ratingDist[i] = 0;
  reviews.forEach((r) => ratingDist[Number(r.rating)]++);
  const maxNum = Math.max(...Object.values(ratingDist), 1);

  return (
    <div style={{
      padding: "1.2em 0 0.7em",
      borderBottom: "1.5px solid var(--border-color, #d2d2ea)",
      marginBottom: "1.5em"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.85em",
        marginBottom: ".35em"
      }}>
        <span title={`Average rating: ${avg}`} style={{
            fontWeight: 700,
            fontSize: "2.55em",
            color: "var(--primary)",
            lineHeight: 1
          }}>
          {avg}
        </span>
        <span style={{
          fontSize: "1.26em",
          fontWeight: 600,
          color: "var(--secondary)"
        }}>★</span>
        <span style={{
          color: "var(--text)",
          fontWeight: 600,
          fontSize: "1.13em"
        }}>
          &middot; {count} review{count !== 1 ? "s" : ""}
        </span>
      </div>
      {/* Distribution graph */}
      <div style={{ maxWidth: 270, marginTop: ".4em" }}>
        {Object.entries(ratingDist)
          .sort((a, b) => b[0] - a[0])
          .map(([rate, n]) => (
            <div
              key={rate}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: ".22em"
              }}
            >
              <span style={{
                width: 26,
                fontWeight: 500,
                fontSize: ".99em",
                color: "var(--text)",
                opacity: 0.88
              }}>{rate}★</span>
              <div style={{
                flex: 1,
                background: "var(--border-color, #dfdeea)",
                borderRadius: 8,
                height: 8,
                margin: "0 .8em"
              }}>
                <div style={{
                  height: 8,
                  borderRadius: 8,
                  width: `${n === 0 ? 5 : (100 * n) / maxNum}%`,
                  background: "var(--primary, #7c3aed)",
                  opacity: 0.62
                }} />
              </div>
              <span style={{
                fontSize: ".96em",
                fontWeight: 500
              }}>{n}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ReviewSummary;
