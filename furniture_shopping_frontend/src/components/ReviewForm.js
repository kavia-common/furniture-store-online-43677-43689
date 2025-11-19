import React, { useState, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * ReviewForm component. Controlled form for adding a review (name, rating, comment, optional images).
 * Props:
 *  - onSubmit: function({name, rating, comment, images}) => void
 */
function ReviewForm({ onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    comment: "",
    images: []
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef();

  // Valid image types
  const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_FILES = 3;
  const MAX_SIZE_MB = 4;

  // Validate form fields and images
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
    if (f.images && f.images.length > 0) {
      if (f.images.length > MAX_FILES) {
        errs.images = `You can upload up to ${MAX_FILES} images.`;
      } else {
        for (let i = 0; i < f.images.length; i++) {
          const file = f.images[i];
          if (!IMAGE_TYPES.includes(file.type)) {
            errs.images = "Only JPG, PNG, WEBP, and GIF images are allowed.";
            break;
          }
          if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            errs.images = `Each image must be &lt; ${MAX_SIZE_MB}MB.`;
            break;
          }
        }
      }
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

  // Handle images selection
  function handleFileChange(e) {
    const files = Array.from(e.target.files).slice(0, MAX_FILES);
    setForm(prev => ({
      ...prev,
      images: files
    }));

    // Generate client-side previews (objectURL or base64)
    Promise.all(
      files.map(file => {
        if (typeof window !== "undefined" && window.URL && file.type.startsWith("image/")) {
          // Use object URL for efficient preview
          return Promise.resolve({ url: URL.createObjectURL(file), name: file.name, size: file.size, type: file.type });
        }
        // Fallback: read as data URL (base64)
        return new Promise(res => {
          const reader = new FileReader();
          reader.onload = () => res({ url: reader.result, name: file.name, size: file.size, type: file.type });
          reader.readAsDataURL(file);
        });
      })
    ).then(setImagePreviews);
    setTouched(t => ({ ...t, images: true }));
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

    // Build reviewData, which may contain files (for backend)
    let imagesPayload = form.images;
    // Backend API stub/placeholder if API exists:
    const apiBase = process.env.REACT_APP_API_BASE;
    let reviewPayload;
    if (apiBase) {
      // PREPARE: multi-part form data for backend integration.
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("rating", form.rating);
      formData.append("comment", form.comment);
      imagesPayload.forEach((img, idx) => formData.append("images", img, img.name));
      // Submit to: `${apiBase}/products/:id/reviews`
      // await fetch(`${apiBase}/products/${productId}/reviews`, { method: "POST", body: formData })
      // NOTE: We do not perform actual upload here (requires id/context), just show code is ready.
      reviewPayload = formData; // Placeholder, real usage needs productId and API integration
    } else {
      // Store previews in local state
      reviewPayload = {
        ...form,
        images: imagePreviews.map((im, i) => ({
          url: im.url,
          name: im.name
        }))
      };
    }

    if (onSubmit) {
      // Simulate async for nice UX - can be replaced with real POST
      await Promise.resolve(onSubmit(reviewPayload));
    }
    setSuccess(true);
    setForm({ name: "", rating: 0, comment: "", images: [] });
    setTouched({});
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => setSuccess(false), 2000);
  }

  function removePreview(idx) {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    setTouched(t => ({ ...t, images: true }));
    if (fileInputRef.current && fileInputRef.current.files.length === 0) fileInputRef.current.value = "";
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

        {/* Image upload field */}
        <label style={{ fontWeight: 600 }} htmlFor="reviewform-images">
          Add up to 3 images (optional)
        </label>
        <input
          type="file"
          id="reviewform-images"
          name="images"
          accept=".png,.jpg,.jpeg,.webp,.gif"
          multiple
          ref={fileInputRef}
          aria-describedby="reviewform-images-desc"
          aria-label="Attach product images"
          onChange={handleFileChange}
          max={MAX_FILES}
          style={{
            background: "none",
            border: 0,
            marginBottom: ".25em"
          }}
        />
        <div id="reviewform-images-desc" style={{fontSize:".97em", opacity:0.83, marginBottom:".07em"}}>
          Supported: JPG, PNG, WEBP, GIF, max {MAX_FILES} images, {MAX_SIZE_MB}MB each.
        </div>
        {touched.images && errors.images && (
          <div style={{color: "var(--error)", fontSize: ".95em"}} role="alert">
            {errors.images}
          </div>
        )}
        {/* Previews */}
        {imagePreviews.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(78px,1fr))",
            gap: ".7em",
            marginTop: "0.3em"
          }}>
            {imagePreviews.map((img, i) => (
              <div key={i} style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                background: "var(--background,#f0f0f0)",
                border: "1.5px solid var(--border-color,#e3e9fd)",
                outline: "none"
              }}>
                <img
                  src={img.url}
                  alt={`Preview of selected review image #${i + 1}`}
                  style={{ width: "100%", height: "70px", objectFit: "cover", display:"block" }}
                  tabIndex={0}
                />
                <button
                  type="button"
                  aria-label={`Remove image #${i + 1}`}
                  onClick={() => removePreview(i)}
                  style={{
                    position: "absolute",
                    top: 7,
                    right: 7,
                    background: "rgba(37,63,253,0.78)",
                    color: "#fff",
                    border: "none",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    fontSize: "1em",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 2px 8px #141c2f27"
                  }}
                  tabIndex={0}
                >×</button>
              </div>
            ))}
          </div>
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
