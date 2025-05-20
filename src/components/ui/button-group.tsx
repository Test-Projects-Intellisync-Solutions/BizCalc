import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the button group
   * @default "outline"
   */
  variant?: 'outline' | 'solid' | 'ghost';
  /**
   * The size of the buttons in the group
   * @default "default"
   */
  size?: 'sm' | 'default' | 'lg' | 'icon';
  /**
   * The orientation of the button group
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Whether the buttons should take up the full width of their container
   * @default false
   */
  fullWidth?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({
    className,
    variant = 'outline',
    size = 'default',
    orientation = 'horizontal',
    fullWidth = false,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          {
            'flex-col': orientation === 'vertical',
            'w-full': fullWidth,
          },
          className
        )}
        role="group"
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement, {
              variant: child.props.variant || variant,
              size: child.props.size || size,
              className: cn(
                'rounded-none first:rounded-l-md last:rounded-r-md first:rounded-r-none last:rounded-l-none',
                orientation === 'vertical' && 'first:rounded-t-md last:rounded-b-md first:rounded-b-none last:rounded-t-none',
                orientation === 'vertical' ? 'w-full' : 'h-full',
                child.props.className
              ),
            });
          }
          return child;
        })}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export { ButtonGroup };
