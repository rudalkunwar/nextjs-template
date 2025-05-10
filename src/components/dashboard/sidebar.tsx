"use client"

import { LogOut, Mountain, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { BaseSidebarProps, Sidebar as BaseSidebar, useSidebar } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"

// Re-export the types from the base sidebar for convenience
export type { SidebarRoute, SidebarSectionProps } from "@/components/ui/sidebar"

// Define dashboard-specific props that extend the base sidebar props
export type DashboardSidebarProps = BaseSidebarProps & {
  // Add any dashboard-specific props here
}

// Dashboard-specific sidebar component that extends the base sidebar
export function DashboardSidebar({ logo, sections, className, ...props }: DashboardSidebarProps) {
  const pathname = usePathname(); // Get current path for active route tracking
  const { isExpanded, isMobile } = useSidebar();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default logo specific to dashboard
  const defaultLogo = {
    icon: <Mountain className="h-4 w-4 text-primary" />,
    title: "Tours",
    href: "/"
  };

  const logoToUse = logo || defaultLogo;

  // Calculate widths
  const sidebarWidth = isExpanded ? '13rem' : '3.5rem'; // Same as in base sidebar

  // Update the isRouteActive function to handle localized routes
  const isRouteActive = (href: string) => {
    if (!pathname) return false;

    // Handle language prefixes in URLs like /en/dashboard/tours
    const pathSegments = pathname.split('/');
    const isLocalizedPath = pathSegments.length > 2 && pathSegments[1].length === 2;

    // If we have a localized path (/en/*), we need to match against the remaining path
    const actualPath = isLocalizedPath
      ? `/${pathSegments.slice(2).join('/')}`
      : pathname;

    console.log('Checking active:', { href, pathname, actualPath });

    // Exact match
    if (href === actualPath) return true;

    // For the root dashboard path
    if (href === '/dashboard' && actualPath === '/dashboard') return true;

    // For nested routes (like /dashboard/tours matching /en/dashboard/tours)
    if (href !== '/' && actualPath.startsWith(href)) {
      // Make sure we're matching full path segments
      const nextChar = actualPath.charAt(href.length);
      if (nextChar === '' || nextChar === '/') {
        return true;
      }
    }

    return false;
  };

  const user = {
    name: 'rudal',
    email: 'ruzal@gamil.com'
  }

  const footerContent = (
    <div className="border-t border-border/40 py-2.5 px-2.5">
      {isExpanded || isMobile ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border border-border/50">
              <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user?.name?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium truncate max-w-[100px]">{user?.name}</span>
              <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">{user?.email}</span>
            </div>
          </div>
          <form>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Log out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Log out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-7 w-7 border border-border/50">
                  <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {user?.name?.substring(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">{user?.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <form >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Log out"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Log out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </div>
      )}
    </div>
  );

  // Fix for disappearing tooltip in collapsed state
  const NavItemWithTooltip = ({ route, active }: { route: any, active: boolean }) => {
    // Determine if this is the dashboard route
    const isDashboardRoute = route.href === '/dashboard';

    if (!isExpanded && !isMobile) {
      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={route.href}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200",
                  "hover:bg-accent cursor-pointer",
                  active && !isDashboardRoute ? "sidebar-active-link" : "",
                  "justify-center"
                )}
              >
                <route.icon className={cn(
                  "h-4 w-4 flex-shrink-0",
                  active && !isDashboardRoute ? "text-primary" : "text-muted-foreground"
                )} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>{route.title}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Link
        href={route.href}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200",
          "hover:bg-accent cursor-pointer",
          active && !isDashboardRoute ? "sidebar-active-link" : "text-foreground",
          "justify-start"
        )}
      >
        <route.icon className={cn(
          "h-4 w-4 flex-shrink-0",
          active && !isDashboardRoute ? "text-primary" : "text-muted-foreground"
        )} />
        <span className="text-sm truncate">{route.title}</span>
        {route.badge && (
          <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {route.badge}
          </span>
        )}
      </Link>
    );
  };

  // Don't render anything during SSR to avoid hydration issues
  if (!mounted) return null;

  // Mobile version (uses Sheet component) 
  if (isMobile) {
    return (
      <BaseSidebar
        logo={logoToUse}
        sections={sections.map(section => ({
          ...section,
          routes: section.routes.map(route => ({
            ...route,
            // Force all routes to be rendered without active styling in mobile
            isActive: route.href === '/dashboard' ? false : undefined
          }))
        }))}
        className={className}
        mobileSheetTitle=""
        {...props}
      />
    );
  }

  // Desktop version - now we create a fixed position wrapper
  return (
    <div
      className={cn("flex flex-col fixed top-0 left-0 h-screen overflow-hidden transition-all duration-300 z-40 border-r border-border/40", className)}
      style={{ width: sidebarWidth }}
    >
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-[calc(100%-42px)]">
          {/* Header */}
          {logoToUse && (
            <div className="flex items-center justify-between h-14 border-b border-border/40 px-3">
              <Link href={logoToUse.href} className="flex items-center gap-2">
                <div className="bg-primary/10 p-1 rounded-md">
                  {logoToUse.icon}
                </div>
                {(isExpanded || isMobile) &&
                  <span className="text-lg font-semibold truncate transition-opacity" style={{
                    opacity: isExpanded || isMobile ? 1 : 0,
                    maxWidth: isExpanded ? '120px' : '0'
                  }}>
                    {logoToUse.title}
                  </span>
                }
              </Link>
            </div>
          )}

          {/* Main Navigation */}
          <div className="flex-1 overflow-auto py-4 px-2">
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div key={index}>
                  {(isExpanded || isMobile) && section.title && (
                    <h3 className="px-2 mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                      {section.title}
                    </h3>
                  )}
                  <nav className="space-y-0.5">
                    {section.routes.map((route) => {
                      // Check if the route is active based on the current pathname
                      const pathSegments = pathname.split('/');
                      const isLocalizedPath = pathSegments.length > 2 && pathSegments[1].length === 2;

                      // Remove language prefix
                      const actualPath = isLocalizedPath
                        ? `/${pathSegments.slice(2).join('/')}`
                        : pathname;

                      // Skip dashboard active state
                      if (route.href === '/dashboard') {
                        return (
                          <NavItemWithTooltip
                            key={route.href}
                            route={route}
                            active={false}
                          />
                        );
                      }

                      // Check if this route matches the current path
                      const active = route.href === actualPath ||
                        (route.href !== '/' && actualPath.startsWith(route.href + '/'));

                      return (
                        <NavItemWithTooltip
                          key={route.href}
                          route={route}
                          active={active}
                        />
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {footerContent}
    </div>
  );
}

// Re-export the sidebar trigger and toggle for convenience
export { SidebarTrigger as MobileSidebarTrigger, SidebarToggle } from "@/components/ui/sidebar"

// Re-export the useSidebar hook as useDashboardSidebar for backward compatibility
export const useDashboardSidebar = useSidebar;