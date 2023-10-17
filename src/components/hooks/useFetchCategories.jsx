import { useEffect, useState } from "react"
import apiClient from "../../utils/client"
import { NotificationFailure } from "../notifications/Notifications"

export const useFetchCategories = () => {
    const [category, setCategory] = useState(null)

    useEffect(() => {
      const fetchCategories = async () => {
            try {
              const response = await apiClient.get("/category");
              setCategory(response.data);
            } catch (error) {
              NotificationFailure(error.response.data)
              console.error("Error al obtener las categorías", error);
            }
          };
          fetchCategories();
    },[])
    return category;
}