import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  "inline-flex items-center justify-center text-muted-foreground transition-all",
  {
    variants: {
      variant: {
        solid: "p-1 bg-gray-100/80 rounded-xl",
        underlined:
          "w-full justify-start rounded-none bg-transparent p-0 border-b border-gray-200",
        bordered: "p-1 border border-gray-200 bg-white rounded-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "solid",
      fullWidth: false,
    },
  }
);

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
  VariantProps<typeof tabsListVariants> { }

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, fullWidth, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, fullWidth }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;



const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "rounded-lg px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-sm hover:text-gray-900",
        underlined:
          "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-pink-600 data-[state=active]:text-pink-600 hover:text-pink-600/80",
        bordered:
          "rounded-lg px-3 py-1.5 hover:bg-gray-50 data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700 data-[state=active]:border-pink-200",
      },
      size: {
        sm: "text-xs h-8",
        md: "text-sm h-10",
        lg: "text-base h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
  VariantProps<typeof tabsTriggerVariants> {
  icon?: React.ReactNode;
}

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  >
    {icon && <span className="mr-2 h-4 w-4 flex items-center">{icon}</span>}
    {children}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;


const tabsContentVariants = cva(
  "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      animation: {
        fade: "animate-in fade-in-0 zoom-in-95 duration-200",
        slide: "animate-in slide-in-from-left-2 fade-in duration-300",
        none: "",
      },
    },
    defaultVariants: {
      animation: "fade",
    },
  }
);

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
  VariantProps<typeof tabsContentVariants> { }

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, animation, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ animation }), className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };