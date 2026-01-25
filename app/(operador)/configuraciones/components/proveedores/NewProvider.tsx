import { User16Icon } from "@/components/icons/User16Icon";
import React, { useState } from "react";

const ProductGroupManager = () => {
  const [name, setName] = useState("asa");
  const [selectedCategory, setSelectedCategory] = useState("PROCESADOS");
  const [isOpen, setIsOpen] = useState(false);
  const [assignedGroups, setAssignedGroups] = useState([
    { id: "1", name: "OTROS AVC", category: "OTROS" },
    { id: "2", name: "OTROS SOFIA", category: "OTROS" },
  ]);

  const productGroups = [
    { value: "select", label: "Seleccionar grupo...", category: "" },
    { value: "POLLO SOFIA", label: "POLLO SOFIA", category: "POLLO" },
    { value: "POLLO AVC", label: "POLLO AVC", category: "POLLO" },
    { value: "PROCESADOS", label: "PROCESADOS", category: "PROCESADOS" },
    { value: "HUEVO", label: "HUEVO", category: "HUEVO" },
  ];

  const removeGroup = (id: string) => {
    setAssignedGroups(assignedGroups.filter((group) => group.id !== id));
  };

  const addGroup = () => {
    if (selectedCategory && selectedCategory !== "select") {
      const newGroup = {
        id: Date.now().toString(),
        name: selectedCategory,
        category: selectedCategory,
      };
      setAssignedGroups([...assignedGroups, newGroup]);
      setSelectedCategory("select");
    }
  };

  const handleSave = () => {
    console.log("Guardando:", { name, assignedGroups });
    alert("Datos guardados (ver consola)");
  };

  const handleCancel = () => {
    console.log("Cancelando");
    setName("");
    setAssignedGroups([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* First Row - Name and Add Product Group side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left - Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
              placeholder="Ingrese el nombre"
            />
          </div>

          {/* Right - Add Product Group */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Agregar Grupo de Productos
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full inline-flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                >
                  <span className="text-gray-900">
                    {productGroups.find((g) => g.value === selectedCategory)
                      ?.label || "Seleccionar grupo..."}
                  </span>
                  <User16Icon
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                    {productGroups.map((group) => (
                      <button
                        key={group.value}
                        onClick={() => {
                          setSelectedCategory(group.value);
                          setIsOpen(false);
                        }}
                        disabled={group.value === "select"}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          selectedCategory === group.value
                            ? "bg-gray-100 font-medium"
                            : ""
                        } ${group.value === "select" ? "text-gray-500 cursor-default hover:bg-white" : "text-gray-900"}`}
                      >
                        {group.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={addGroup}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
              >
                <User16Icon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Second Row - Assigned Groups */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            Grupos Asignados ({assignedGroups.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {assignedGroups.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No hay grupos asignados
              </p>
            ) : (
              assignedGroups.map((group) => (
                <div
                  key={group.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-800 rounded border border-pink-200 hover:bg-pink-100 transition-colors"
                >
                  <span className="text-sm font-medium">{group.name}</span>
                  <button
                    onClick={() => removeGroup(group.id)}
                    className="hover:bg-pink-200 rounded-full p-0.5 transition-colors"
                    aria-label={`Eliminar ${group.name}`}
                  >
                    <User16Icon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Third Row - Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium transition-all shadow-sm hover:shadow text-sm"
          >
            <User16Icon className="w-4 h-4" />
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-all text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGroupManager;
