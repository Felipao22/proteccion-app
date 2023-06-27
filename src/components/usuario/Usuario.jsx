import React, { useEffect, useState } from 'react'
import { setFilesData } from '../../redux/filesSlice';
import { useAppDispatch } from '../../redux/hooks';
import { NotificationFailure } from '../notifications/Notifications';
import apiClient from '../../utils/client';
import { DownloadIcon } from '../icons/Icons';

export const Usuario = () => {


const [files, setFiles] = useState([])


  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get('/file');
        dispatch(setFilesData(res.data));
        setFiles(res.data);
      } catch (error) {
        NotificationFailure(error.response.data.message);
      }
    };

    fetchData();
  }, []);


const handleDownload = async (id, name) => {
    try {
      const downloadUrl = `http://localhost:3001/file/${id}`;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
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
    {files.map((file) => (
      <div key={file.id}>
        <span style={{cursor:"pointer"}} onClick={() => handleDownload(file.id, file.name)}>
        <a href={`http://localhost:3001/file/${file.id}`} download>
          {file.name}
        </a>
            <DownloadIcon />
        </span>
        {/* <button onClick={() => handleDownload(file.id)}>Descargar</button> */}
        {/* <button style={{all: "unset", cursor:"pointer"}} onClick={() => handleDownload(file.id, file.name)}>
          </button> */}
      </div>
    ))}
  </div>
  );
}

