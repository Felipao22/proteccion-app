import Swal from "sweetalert2";
import { getExtensionIcon } from "../../utils/getExtensionIcon";
import apiClient from "../../utils/client";
import { DeleteIcon, DownloadIcon } from "../icons/Icons";
import { NotificationFailure } from "../notifications/Notifications";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSelectedDate, setSelectedKind } from "../../redux/filesSlice";
import moment from "moment";
import { Form } from "antd";
import { Select } from "antd";
const { Option } = Select;
import { DatePicker } from "antd";
import { useFetchKinds } from "../hooks/useFetchKinds";

export const UserFiles = ({ userFiles, onDeleteFile  }) => {

  const selectedKind = useAppSelector((state) => state.files.selectedKind);
  const selectedDate = useAppSelector((state) => state.files.selectedDate);
  const kinds = useFetchKinds();

  const dispatch = useAppDispatch()

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

  const filteredFiles = userFiles.filter((file) => {
    const fileCreatedAtMoment = moment(file?.createdAt);
    const selectedDateMoment = selectedDate
      ? moment(selectedDate, "YYYY-MM")
      : null;

    return (
      (!selectedKind || file?.kindId === parseInt(selectedKind)) &&
      (!selectedDateMoment ||
        fileCreatedAtMoment.format("MM/YY") ===
          selectedDateMoment.format("MM/YY"))
    );
  });

  const handleKindFilterChange = (value) => {
    dispatch(setSelectedKind(value)); // Actualiza el estado global en Redux
  };

  const handleDateFilterChange = (date) => {
    const formattedDate = date ? date.format("YYYY-MM") : null; // Almacenar la fecha como cadena "YYYY-MM" o null si no hay fecha
    dispatch(setSelectedDate(formattedDate)); // Actualiza el estado global en Redux
  };
  

  return (
    <div>
    {userFiles && userFiles.length > 0 ? (
      <div className="form-container">
        <Form style={{margin:"20px"}} layout="inline">
          <Form.Item label="Filtrar por tipo" htmlFor="kind">
            <Select
              onChange={handleKindFilterChange}
              value={selectedKind}
              style={{ width: "200px" }}
              placeholder="Tipo de archivos"
            >
              <Option value="">Todos</Option>
              {kinds?.map((kind) => (
                <Option key={kind.id} value={kind.id}>
                  {kind.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Filtrar por mes" htmlFor="month">
            <DatePicker
              picker="month"
              onChange={handleDateFilterChange}
              value={
                selectedDate ? moment(selectedDate, "YYYY-MM") : null
              }
              format="MM/YYYY"
            />
          </Form.Item>
        </Form>
  
        <ul style={{margin: "20px", listStyle: "none" }}>
          {filteredFiles.map((file) => (
            <li key={file.id}>
              {getExtensionIcon(file.name)} {file.name}{" "}
              <DownloadIcon
                style={{ cursor: "pointer" }}
                onClick={() => handleDownload(file.id, file.name)}
              />{" "}
              <DeleteIcon
                style={{ cursor: "pointer" }}
                onClick={() => DeleteFile(file.id)}
              />
            </li>
          ))}
        </ul>
        {(selectedKind || selectedDate) && filteredFiles.length === 0 && (
        <div style={{margin:"20px"}}>
          {selectedKind && selectedDate ? (
            <span>No hay archivos para este tipo y mes.</span>
          ) : (
            <>
              {selectedKind && (
                <span>No hay archivos para este tipo.</span>
              )}
              {selectedDate && (
                <span>No hay archivos para este mes.</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  ) : (
    <p style={{margin:"50px"}}>No hay archivos cargados en este Establecimiento/Obra.</p>
  )}
      </div>
  
  );
};

