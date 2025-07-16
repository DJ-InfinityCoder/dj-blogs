"use client"

import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar"
import { NavMain } from "@/components/nav-main"

const navMain = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: "PieChart",
  },
  {
    title: "Create Blog",
    url: "/dashboard/create-blog",
    icon: "SquareTerminal",
  },
  {
    title: "My Blogs",
    url: "/dashboard/my-blogs",
    icon: "BookOpen",
  }
]

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="mt-20">
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
