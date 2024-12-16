import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { BarChart2, Home, LayoutDashboardIcon, Settings, SidebarClose } from "lucide-react"
import { title } from "process"

  const items = [
    {
        title: "Home",
        url: "#",
        icon: Home
    },
    {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboardIcon
    },
    {
        title: "Markets",
        url: "#",
        icon: BarChart2
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings
    }
  ]
  
  export function AppSidebar() {
    return (
      <Sidebar variant="sidebar" side="left">
        <SidebarContent>
          <SidebarGroup className="bg-[#1a2027]" />
            <SidebarGroupLabel className="text-xl font-bold">PolyMarkets</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a className="w-6 h-6" href={item.url}>
                                    <item.icon/>
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
            <SidebarClose/>Close
        </SidebarFooter>
        
      </Sidebar>
    )
  }
  