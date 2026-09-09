import type { FlatCategory } from '../../../categories';
import type { ProductFormState } from '../../types/product.types';
import type { ProductFormErrors } from '../../utils/productFormValidation';

type FieldChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

interface ProductFormFieldsProps {
  values: ProductFormState;
  errors: ProductFormErrors;
  /** Pre-flattened category tree; `depth` drives the option indentation. */
  categories: FlatCategory[];
  disabled?: boolean;
  onChange: (e: FieldChangeEvent) => void;
}

/**
 * The text/number/select fields of the product form. Fully controlled — it
 * owns no state and does no validation, it just renders values and errors the
 * parent hands it.
 *
 * Styling comes from the parent's `ProductForm.css` (global stylesheet).
 */
export const ProductFormFields = ({
  values,
  errors,
  categories,
  disabled = false,
  onChange
}: ProductFormFieldsProps) => (
  <>
    {/* Name */}
    <div className="product-form__group">
      <label htmlFor="name" className="product-form__label">
        Product Name <span className="required">*</span>
      </label>
      <input
        id="name"
        name="name"
        type="text"
        value={values.name}
        onChange={onChange}
        placeholder="Enter product name"
        disabled={disabled}
        className={errors.name ? 'input--error' : ''}
      />
      {errors.name && (
        <span className="product-form__field-error">{errors.name}</span>
      )}
    </div>

    {/* Description */}
    <div className="product-form__group">
      <label htmlFor="description" className="product-form__label">
        Description
      </label>
      <textarea
        id="description"
        name="description"
        value={values.description}
        onChange={onChange}
        placeholder="Enter product description (optional)"
        rows={3}
        disabled={disabled}
      />
    </div>

    {/* Price & Stock Row */}
    <div className="product-form__row">
      <div className="product-form__group">
        <label htmlFor="price" className="product-form__label">
          Price ($) <span className="required">*</span>
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          value={values.price}
          onChange={onChange}
          placeholder="0.00"
          disabled={disabled}
          className={errors.price ? 'input--error' : ''}
        />
        {errors.price && (
          <span className="product-form__field-error">{errors.price}</span>
        )}
      </div>

      <div className="product-form__group">
        <label htmlFor="stock" className="product-form__label">
          Stock Quantity
        </label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          value={values.stock}
          onChange={onChange}
          placeholder="0"
          disabled={disabled}
          className={errors.stock ? 'input--error' : ''}
        />
        {errors.stock && (
          <span className="product-form__field-error">{errors.stock}</span>
        )}
      </div>
    </div>

    {/* Category */}
    <div className="product-form__group">
      <label htmlFor="categoryId" className="product-form__label">
        Category <span className="required">*</span>
      </label>
      <select
        id="categoryId"
        name="categoryId"
        value={values.categoryId}
        onChange={onChange}
        disabled={disabled}
        className={errors.categoryId ? 'input--error' : ''}
      >
        <option value="">Select a category</option>
        {categories.map(({ category, depth }) => (
          <option key={category.id} value={category.id}>
            {'\u00A0'.repeat(depth * 2)} {depth > 0 ? '↳ ' : ''}{category.name}
          </option>
        ))}
      </select>
      {errors.categoryId && (
        <span className="product-form__field-error">{errors.categoryId}</span>
      )}
    </div>
  </>
);
