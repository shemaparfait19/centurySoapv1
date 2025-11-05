import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Users,
  UserPlus,
  Star,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Search,
  Edit2,
  Trash2,
} from "lucide-react";
import { Client } from "../types";
import { supabaseService } from "../services/supabaseService";
import toast from "react-hot-toast";

const Clients: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "regular" | "random">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "random" as "regular" | "random",
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, filterType]);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await supabaseService.getClients();
      setClients(data);
    } catch (error) {
      toast.error("Failed to load clients");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    if (filterType !== "all") {
      filtered = filtered.filter((c) => c.type === filterType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClients(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Client name is required");
      return;
    }

    try {
      if (editingClient) {
        await supabaseService.updateClient(editingClient.id, formData);
        toast.success("Client updated successfully");
      } else {
        await supabaseService.createClient(formData);
        toast.success("Client added successfully");
      }

      resetForm();
      loadClients();
    } catch (error) {
      toast.error("Failed to save client");
      console.error(error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone || "",
      email: client.email || "",
      type: client.type,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      await supabaseService.deleteClient(id);
      toast.success("Client deleted successfully");
      loadClients();
    } catch (error) {
      toast.error("Failed to delete client");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      type: "random",
    });
    setEditingClient(null);
    setShowAddModal(false);
  };

  const regularClients = clients.filter((c) => c.type === "regular");
  const randomClients = clients.filter((c) => c.type === "random");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">
            Manage your regular and random clients
          </p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add Client</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Clients
              </p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Regular Clients
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {regularClients.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-500 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Random Clients
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {randomClients.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "all"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("regular")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "regular"
                  ? "bg-success-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Regular
            </button>
            <button
              onClick={() => setFilterType("random")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === "random"
                  ? "bg-secondary-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Random
            </button>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="card">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No clients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Total Purchases
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Last Purchase
                  </th>
                  {user?.role === "admin" && (
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            client.type === "regular"
                              ? "bg-success-100"
                              : "bg-secondary-100"
                          }`}
                        >
                          {client.type === "regular" ? (
                            <Star className="w-5 h-5 text-success-600" />
                          ) : (
                            <Users className="w-5 h-5 text-secondary-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {client.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          client.type === "regular"
                            ? "bg-success-100 text-success-700"
                            : "bg-secondary-100 text-secondary-700"
                        }`}
                      >
                        {client.type === "regular" ? "Regular" : "Random"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        {client.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{client.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {client.totalPurchases.toLocaleString()} RWF
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {client.lastPurchaseDate ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(client.lastPurchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No purchases yet</span>
                      )}
                    </td>
                    {user?.role === "admin" && (
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(client)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingClient ? "Edit Client" : "Add New Client"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input w-full"
                  placeholder="+250788123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input w-full"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "regular" | "random",
                    })
                  }
                  className="input w-full"
                  required
                >
                  <option value="random">Random (Normal Pricing)</option>
                  <option value="regular">Regular (Special Pricing)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Regular clients get special discounted prices
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingClient ? "Update Client" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
