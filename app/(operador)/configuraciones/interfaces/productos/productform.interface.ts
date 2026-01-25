// Interfaz para los datos del formulario de producto
export interface ProductFormData {
  categoryId: string;
  productName: string;
}

// Interfaz para los datos del formulario de edición de producto
export interface ProductEditFormData extends ProductFormData {
  id: number;
}
