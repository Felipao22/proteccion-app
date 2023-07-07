import { useEffect, useState } from "react";
import apiClient from "../../utils/client";

export const useFetchProvinces = () => {
    const [selectedProvince, setSelectedProvince] = useState(null)

    useEffect(() => {
        const fetchProvince = async () => {
          try {
            const res = await apiClient.get('/province');
            setSelectedProvince(res.data);
          } catch (error) {
            NotificationFailure(error.response);
          }
        };
    
        fetchProvince();
      },[])
      return selectedProvince;
}