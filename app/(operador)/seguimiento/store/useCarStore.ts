import { create } from "zustand";
import { Datum as CarDatum } from "../../configuraciones/interfaces/vehiculos/getcar";

interface CarStore {
  selectedCar: CarDatum | undefined;
  setSelectedCar: (car: CarDatum | undefined) => void;
}

export const useCarStore = create<CarStore>((set) => ({
  selectedCar: undefined,
  setSelectedCar: (car) => set({ selectedCar: car }),
}));
