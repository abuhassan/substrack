// app/auth/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        {/* Logo/branding area */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">SubsTrack</h1>
        </div>
      </div>

      <div className="w-full sm:mx-auto sm:max-w-[480px]">
        <div className="bg-white px-6 py-8 shadow-sm border border-gray-200 sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}