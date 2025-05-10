"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

// Create a context for managing sidebar state
interface SidebarContextType {
  isExpanded: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  storageKey?: string;
}

export function SidebarProvider({
  children,
  storageKey = "sidebar-expanded"
}: SidebarProviderProps) {
  // Use localStorage to persist the sidebar state between page navigations
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initialize state from localStorage after component mounts and check for mobile
  useEffect(() => {
    setIsClient(true);
    const savedState = localStorage.getItem(storageKey);
    if (savedState !== null) {
      setIsExpanded(savedState === 'true');
    }

    // Check if device is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint in Tailwind
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [storageKey]);

  // Toggle sidebar and save state to localStorage
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      const newState = !isExpanded;
      setIsExpanded(newState);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, String(newState));
      }
    }
  };

  // Create the context value
  const contextValue = {
    isExpanded,
    toggleSidebar,
    isMobile,
    mobileOpen,
    setMobileOpen
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

// Base route types for navigation
export type SidebarRoute = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export type SidebarSectionProps = {
  title?: string;
  routes: SidebarRoute[];
}

// Base sidebar props
export type BaseSidebarProps = {
  logo?: {
    icon: React.ReactNode;
    title: string;
    href: string;
  };
  sections: SidebarSectionProps[];
  className?: string;
  mobileSheetTitle?: string;
}

// Navigation item with tooltip support for collapsed state
export function NavItem({
  route,
  isActive,
  isExpanded,
  isMobile,
  onMobileClick
}: {
  route: SidebarRoute;
  isActive: boolean;
  isExpanded: boolean;
  isMobile: boolean;
  onMobileClick?: () => void;
}) {
  // Skip active state for dashboard
  const isDashboardRoute = route.href === '/dashboard';
  const shouldShowActive = isActive && !isDashboardRoute;

  const navItemContent = (
    <Link
      href={route.href}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200",
        "hover:bg-accent/80",
        shouldShowActive
          ? "sidebar-active-link" // Use a global class for active styling
          : "text-foreground",
        isExpanded || isMobile ? "justify-start" : "justify-center"
      )}
      onClick={() => {
        if (isMobile && onMobileClick) {
          onMobileClick();
        }
      }}
    >
      <route.icon className={cn(
        "h-4 w-4 flex-shrink-0",
        shouldShowActive ? "text-primary" : "text-muted-foreground"
      )} />
      {(isExpanded || isMobile) && (
        <span className="text-sm truncate">{route.title}</span>
      )}
      {(isExpanded || isMobile) && route.badge && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {route.badge}
        </span>
      )}
    </Link>
  );

  // Only use tooltips for desktop collapsed state
  if (!isExpanded && !isMobile) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            {navItemContent}
          </TooltipTrigger>
          <TooltipContent side="right">{route.title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return navItemContent;
}
// Base sidebar component
export function Sidebar({ logo, sections, className, mobileSheetTitle = "" }: BaseSidebarProps) {
  const pathname = usePathname();
  const { isExpanded, isMobile, mobileOpen, setMobileOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to check if a route is active - supports exact matches and parent routes
  const isRouteActive = (href: string) => {
    if (!pathname) return false;

    // Never mark dashboard as active
    if (href === '/dashboard') return false;

    // For localized routes like /en/dashboard, we need special handling
    // First, extract the non-localized path (remove /en/ part if present)
    const localePath = pathname.split('/').slice(2).join('/');
    const routePath = href.startsWith('/') ? href.substring(1) : href;

    // Match localized route parts
    // For example, /en/dashboard/tours should match with /dashboard/tours
    if (routePath && localePath.startsWith(routePath)) {
      // Skip dashboard root
      if (routePath === 'dashboard' && localePath === 'dashboard') {
        return false;
      }

      const nextChar = localePath.charAt(routePath.length);
      if (nextChar === '' || nextChar === '/') {
        return true;
      }
    }

    // Direct match (fallback)
    if (pathname === href) return true;

    return false;
  };

  // Calculate sidebar width
  const sidebarWidth = isExpanded ? '13rem' : '3.5rem'; // Reduced from default

  // Content of the sidebar that can be reused in both mobile and desktop
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      {logo && (
        <div className="flex items-center h-14 border-b border-border/40 px-3">
          <Link href={logo.href} className="flex items-center gap-2">
            <div className="bg-primary/10 p-1 rounded-md">
              {logo.icon}
            </div>
            {(isExpanded || isMobile) &&
              <span className="text-lg font-semibold truncate transition-opacity" style={{
                opacity: isExpanded || isMobile ? 1 : 0,
                maxWidth: isExpanded ? '120px' : '0'
              }}>
                {logo.title}
              </span>
            }
          </Link>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 overflow-auto py-3 px-2">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index}>
              {(isExpanded || isMobile) && section.title && (
                <h3 className="px-2 mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-0.5">
                {section.routes.map((route) => (
                  <NavItem
                    key={route.href}
                    route={route}
                    isActive={isRouteActive(route.href)}
                    isExpanded={isExpanded}
                    isMobile={isMobile}
                    onMobileClick={() => setMobileOpen(false)}
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Return the appropriate layout based on device type
  if (!mounted) return null;

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 max-w-[250px]">
          {/* Hidden title for accessibility */}
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "border-r border-border/40 transition-all duration-300 ease-in-out",
        className
      )}
      style={{ width: sidebarWidth }}
    >
      {sidebarContent}
    </div>
  );
}

// Mobile trigger component that can be used outside the sidebar
export function SidebarTrigger() {
  const { setMobileOpen } = useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      className="md:hidden"
      onClick={() => setMobileOpen(true)}
      aria-label="Open sidebar menu"
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Open sidebar menu</span>
    </Button>
  );
}

// Sidebar toggle button component
export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className="rounded-md hover:bg-accent hidden md:flex"
      aria-label="Toggle sidebar"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
      >
        <path
          d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}