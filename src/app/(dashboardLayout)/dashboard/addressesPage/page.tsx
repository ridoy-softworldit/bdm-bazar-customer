"use client";

import { useState } from "react";
import { useGetSingleUserQuery } from "@/redux/api/userApi";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Loader2, MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Swal from "sweetalert2";

interface Address {
  _id?: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  zone: string;
  postalCode?: string;
  isDefault?: boolean;
}

const AddressesPage = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const userId = currentUser?.id;
  const { data: user, isLoading, isError } = useGetSingleUserQuery(userId, {
    skip: !userId,
  });

  const [addresses, setAddresses] = useState<Address[]>(
    user?.data?.addresses || []
  );

  const handleAddAddress = () => {
    Swal.fire({
      title: "Add New Address",
      html: `
        <input type="text" id="label" class="swal2-input" placeholder="Label (e.g. Home, Office)">
        <input type="text" id="name" class="swal2-input" placeholder="Full Name">
        <input type="text" id="phone" class="swal2-input" placeholder="Phone Number">
        <input type="text" id="address" class="swal2-input" placeholder="Full Address">
        <input type="text" id="city" class="swal2-input" placeholder="City/District">
        <input type="text" id="area" class="swal2-input" placeholder="Area/Upazila">
        <input type="text" id="zone" class="swal2-input" placeholder="Zone">
        <input type="text" id="postal" class="swal2-input" placeholder="Postal Code">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        const newAddress: Address = {
          label: (document.getElementById("label") as HTMLInputElement)?.value,
          name: (document.getElementById("name") as HTMLInputElement)?.value,
          phone: (document.getElementById("phone") as HTMLInputElement)?.value,
          address: (document.getElementById("address") as HTMLInputElement)?.value,
          city: (document.getElementById("city") as HTMLInputElement)?.value,
          area: (document.getElementById("area") as HTMLInputElement)?.value,
          zone: (document.getElementById("zone") as HTMLInputElement)?.value,
          postalCode: (document.getElementById("postal") as HTMLInputElement)?.value,
        };

        if (
          !newAddress.name ||
          !newAddress.phone ||
          !newAddress.address ||
          !newAddress.city
        ) {
          Swal.showValidationMessage("Please fill all required fields");
          return false;
        }
        return newAddress;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setAddresses((prev) => [...prev, result.value]);
        Swal.fire("Added!", "Address successfully added.", "success");
      }
    });
  };

  const handleDelete = (id?: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#e11d48",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setAddresses(addresses.filter((a) => a._id !== id));
        Swal.fire("Deleted!", "Address has been removed.", "success");
      }
    });
  };

  const handleEdit = (address: Address) => {
    Swal.fire({
      title: "Edit Address",
      html: `
        <input type="text" id="label" class="swal2-input" value="${address.label}" placeholder="Label">
        <input type="text" id="name" class="swal2-input" value="${address.name}" placeholder="Full Name">
        <input type="text" id="phone" class="swal2-input" value="${address.phone}" placeholder="Phone Number">
        <input type="text" id="address" class="swal2-input" value="${address.address}" placeholder="Full Address">
        <input type="text" id="city" class="swal2-input" value="${address.city}" placeholder="City/District">
        <input type="text" id="area" class="swal2-input" value="${address.area}" placeholder="Area/Upazila">
        <input type="text" id="zone" class="swal2-input" value="${address.zone}" placeholder="Zone">
        <input type="text" id="postal" class="swal2-input" value="${address.postalCode || ""}" placeholder="Postal Code">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        return {
          ...address,
          label: (document.getElementById("label") as HTMLInputElement)?.value,
          name: (document.getElementById("name") as HTMLInputElement)?.value,
          phone: (document.getElementById("phone") as HTMLInputElement)?.value,
          address: (document.getElementById("address") as HTMLInputElement)?.value,
          city: (document.getElementById("city") as HTMLInputElement)?.value,
          area: (document.getElementById("area") as HTMLInputElement)?.value,
          zone: (document.getElementById("zone") as HTMLInputElement)?.value,
          postalCode: (document.getElementById("postal") as HTMLInputElement)?.value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        setAddresses((prev) =>
          prev.map((a) => (a._id === address._id ? result.value : a))
        );
        Swal.fire("Updated!", "Address successfully updated.", "success");
      }
    });
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">
          My Addresses
        </h1>
        <Button
          onClick={handleAddAddress}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      {/* Address Cards */}
      {addresses.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium">No addresses found</p>
          <p className="text-sm text-gray-400">
            Add your first shipping or billing address
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <Card
              key={address._id || address.label}
              className={`relative border-2 rounded-xl shadow-sm hover:shadow-md transition-all ${
                address.isDefault ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg text-gray-800">
                    {address.label || "Untitled"}
                  </h2>
                  {address.isDefault && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-1">{address.name}</p>
                <p className="text-sm text-gray-700 mb-1">{address.phone}</p>
                <p className="text-sm text-gray-600 mb-1">{address.address}</p>
                <p className="text-sm text-gray-600">
                  {address.area}, {address.city}
                </p>
                {address.postalCode && (
                  <p className="text-sm text-gray-500 mt-1">
                    Postal Code: {address.postalCode}
                  </p>
                )}

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(address._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesPage;
