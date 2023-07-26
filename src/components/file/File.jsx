import { useState, useRef, useEffect } from "react";
import FormData from "form-data";
import {
  NotificationFailure,
  NotificationSuccess,
} from "../notifications/Notifications";
import apiClient from "../../utils/client";
import './File.css'
import { useId } from "react";
import { useAppDispatch } from "../../redux/hooks";

export const File = () => {
  const initialValues = {
    kindId: "",
    branchBranchId: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedKind, setSelectedKind] = useState();
  const [selectedUser, setSelectedUser] = useState()
  const hiddenFileInput = useRef(null);

  const id = useId();

  const data = new FormData();

  const dispatch = useAppDispatch()



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
    setSelectedFile('');
  };


  const handleLoadFile = async () => {
    data.append("file", selectedFile);
    data.append("branchBranchId", formData.branchBranchId);
    data.append("kindId", formData.kindId);
    try {
      const res = await apiClient.post("/file", data);
      NotificationSuccess(res.data.message);
      resetForm();
    } catch (error) {
      NotificationFailure(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchKindData = async () => {
      try {
        const res = await apiClient.get('/kind');
        setSelectedKind(res.data);
      } catch (error) {
        NotificationFailure(error.response.data.message);
      }
    };

    fetchKindData();
  },[])

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const res = await apiClient.get('/branch');
        setSelectedUser(res.data);
      } catch (error) {
        NotificationFailure(error.response.data.message);
      }
    };

    fetchBranchData();
  },[])

  const KindOfFile = () => {
      return (
        <>
          <option disabled value="">Seleccione una opción</option>
          {selectedKind?.map((e) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </>
      );
    };


    const BranchNameOfUser = () => {
      return (
        <>
      <option disabled value="">Seleccione una opción</option>
      {selectedUser?.map((e) => (
        <option key={e.branchId} value={e.branchId}>{e.nombreSede}</option>
      ))}
    </>
      );
    };

  const handleClearFile = () => {
    resetForm();
  }

  return (
    <div
      id="file"
    >
      <label htmlFor={id}>Seleccione el tipo de archivo:
    </label>
    <select  name="kindId"  value={formData.kindId} onChange={handleInputChange}>
    {KindOfFile()}
    </select>
    <label htmlFor={id}>Seleccione el establecimiento/obra:</label>
    <select  name="branchBranchId"  value={formData.branchBranchId} onChange={handleInputChange}>
      {BranchNameOfUser()}
    </select>
      <div className="content d-flex flex-column mb-4" data-aos="fade">
        <span>Archivo</span>
        <label className="file">
          <button className="btn btn-input-file" onClick={handleFileClick}>
            Seleccionar Archivo
          </button>
          <input
        type="file"
        accept=".pdf,.xls,.xlsx,.doc,.jpg,.jpeg"
        ref={hiddenFileInput}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
        </label>
        <span>{selectedFile && selectedFile.name}</span>
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
