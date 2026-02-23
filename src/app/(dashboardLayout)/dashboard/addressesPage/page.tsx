"use client";

import { useState, useEffect } from "react";
import { useGetSingleUserQuery, useUpdateUserMutation } from "@/redux/api/userApi";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Loader2, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

interface Address {
  label?: string;
  fullAddress?: string;
  city?: string;
  district?: string;
  area?: string;
  zone?: string;
  postalCode?: string;
}

const AddressesPage = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userId = currentUser?.id;
  const { data: user, isLoading, isError } = useGetSingleUserQuery(userId, {
    skip: !userId,
  });
  const [updateUser] = useUpdateUserMutation();

  const [address, setAddress] = useState<Address>(user?.data?.address || {});

  useEffect(() => {
    if (user?.data?.address) {
      setAddress(user.data.address);
    }
  }, [user]);

  const handleSaveAddress = async () => {
    const result = await Swal.fire({
      title: address.label ? "Edit Address" : "Add Address",
      html: `
        <input type="text" id="label" class="swal2-input" value="${address.label || ""}" placeholder="Label (e.g. Home, Office)">
        <input type="text" id="fullAddress" class="swal2-input" value="${address.fullAddress || ""}" placeholder="Full Address">
        <input type="text" id="city" class="swal2-input" value="${address.city || ""}" placeholder="City">
        <input type="text" id="district" class="swal2-input" value="${address.district || ""}" placeholder="District">
        <input type="text" id="area" class="swal2-input" value="${address.area || ""}" placeholder="Area/Upazila">
        <input type="text" id="zone" class="swal2-input" value="${address.zone || ""}" placeholder="Zone">
        <input type="text" id="postalCode" class="swal2-input" value="${address.postalCode || ""}" placeholder="Postal Code">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        return {
          label: (document.getElementById("label") as HTMLInputElement)?.value,
          fullAddress: (document.getElementById("fullAddress") as HTMLInputElement)?.value,
          city: (document.getElementById("city") as HTMLInputElement)?.value,
          district: (document.getElementById("district") as HTMLInputElement)?.value,
          area: (document.getElementById("area") as HTMLInputElement)?.value,
          zone: (document.getElementById("zone") as HTMLInputElement)?.value,
          postalCode: (document.getElementById("postalCode") as HTMLInputElement)?.value,
        };
      },
    });

    if (result.isConfirmed && result.value) {
      try {
        await updateUser({ id: userId, data: { address: result.value } }).unwrap();
        setAddress(result.value);
        toast.success("Address saved successfully!");
      } catch {
        toast.error("Failed to save address");
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await updateUser({ id: userId, data: { address: {} } }).unwrap();
        setAddress({});
        toast.success("Address deleted successfully!");
      } catch {
        toast.error("Failed to delete address");
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-10 text-red-500 font-medium">
        Failed to load address data.
      </div>
    );

  const hasAddress = address && Object.keys(address).length > 0 && address.fullAddress;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          My Address
        </h1>
        <Button
          onClick={handleSaveAddress}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> {hasAddress ? "Edit" : "Add"}
        </Button>
      </div>

      {!hasAddress ? (
        <div className="text-center py-16 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No address found</p>
          <p className="text-sm text-gray-400">
            Add your shipping or billing address
          </p>
        </div>
      ) : (
        <Card className="border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-xl text-gray-800">
                {address.label || "Address"}
              </h2>
            </div>

            {address.fullAddress && (
              <p className="text-sm text-gray-700 mb-2">{address.fullAddress}</p>
            )}
            {address.area && (
              <p className="text-sm text-gray-600 mb-1">Area: {address.area}</p>
            )}
            {address.city && (
              <p className="text-sm text-gray-600 mb-1">City: {address.city}</p>
            )}
            {address.district && (
              <p className="text-sm text-gray-600 mb-1">District: {address.district}</p>
            )}
            {address.zone && (
              <p className="text-sm text-gray-600 mb-1">Zone: {address.zone}</p>
            )}
            {address.postalCode && (
              <p className="text-sm text-gray-500 mt-2">
                Postal Code: {address.postalCode}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveAddress}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" /> Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddressesPage;
