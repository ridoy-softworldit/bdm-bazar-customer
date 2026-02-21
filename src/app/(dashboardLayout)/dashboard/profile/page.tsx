"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Save, Mail, Phone, User } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectCurrentUser, setUser } from "@/redux/featured/auth/authSlice";
import { useUpdateUserMutation, useGetSingleUserQuery } from "@/redux/api/userApi";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data: userData } = useGetSingleUserQuery(user?._id || "", { skip: !user?._id });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    bio: "",
    image: "/placeholder.svg?height=64&width=64",
  });

  useEffect(() => {
    const currentUser = userData?.data || user;
    if (currentUser) {
      const [firstName, ...rest] = currentUser.name?.split(" ") || ["", ""];
      const lastName = rest.join(" ");

      setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        email: currentUser.email || "",
        contactNo: currentUser.contactNo || "",
        bio: currentUser.bio || `Hi, I'm ${currentUser.name}.`,
        image: "/placeholder.svg?height=64&width=64",
      });
    }
  }, [user, userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?._id) return;
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        contactNo: formData.contactNo,
        bio: formData.bio,
      };
      const result = await updateUser({ id: user._id, data: payload }).unwrap();
      if (result?.data) {
        dispatch(setUser({ ...user, ...result.data }));
      }
      toast.success("Profile updated successfully!");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen px-4 ">
      <div className="max-w-5xl mx-auto w-full">
        <Card className="bg-white border backdrop-blur-sm overflow-hidden rounded-md">
          <CardContent className="p-8 md:p-10">
            {/* Avatar */}
            <div className="flex flex-col items-start pb-10 border-slate-200/60">
              <div className="relative group">
                <Avatar className="w-20 h-20 border-4 border-white shadow-2xl ring-4 ring-slate-100 transition-all duration-300 group-hover:scale-105">
                  <AvatarImage src={formData.image} />
                  <AvatarFallback className="bg-[#1AA3D5] text-white text-3xl font-semibold">
                    {formData.firstName[0]}
                    {formData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-3 right-0 bg-white rounded-full p-3 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:scale-110">
                  <Camera className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>

                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2.5">
                      First Name
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2.5">
                      Last Name
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Email + Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2.5 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      Contact Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.contactNo}
                      onChange={(e) =>
                        handleInputChange("contactNo", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2.5">
                    Bio
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className="min-h-[140px]"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Button onClick={handleSave} disabled={isLoading} className="bg-[#19A5D6] hover:bg-[#DDF0F8] text-white hover:text-[#19A2D5] px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-200 hover:bg-slate-50 px-8 py-6 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
