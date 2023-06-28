import React, { useEffect, useState } from 'react'
import { setFilesData } from '../../redux/filesSlice';
import { useAppDispatch } from '../../redux/hooks';
import { NotificationFailure, NotificationSuccess } from '../notifications/Notifications';
import apiClient from '../../utils/client';
import { DeleteIcon, DownloadIcon } from '../icons/Icons';
import Swal from 'sweetalert2'

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

  const deleteFile = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Está seguro que desea eliminar el archivo?',
        text: '¡No podrá revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
  
      if (result.isConfirmed) {
        await apiClient.delete(`file/${id}`);
        const updatedFiles = files.filter((file) => file.id !== id);
        setFiles(updatedFiles);
        NotificationSuccess('Archivo eliminado');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        NotificationFailure(error.response.data.message);
      } else {
        NotificationFailure('Error al eliminar el archivo');
      }
    }
  };

  return (
    <div>
    {files.map((file) => (
      <div key={file.id}>
        <a href="" style={{cursor:"default"}} onClick={(e) => e.preventDefault()}>
          {file.name}
        </a>
        <span style={{cursor:"pointer",  marginLeft:"10px"}} onClick={() => handleDownload(file.id, file.name)}>
            <DownloadIcon />
        </span>
        <DeleteIcon style={{cursor:"pointer", marginLeft:"10px"}}  onClick={() => deleteFile(file.id)}/>
        {/* <button onClick={() => deleteFile(file.id)}>Eliminar</button> */}
        {/* <button onClick={() => handleDownload(file.id)}>Descargar</button> */}
        {/* <button style={{all: "unset", cursor:"pointer"}} onClick={() => handleDownload(file.id, file.name)}>
          </button> */}
      </div>
    ))}
  </div>
  );
}

