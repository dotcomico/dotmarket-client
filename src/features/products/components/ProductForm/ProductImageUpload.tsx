interface ProductImageUploadProps {
  label: string;
  /** Existing URL or object URL; `null` shows the dropzone instead. */
  preview: string | null;
  previewAlt: string;
  accept: string;
  icon: string;
  placeholder: string;
  hint: string;
  removeLabel: string;
  disabled?: boolean;
  /** Renders the "360°" corner badge over the preview. */
  showBadge?: boolean;
  previewClassName?: string;
  dropzoneClassName?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

/**
 * One image slot: dropzone when empty, preview with a remove button when
 * filled. Validation lives in the parent — this only reports the picked file.
 *
 * Styling comes from the parent's `ProductForm.css` (global stylesheet).
 */
export const ProductImageUpload = ({
  label,
  preview,
  previewAlt,
  accept,
  icon,
  placeholder,
  hint,
  removeLabel,
  disabled = false,
  showBadge = false,
  previewClassName,
  dropzoneClassName,
  onSelect,
  onRemove
}: ProductImageUploadProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelect(file);
    }
  };

  return (
    <div className="product-form__image-section">
      <label className="product-form__label">{label}</label>
      <div className="product-form__image-upload">
        {preview ? (
          <div className={`product-form__image-preview${previewClassName ? ` ${previewClassName}` : ''}`}>
            <img src={preview} alt={previewAlt} />
            <button
              type="button"
              className="product-form__image-remove"
              onClick={onRemove}
              aria-label={removeLabel}
            >
              ×
            </button>
            {showBadge && <span className="product-form__360-badge">360°</span>}
          </div>
        ) : (
          <label className={`product-form__image-dropzone${dropzoneClassName ? ` ${dropzoneClassName}` : ''}`}>
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              disabled={disabled}
            />
            <div className="product-form__image-placeholder">
              <span className="product-form__image-icon">{icon}</span>
              <span>{placeholder}</span>
              <span className="product-form__image-hint">{hint}</span>
            </div>
          </label>
        )}
      </div>
    </div>
  );
};
