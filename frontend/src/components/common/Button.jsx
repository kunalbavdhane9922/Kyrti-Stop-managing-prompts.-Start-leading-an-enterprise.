import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  iconRight: IconRight, 
  loading = false, 
  fullWidth = false, 
  className = '', 
  ...props 
}, ref) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' ? `btn-${size}` : '',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button ref={ref} className={classes} disabled={loading} {...props}>
      {loading ? (
        <span className="sovereign-loader" style={{marginRight: '8px'}} />
      ) : Icon ? (
        <Icon className="mr-2" size={size === 'sm' ? 14 : 16} />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="ml-2" size={size === 'sm' ? 14 : 16} />}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
