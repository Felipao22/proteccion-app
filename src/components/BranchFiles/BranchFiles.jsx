import Swal from "sweetalert2";
import { getExtensionIcon } from "../../utils/getExtensionIcon";
import apiClient from "../../utils/client";
import { DeleteIcon, DownloadIcon } from "../icons/Icons";
import { NotificationFailure } from "../notifications/Notifications";

export const BranchFiles = ({ branchFiles, onDeleteFile  }) => {

  const DeleteFile = async(id) => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro que desea eliminar el archivo?",
        text: "¡Se eliminará para siempre!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await apiClient.delete(`file/${id}`);
        onDeleteFile(id)
        Swal.fire(`Archivo eliminado `);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
      } else {
        console.error("Error al eliminar el archivo");
      }
    }
  }

  const handleDownload = async (id, name) => {
    try {
      const response = await apiClient.get(`/file/${id}`, {
        responseType: "blob",
      });

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();

      // Liberar los recursos del enlace temporal
      window.URL.revokeObjectURL(url);
    } catch (error) {
      NotificationFailure(error.message);
    }
  };

  return (
    <div>
      {branchFiles && branchFiles.length > 0 ? (
        <ul>
          {branchFiles.map((file) => (
            <li key={file.id}>
              {getExtensionIcon(file.name)} {file.name} <DownloadIcon style={{cursor:"pointer"}} onClick={() => handleDownload(file.id, file.name)} />  <DeleteIcon style={{cursor:"pointer"}} onClick={() => DeleteFile(file.id)} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay archivos cargados en este Establecimiento/Obra.</p>
      )}
    </div>
  );
};

