import styles from './Card.module.css';

export const Card = ({
  children,
  variant = 'default',
  padding = 'default',
  interactive = false,
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    padding === 'compact' && styles.compact,
    padding === 'spacious' && styles.spacious,
    interactive && styles.interactive,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};
