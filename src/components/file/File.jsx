import { useState, useRef, useEffect } from "react";
import FormData from "form-data";
import {
  NotificationFailure,
  NotificationSuccess,
} from "../notifications/Notifications";
import apiClient from "../../utils/client";
import "./File.css";
import { useId } from "react";
import { Form, Select } from "antd";
import { MDBIcon } from "mdb-react-ui-kit";
import { formatFileSize } from "../../utils/formatFilesize";

export const File = () => {
  const initialValues = {
    kindId: null,
    branchBranchId: null,
  };

  const [formData, setFormData] = useState(initialValues);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedKind, setSelectedKind] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const hiddenFileInput = useRef(null);
  const [loading, setLoading] = useState(false);

  const id = useId();

  const data = new FormData();


  const handleFileChange = (e) => {
    if (e.target.files != null) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileClick = () => {
    if (hiddenFileInput.current != null) {
      hiddenFileInput.current.click();
    }
  };

  const resetForm = () => {
    setFormData(initialValues);
    setSelectedFile("");
  };

  const handleLoadFile = async () => {
    setLoading(true);
    data.append("file", selectedFile);
    data.append("branchBranchId", formData.branchBranchId);
    data.append("kindId", formData.kindId);
    try {
      const res = await apiClient.post("/file", data);
      NotificationSuccess(res.data.message);
      resetForm();
    } catch (error) {
      NotificationFailure(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchKindData = async () => {
      try {
        const res = await apiClient.get("/kind");
        setSelectedKind(res.data);
      } catch (error) {
        NotificationFailure(error.response.data.message);
      }
    };

    fetchKindData();
  }, []);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const res = await apiClient.get("/branch");
        setSelectedUser(res.data);
      } catch (error) {
        NotificationFailure(error.response.data.message);
      }
    };

    fetchBranchData();
  }, []);


  const KindOfFile = () => {
    return (
      <>
        {selectedKind?.map((e) => (
          <Select.Option key={e.id} value={e.id}>
            {e.name}
          </Select.Option>
        ))}
      </>
    );
  };

  const BranchNameOfUser = () => {
    return (
      <>
        {selectedUser?.map((e) => (
          <Select.Option key={e.branchId} value={e.branchId}>
            {e.nombreSede}
          </Select.Option>
        ))}
      </>
    );
  };

  const handleClearFile = () => {
    resetForm();
  };


  return (
    <div id="file">
      <label htmlFor={id}>Seleccione el tipo de archivo:</label>
      <Form.Item htmlFor={id}>
        <Select
          onChange={(value) =>
            handleInputChange({
              target: { name: "kindId", value },
            })
          }
          value={formData.kindId}
          style={{ maxWidth: "400px" }}
          placeholder="Tipo de archivos"
        >
          {KindOfFile()}
        </Select>
      </Form.Item>
      <label htmlFor={id}>Seleccione el establecimiento/obra:</label>
      <Form.Item htmlFor={id}>
        <Select
          onChange={(value) =>
            handleInputChange({
              target: { name: "branchBranchId", value },
            })
          }
          value={formData.branchBranchId}
          style={{ maxWidth: "400px" }}
          placeholder="Establecimientos"
        >
          {BranchNameOfUser()}
        </Select>
      </Form.Item>
      <div className="content d-flex flex-column mb-4" data-aos="fade">
        <span>Archivo:</span>
        <label className="file">
          <button className="btn btn-input-file" onClick={handleFileClick}>
            Seleccionar Archivo
          </button>
          <input
            type="file"
            accept=".pdf,.xls,.xlsx,.doc,.jpg,.jpeg,.docx"
            ref={hiddenFileInput}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </label>
        <span>
          {selectedFile && selectedFile.name}{" "}
          {selectedFile && formatFileSize(selectedFile.size)}
        </span>
        {loading && (
          <div className="text-center my-4">
            <MDBIcon icon="spinner" spin size="3x" />
            <div>Cargando archivo...</div>
          </div>
        )}
      </div>

      <div
        className="content d-flex  mb-3 d-flex align-items-start"
        data-aos="fade"
      >
        <button className="btn btn-primary" onClick={handleLoadFile}>
          Subir
        </button>
        <button className="btn btn-primary" onClick={handleClearFile}>
          Cancelar
        </button>
      </div>
    </div>
  );
};
