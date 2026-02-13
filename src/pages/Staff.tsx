import { useState, type FormEvent } from "react";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import type { Role, StaffMember } from "../types";
import "./Staff.css";

const STAFF_ROLES: Role[] = ["doctor", "nurse", "pharmacist", "billing"];

type NewStaffForm = {
  name: string;
  email: string;
  phone: string;
  role: Role;
  department: string;
  password: string;
};

export default function Staff() {
  const { user } = useAuth();
  const { staff, addStaff, removeStaff } = useData();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState<NewStaffForm>({
    name: "",
    email: "",
    phone: "",
    role: "doctor",
    department: "",
    password: ""
  });

  const isAdmin = user?.role === "admin";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAdmin) return;

    const member: Omit<StaffMember, "id"> = {
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      password: newStaff.password,
      phone: newStaff.phone.trim() || undefined,
      role: newStaff.role,
      department: newStaff.department.trim() || undefined
    };

    addStaff(member);
    setShowAddModal(false);
    setNewStaff({
      name: "",
      email: "",
      phone: "",
      role: "doctor",
      department: "",
      password: ""
    });
  };

  const handleRemove = (member: StaffMember) => {
    if (!isAdmin) return;
    const confirmed = window.confirm(`Remove ${member.name} from staff list?`);
    if (confirmed) {
      removeStaff(member.id);
    }
  };

  return (
    <Layout>
      <div className="staff-container">
        <div className="staff-header">
          <h1>👨‍⚕️ Staff Management</h1>
          <p>Manage doctors, nurses, pharmacists, and billing officers</p>
        </div>

        {!isAdmin && (
          <div className="staff-info-banner">
            Only administrators can add or remove staff. You can view the staff list below.
          </div>
        )}

        {isAdmin && (
          <div className="staff-actions">
            <button className="btn-staff-add" onClick={() => setShowAddModal(true)}>
              + Add Staff Member
            </button>
          </div>
        )}

        <div className="staff-table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Email</th>
                <th>Phone</th>
                {isAdmin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="staff-empty">
                    No staff members added yet.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id}>
                    <td className="staff-id">{member.id}</td>
                    <td>{member.name}</td>
                    <td className="staff-role">{member.role}</td>
                    <td>{member.department || "-"}</td>
                    <td>{member.email}</td>
                    <td>{member.phone || "-"}</td>
                    {isAdmin && (
                      <td>
                        <button
                          className="staff-remove-btn"
                          onClick={() => handleRemove(member)}
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Add Staff Member</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label form-label-required">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-required">Temporary Password</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newStaff.password}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, password: e.target.value })
                      }
                      placeholder="Set an initial password for this staff account"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-input"
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                        placeholder="+233..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label form-label-required">Role</label>
                      <select
                        className="form-select"
                        value={newStaff.role}
                        onChange={(e) =>
                          setNewStaff({ ...newStaff, role: e.target.value as Role })
                        }
                      >
                        {STAFF_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newStaff.department}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, department: e.target.value })
                      }
                      placeholder="e.g. Cardiology, Emergency, Pharmacy"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Save Staff Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

