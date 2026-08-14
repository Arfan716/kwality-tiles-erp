import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
} from "lucide-react";

export function StaffManagement() {
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [staff, setStaff] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Staff Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const permissionList = [
  "dashboard",
  "inventory",
  "purchase",
  "sales",
  "customers",
  "suppliers",
  "bills",
  "reports",
  "staff",
  "settings",
];

  // -----------------------------
  // Fetch Staff
  // -----------------------------

  const fetchStaff = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setStaff(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);


  const togglePermission = (permission: string) => {
  if (permissions.includes(permission)) {
    setPermissions(
      permissions.filter((p) => p !== permission)
    );
  } else {
    setPermissions([...permissions, permission]);
  }
};


  // -----------------------------
  // Create Staff
  // -----------------------------

  const createStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setCreating(true);

      const { data, error } = await supabase.functions.invoke(
        "create-user",
        {
          body: {
            full_name: fullName,
            email,
            password,
            role,
            permissions,
          },
        }
      );
 

      if (error) {
  console.error(error);
  alert(JSON.stringify(error, null, 2));
  return;
}

console.log("Function response:", data);

      if (data?.error) {
        alert(data.error);
        return;
      }

      alert("Staff member created successfully!");

      setShowAddModal(false);

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("staff");

      fetchStaff();

    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };
  

  // -----------------------------
  // Delete Staff
  // -----------------------------

  const deleteStaff = async (id: string) => {
    const ok = confirm("Delete this staff member?");

    if (!ok) return;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchStaff();
  };

  // -----------------------------
  // Search
  // -----------------------------

  const filteredStaff = staff.filter((member) => {
    return (
      member.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      member.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      member.role
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

    return (
  <div className="space-y-6">

    {/* Header */}

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div>
        <h1 className="text-3xl font-bold">
          Staff Management
        </h1>

        <p className="text-muted-foreground mt-1">
          Manage employees and their system access
        </p>
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
      >
        <Plus className="w-5 h-5" />
        Add Staff
      </button>

    </div>

    {/* Stats */}

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <div className="bg-card border rounded-xl p-6">

        <p className="text-sm text-muted-foreground">
          Total Staff
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {staff.length}
        </h2>

      </div>

      <div className="bg-card border rounded-xl p-6">

        <p className="text-sm text-muted-foreground">
          Managers
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {staff.filter(s => s.role === "manager").length}
        </h2>

      </div>

      <div className="bg-card border rounded-xl p-6">

        <p className="text-sm text-muted-foreground">
          Staff Members
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {staff.filter(s => s.role === "staff").length}
        </h2>

      </div>

    </div>

    {/* Search */}

    <div className="bg-card border rounded-xl p-6">

      <div className="relative">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email or role..."
          className="w-full pl-11 pr-4 py-3 rounded-lg bg-muted border border-transparent focus:border-primary focus:outline-none"
        />

      </div>

    </div>

    {/* Loading */}

    {loading ? (

      <div className="bg-card rounded-xl border p-12 text-center">

        Loading staff...

      </div>

    ) : filteredStaff.length === 0 ? (

      <div className="bg-card rounded-xl border p-12 text-center">

        No staff found.

      </div>

    ) : (

      <div className="grid lg:grid-cols-2 gap-5">

        {filteredStaff.map((member) => (

          <div
            key={member.id}
            className="bg-card border rounded-xl p-6"
          >

            <div className="flex justify-between">

              <div className="flex gap-4">

                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">

                  <User className="w-7 h-7 text-primary" />

                </div>

                <div>

                  <h3 className="text-lg font-semibold">
                    {member.full_name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>

                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs capitalize">
                    {member.role}
                  </span>

                </div>

              </div>

              <div className="flex gap-2">

                <button
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <Edit className="w-5 h-5" />
                </button>

                <button
                  onClick={() => deleteStaff(member.id)}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

              </div>

            </div>

            <div className="mt-6 text-sm text-muted-foreground">

              Joined

              <div className="text-foreground font-medium">

                {new Date(
                  member.created_at
                ).toLocaleDateString()}

              </div>

            </div>

          </div>

        ))}

      </div>

    )}


 {/* Add Staff Modal */}

{showAddModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

    <div className="bg-card rounded-2xl border w-full max-w-lg p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold">
          Add Staff Member
        </h2>

        <button
          type="button"
          onClick={() => setShowAddModal(false)}
          className="text-muted-foreground hover:text-foreground text-xl"
        >
          ✕
        </button>

      </div>

      <form
        onSubmit={createStaff}
        className="space-y-5"
      >

        <div>

          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted"
            required
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted"
            required
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted"
            required
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-muted"
          >
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
          </select>

        </div>

        <div>

  <label className="block mb-3 font-medium">
    Permissions
  </label>

  <div className="grid grid-cols-2 gap-3">

    {permissionList.map((permission) => (

      <label
        key={permission}
        className="flex items-center gap-3 bg-muted rounded-lg p-3 cursor-pointer hover:bg-muted/70"
      >

        <input
          type="checkbox"
          checked={permissions.includes(permission)}
          onChange={() => togglePermission(permission)}
        />

        <span className="capitalize">
          {permission}
        </span>

      </label>

    ))}

  </div>

</div>

<div className="flex gap-3 pt-4">

          <button
            type="submit"
            disabled={creating}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg"
          >
            {creating ? "Creating..." : "Create Staff"}
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="flex-1 bg-muted py-3 rounded-lg"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>

  </div>
)}

  </div>
  );
}