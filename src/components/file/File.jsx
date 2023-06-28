import { useState, useRef, useEffect } from "react";
import FormData from "form-data";
import {
  NotificationFailure,
  NotificationSuccess,
} from "../notifications/Notifications";
import apiClient from "../../utils/client";
import { useNavigate } from "react-router-dom";
import './File.css'

export const File = () => {
  const initialValues = {
    kindId: 0,
    email: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedKind, setSelectedKind] = useState()
  const hiddenFileInput = useRef(null)

  const data = new FormData();

  const navigate = useNavigate();

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
    setFormData({ ...formData, kindId: initialValues.kindId, email: initialValues.email });
      setSelectedFile(null); 
  };


  const handleLoadFile = async () => {
    data.append("file", selectedFile);
    data.append("kindId", formData.kindId);
    data.append("email", formData.email);
    try {
      const res = await apiClient.post("/file", data);
    //    navigate('/');
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
        // dispatch(setFilesData(res.data));
        setSelectedKind(res.data);
      } catch (error) {
        NotificationFailure(error.response.data.message);
      }
    };

    fetchKindData();
  },[])

  const KindofFile = () => {
    return(

    <select type="text" name="kindId" onChange={handleInputChange}>

    <option value="">{ } </option>
{
selectedKind?.map((e) => (        
    <option key={e.id} value={e.id}>{e.name}</option>
))
}
</select>
    )
  }

  return (
    <div
      id="file"
    >
      {/* <input type="number"
        name="kindId" onChange={handleInputChange} placeholder="Ingresa el tipo de archivo"
        /> */}
        {/* <KindofFile /> */}
        <select type="text" name="kindId" onChange={handleInputChange}>

          <option value="">{ } </option>
    {
      selectedKind?.map((e) => (        
          <option key={e.id} value={e.id}>{e.name}</option>
      ))
    }
    </select>
      <input type="email"
        name="email"
        placeholder="Ingresa el email"
        onChange={handleInputChange} />

      <div className="content d-flex flex-column mb-4" data-aos="fade">
        <span>Archivo</span>
        <label className="file">
          <button className="btn btn-input-file" onClick={handleFileClick}>
            Seleccionar Archivo
          </button>
          <input
        type="file"
        accept=".pdf,.xls,.xlsx"
        ref={hiddenFileInput}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
        </label>
        <span>{selectedFile && selectedFile.name}</span>
      </div>

      <div
        className="content d-flex flex-column mb-3 d-flex align-items-start"
        data-aos="fade"
      >
        <button className="btn btn-primary" onClick={handleLoadFile}>
          Subir
        </button>
      </div>
    </div>
  );
};
