"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DashboardProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [blogStats, setBlogStats] = useState({
    totalBlogs: 0,
    totalLikes: 0,
    totalViews: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("/api/user-profile");
        const statsRes = await axios.get("/api/user-blogs-stats");
        setUserProfile(profileRes.data.user);
        setFormData({
          name: profileRes.data.user.name,
          image: profileRes.data.user.image,
        });
        setBlogStats(statsRes.data.stats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const res = await axios.patch("/api/user-profile", {
        name: formData.name,
        image: formData.image,
      });

      setUserProfile(res.data.user);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Breadcrumb */}
      <div className="mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/profile">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {userProfile && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Welcome, {userProfile.name}</CardTitle>
            <Button
              className="cursor-pointer"
              variant="default"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.image} alt={formData.name} />
              <AvatarFallback>{formData.name?.[0]}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-4 w-full">
              {isEditing ? (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    className="cursor-pointer mt-2 w-fit"
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <p className="font-medium text-lg">{userProfile.name}</p>
                  <p className="text-muted-foreground">{userProfile.email}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blog Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Total Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{blogStats?.totalBlogs ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{blogStats.totalLikes}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{blogStats.totalViews}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
