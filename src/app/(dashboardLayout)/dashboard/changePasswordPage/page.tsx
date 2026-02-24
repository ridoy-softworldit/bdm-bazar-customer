import ChangePasswordForm from "@/Component/ChangePasswordForm";


export const metadata = {
  title: "Change Password",
  description: "Update your account password securely.",
};

export default function ChangePasswordPage() {
  return (
    <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Change Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your current password and a new one
          </p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}