'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Base sizing & shape
        'peer size-[18px] shrink-0 rounded-[5px] border-[1.5px] shadow-xs',
        // Unchecked surface — clearly visible in both themes
        'border-foreground/25 bg-background',
        'dark:border-foreground/35 dark:bg-card',
        // Hover affordance
        'hover:border-foreground/50 dark:hover:border-foreground/55',
        // Checked surface — brand amber with dark check on top
        'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground',
        'dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary dark:data-[state=checked]:text-primary-foreground',
        // Focus & invalid
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        // Motion
        'transition-colors',
        // Disabled
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
