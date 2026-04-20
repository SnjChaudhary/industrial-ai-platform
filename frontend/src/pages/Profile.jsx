import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();

  const getAccess = (role) => {
    switch (role) {
      case "admin":
        return "Full system (Reports + Config)";
      case "engineer":
        return "Dashboard + Maintenance";
      case "operator":
        return "Dashboard only";
      default:
        return "No access";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
        <p className="text-lg">
          <span className="text-gray-400">Role:</span>{" "}
          <span className="font-semibold capitalize">{user?.role}</span>
        </p>

        <p className="text-lg">
          <span className="text-gray-400">Access:</span>{" "}
          <span className="font-semibold">
            {getAccess(user?.role)}
          </span>
        </p>

        <button
          onClick={logout}
          className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;