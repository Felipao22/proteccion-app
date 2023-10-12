import { useEffect, useState } from "react";
import apiClient from "../../utils/client";
import { Progress } from "antd";
import "./ProgressBar.css"


const TOTAL_SPACE_GB = 20; // Tamaño total en GB
const TOTAL_SPACE_MB = TOTAL_SPACE_GB * 1024; 

const ProgressBar = () => {

    const [usedSpace, setUsedSpace] = useState(0);

    useEffect(() => {
        const fetchSizeFiles = async () => {
          try {
            const response = await apiClient.get("/file");
            const files = response.data;
            const totalSize = files.reduce((acc, file) => acc + file.size, 0);
            setUsedSpace(totalSize);
          } catch (error) {
            console.error("Error al obtener los archivos:", error);
          }
        };
    
        fetchSizeFiles();
      }, []);
    
      const totalSpaceMB = TOTAL_SPACE_MB;
      const usedSpaceMB = usedSpace / (1024 * 1024); // Convertir bytes a MB
      const usedSpacePercentage = ((usedSpaceMB / totalSpaceMB) * 100).toFixed(3);


  return (
    <div className="progress-bar">
    <h4 style={{marginBottom:"40px"}}>Espacio ocupado por archivos</h4>
    <Progress size="medium" type="dashboard" percent={usedSpacePercentage} />
    <p style={{marginTop:"40px"}}>{`Espacio usado: ${usedSpaceMB.toFixed(2)} MB de ${totalSpaceMB} MB (20 GB)`}</p>
  </div>
  )
}

export default ProgressBar;