import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * ReviewForm component. Controlled form for adding a review (name, rating, comment).
 * Props:
 *  - onSubmit: function({name, rating, comment}) => void
 */
function ReviewForm({ onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    comment: ""
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);

  function validate(f) {
    const errs = {};
    if (!f.name || f.name.trim().length < 1) {
      errs.name = "Name is required";
    }
    if (!f.rating || f.rating < 1 || f.rating > 5) {
      errs.rating = "Please select a rating";
    }
    if (!f.comment || f.comment.trim().length < 4) {
      errs.comment = "Comment should be at least 4 characters";
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value
    }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }

  function handleBlur(e) {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSuccess(false);
      return;
    }
    setErrors({});
    setSuccess(false);
    if (onSubmit) {
      // Simulate async for nice UX - can be replaced with real POST
      await Promise.resolve(onSubmit(form));
    }
    setSuccess(true);
    setForm({ name: "", rating: 0, comment: "" });
    setTouched({});
    setTimeout(() => setSuccess(false), 2000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Leave a review"
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-md)",
        padding: "1.3em 1.1em",
        boxShadow: "var(--shadow),0 1px 2px #7c3aed17",
        border: "1px solid var(--border-color, #e6e3f7)",
        margin: "2em 0 0 0"
      }}
      autoComplete="off"
    >
      <fieldset
        style={{
          border: 0,
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1.05em"
        }}
        disabled={!!submitting}
      >
        <legend style={{
          color: "var(--primary)",
          fontWeight: 700,
          fontSize: "1.24em",
          marginBottom: ".7em"
        }}>Leave a Review</legend>
        <label style={{ fontWeight: 600 }} htmlFor="reviewform-name">
          Name
        </label>
        <input
          id="reviewform-name"
          name="name"
          type="text"
          value={form.name}
          maxLength={30}
          placeholder="Your name"
          required
          className="ocean-surface"
          style={{
            borderRadius: 8,
            padding: "0.68em 0.96em",
            border: "1.5px solid var(--border-color, #bfc3db)",
            fontSize: "1em"
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.name}
        />
        {touched.name && errors.name && (
          <div style={{color:"var(--error)", fontSize:".95em"}} role="alert">{errors.name}</div>
        )}

        <label style={{ fontWeight: 600, marginTop: ".3em" }}>
          Rating
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.42em",
            fontSize: "1.5em",
            marginLeft: "0.2em"
          }}
          role="radiogroup"
          aria-label="Rate 1 to 5 stars"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const val = i + 1;
            return (
              <button
                type="button"
                key={val}
                name="rating"
                tabIndex={0}
                aria-label={`Rate ${val} star${val === 1 ? "" : "s"}`}
                style={{
                  background: "none",
                  border: 0,
                  color:
                    form.rating >= val
                      ? "var(--primary)"
                      : "var(--border-color, #bbb)",
                  cursor: "pointer",
                  outline: "none",
                  padding: 2
                }}
                onClick={() =>
                  setForm((f) => ({ ...f, rating: val }))
                }
                onBlur={handleBlur}
              >
                ★
              </button>
            );
          })}
        </div>
        {touched.rating && errors.rating && (
          <div style={{color:"var(--error)", fontSize:".95em"}} role="alert">{errors.rating}</div>
        )}

        <label style={{ fontWeight: 600 }} htmlFor="reviewform-comment">
          Comment
        </label>
        <textarea
          id="reviewform-comment"
          name="comment"
          value={form.comment}
          placeholder="Write your experience (min 4 characters)…"
          minLength={4}
          maxLength={350}
          rows={4}
          className="ocean-surface"
          style={{
            borderRadius: 8,
            padding: "0.83em 1.1em",
            border: "1.5px solid var(--border-color, #bfc3db)",
            fontSize: "1.04em",
            resize: "vertical"
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.comment}
        />
        {touched.comment && errors.comment && (
          <div style={{color:"var(--error)", fontSize:".95em"}} role="alert">{errors.comment}</div>
        )}

        <button
          className="ocean-btn"
          type="submit"
          disabled={submitting}
          style={{ alignSelf: "flex-start", minWidth: 110, marginTop: "1em" }}
        >
          {submitting ? "Sending..." : "Submit Review"}
        </button>
        {success && (
          <div style={{color:"var(--success)",fontWeight:700,fontSize: "1.05em", marginTop: ".7em"}}>
            Thank you for your review!
          </div>
        )}
      </fieldset>
    </form>
  );
}

export default ReviewForm;
