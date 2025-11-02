import styles from './Input.module.css';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  suffix,
  size = 'medium',
  className = '',
  ...props
}) => {
  const wrapperClasses = [
    styles.inputWrapper,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  const inputClasses = [
    styles.input,
    error && styles.error,
    suffix && styles.hasSuffix
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {suffix && (
          <div className={styles.suffix}>
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
      {!error && helperText && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
};
