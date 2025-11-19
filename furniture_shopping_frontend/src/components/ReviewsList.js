import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * ReviewsList component renders a vertical list of reviews with optional images.
 * Props:
 *  - reviews: array of {name, rating, comment, date, images}
 */
function ReviewsList({ reviews }) {
  // LIGHTBOX logic: simple modal for full-size view; accessible and keyboard navigable
  const [lightbox, setLightbox] = useState({ open: false, reviewIdx: null, imgIdx: null });
  function openLightbox(reviewIdx, imgIdx) {
    setLightbox({ open: true, reviewIdx, imgIdx });
    setTimeout(() => {
      const elem = document.getElementById("ocean-lightbox-img");
      if (elem) elem.focus();
    }, 150);
  }
  function closeLightbox() {
    setLightbox({ open: false, reviewIdx: null, imgIdx: null });
  }
  function handleKey(e) {
    if (e.key === "Escape") closeLightbox();
    // Arrow navigation if multiple
    if (!lightbox.open) return;
    const review = reviews[lightbox.reviewIdx];
    if (!review?.images) return;
    if (e.key === "ArrowRight") {
      let next = (lightbox.imgIdx + 1) % review.images.length;
      setLightbox({ ...lightbox, imgIdx: next });
    }
    if (e.key === "ArrowLeft") {
      let prev = (lightbox.imgIdx - 1 + review.images.length) % review.images.length;
      setLightbox({ ...lightbox, imgIdx: prev });
    }
  }
  React.useEffect(() => {
    if (lightbox.open) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  });

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
    <>
      {/* LIGHTBOX */}
      {lightbox.open && (() => {
        const review = reviews[lightbox.reviewIdx] || {};
        const img = review.images && review.images[lightbox.imgIdx];
        return img ? (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            style={{
              position: "fixed",
              zIndex: 12010,
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(14,19,27,0.91)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background .2s",
            }}
            onClick={closeLightbox}
          >
            <div
              style={{ position: "relative", outline: "none" }}
              tabIndex={-1}
              aria-modal="true"
            >
              <img
                id="ocean-lightbox-img"
                src={img.url}
                alt={img.name ? img.name : "Review image"}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  borderRadius: 14,
                  objectFit: "contain",
                  boxShadow: "0 8px 64px 10px #232338",
                  border: "4px solid var(--surface,#fff)"
                }}
                tabIndex={0}
                aria-label="Large preview of review image"
                onClick={e => e.stopPropagation()}
                onKeyDown={handleKey}
              />
              <button
                onClick={closeLightbox}
                aria-label="Close image preview"
                style={{
                  position: "absolute",
                  top: 16, right: 18,
                  background: "var(--primary)",
                  color: "#fff",
                  border: 0,
                  borderRadius: "50%",
                  width: 41, height: 41,
                  fontSize: "1.55em",
                  fontWeight: 900,
                  cursor: "pointer",
                  boxShadow: "0 4px 32px #0009"
                }}
                tabIndex={0}
              >×</button>
              {review.images && review.images.length > 1 && (
                <>
                  <button
                    style={{
                      position: "absolute", left: -45, top: "50%",
                      background: "#fff", color: "var(--primary)",
                      fontWeight: 900, border: 0, borderRadius: 21, width: 35, height: 35, fontSize: "1.12em", cursor:"pointer"
                    }}
                    onClick={e => {e.stopPropagation(); setLightbox(l => ({...l, imgIdx: (l.imgIdx - 1 + review.images.length) % review.images.length}))}}
                    aria-label="Previous image"
                    tabIndex={0}
                  >&#8592;</button>
                  <button
                    style={{
                      position: "absolute", right: -45, top: "50%",
                      background: "#fff", color: "var(--primary)",
                      fontWeight: 900, border: 0, borderRadius: 21, width: 35, height: 35, fontSize: "1.12em", cursor:"pointer"
                    }}
                    onClick={e => {e.stopPropagation(); setLightbox(l => ({...l, imgIdx: (l.imgIdx + 1) % review.images.length}))}}
                    aria-label="Next image"
                    tabIndex={0}
                  >&#8594;</button>
                </>
              )}
            </div>
          </div>
        ) : null;
      })()}
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
              {/* Review images */}
              {r.images && Array.isArray(r.images) && r.images.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))",
                    gap: "0.45em",
                    marginTop: "0.65em"
                  }}
                >
                  {r.images.map((img, imgIdx) => (
                    !!img.url && (
                      <button
                        type="button"
                        key={imgIdx}
                        tabIndex={0}
                        onClick={() => openLightbox(idx, imgIdx)}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") openLightbox(idx, imgIdx);
                        }}
                        style={{
                          border: "none",
                          background: "none",
                          padding: 0,
                          margin: 0,
                          borderRadius: 9,
                          cursor: "pointer",
                          boxShadow: "0 2px 8px #7c3aed19",
                          display: "block",
                          aspectRatio: "1 / 1",
                          position: "relative",
                          outline: "none"
                        }}
                        aria-label={`Preview image ${imgIdx + 1} for ${r.name}`}
                        aria-haspopup="dialog"
                        aria-controls="ocean-lightbox-img"
                      >
                        <img
                          src={img.url}
                          alt={img.name ? img.name : `Review image ${imgIdx + 1}`}
                          style={{
                            width: "100%",
                            height: 77,
                            objectFit: "cover",
                            borderRadius: 9,
                            boxShadow: "0 1px 7px #23233817",
                            outline: 0
                          }}
                          loading="lazy"
                        />
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ReviewsList;
