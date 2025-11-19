import React from "react";

/**
 * PUBLIC_INTERFACE
 * ReviewsList component renders a vertical list of reviews.
 * Props:
 *  - reviews: array of {name, rating, comment, date}
 */
function ReviewsList({ reviews }) {
  if (!reviews || !reviews.length)
    return (
      <div style={{
        color: "var(--text)",
        fontWeight: 500,
        fontSize: "1.06em",
        padding: "1em 0"
      }}>
        No reviews yet.
      </div>
    );

  return (
    <ul style={{
      paddingLeft: 0,
      margin: 0,
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: "1.3em"
    }}>
      {reviews.map((r, idx) => (
        <li
          key={r.id || idx}
          className="ocean-card ocean-rounded-md ocean-shadow"
          style={{
            padding: "1.2em 1.1em",
            background: "var(--surface)",
            display: "flex",
            gap: "1.08em",
            alignItems: "flex-start",
            border: "1px solid var(--border-color, #e0e2f9)",
            boxShadow: "var(--shadow)",
            width: "100%"
          }}
        >
          {/* Avatar */}
          <div aria-hidden="true" style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "var(--gradient-start, #a78bfa30)",
            color: "var(--secondary)",
            fontWeight: 700,
            fontSize: "1.4em",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            {(r.name || "?").charAt(0).toUpperCase()}
          </div>
          {/* Main content */}
          <div style={{
            flex: 1,
            overflow: "hidden"
          }}>
            <span style={{
              fontWeight: 700,
              fontSize: "1.06em",
              color: "var(--text)",
              marginRight: "0.6em"
            }}>{r.name || "Anonymous"}</span>
            <span aria-label={`Rated ${r.rating} out of 5`} title={`${r.rating} / 5`} style={{
              color: "var(--primary)",
              fontWeight: 600,
              fontSize: "1.10em"
            }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ opacity: i < r.rating ? 1 : 0.2 }}>★</span>
              ))}
            </span>
            <span style={{
                float:"right",
                color: "var(--text)",
                opacity: 0.59,
                fontSize: ".97em",
            }}>
              {r.date}
            </span>
            <div style={{
              marginTop: ".45em",
              color: "var(--text)",
              fontSize: "1.06em",
              opacity: 0.97,
              overflowWrap: "anywhere"
            }}>
              {r.comment}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ReviewsList;
