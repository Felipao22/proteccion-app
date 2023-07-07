import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import apiClient from '../../utils/client';
import { ActiveIcon, DeleteIcon } from '../icons/Icons';
import Swal from 'sweetalert2';
import { File } from '../file/File';
import useFormatDate from '../hooks/useFormattedDate'
import { setLogoutData } from '../../redux/userSlice';
import { setFilesDataLogOut } from '../../redux/filesSlice';
import { useAppDispatch } from '../../redux/hooks';
import { clearToken } from '../../utils/token';
import { NotificationFailure, NotificationSuccess } from '../notifications/Notifications';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading/Loading';



export default function Dashboard() {
  const [selectedUser, setSelectedUser] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiClient.get('/user');
        setSelectedUser(res.data);
        setLoading(false)
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  };

  const searchUsers = (rows) => {
    const escapedQ = escapeRegExp(q.trim());
    const searchRegex = new RegExp(escapedQ, 'i');

    return rows.filter(
      (row) =>
        searchRegex.test(row.email) ||
        searchRegex.test(row.nombreEmpresa) ||
        searchRegex.test(row.ciudad) ||
        searchRegex.test(row.nombreEstablecimiento)
    );
  };

  const signOff = async() => {
    try {
      const res = await apiClient.post('/user/logout')
      dispatch(setLogoutData());
      dispatch(setFilesDataLogOut());
    clearToken();
    navigate("/");
    NotificationSuccess(res.data.message)
    } catch (error) {
      NotificationFailure(response.data.error)
    }
      
  };

  const deleteUser = async (email) => {
    try {
      const result = await Swal.fire({
        title: '¿Está seguro que desea eliminar el usuario?',
        text: '¡No podrá revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await apiClient.put(`user/baneo/${email}`);
        const response = await apiClient.get('/user');
        const updatedUsers = response.data;
        // const updatedUsers = res.data
        setSelectedUser(updatedUsers);
        Swal.fire(`Usuario: ${updatedUsers[0].nombreEmpresa} eliminado` );
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log(error.response.data.message);
      } else {
        console.error('Error al eliminar el usuario');
      }
    }
  };

  const activeUser = async (email) => {
    try {
      const result = await Swal.fire({
        title: '¿Está seguro que desea activar el usuario?',
        text: '¡Volverá a estar activo!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, activar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await apiClient.put(`user/activar/${email}`);
        const response = await apiClient.get('/user');
        const updatedUsers = response.data;
        // const updatedUsers = res.data
        setSelectedUser(updatedUsers);
        Swal.fire(`Usuario: ${updatedUsers[0].nombreEmpresa} activado ` );
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log(error.response.data.message);
      } else {
        console.error('Error al activar el usuario');
      }
    }
  };

  const [showFile, setShowFile] = useState(false);

  const handleLoadFile = () => {
    setShowFile(true);
  };
  const handleBack = () => {
    setShowFile(false);
  };

  const formatDate = useFormatDate();


  return (
    <>
    {loading ? (
      <div><Loading /></div>
    ) : (
      <div>
        {!showFile ? (
          <TableContainer component={Paper}>
            <div>
              <button className='btn btn-primary"' onClick={handleLoadFile}>Cargar archivos</button>
            </div>
            <div>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="justify">Empresa</TableCell>
                  <TableCell align="justify">Email</TableCell>
                  <TableCell align="justify">Establecimiento</TableCell>
                  <TableCell align="justify">Cuit</TableCell>
                  <TableCell align="justify">Provincia</TableCell>
                  <TableCell align="justify">Ciudad</TableCell>
                  <TableCell align="justify">Direccion</TableCell>
                  <TableCell align="justify">Teléfono</TableCell>
                  <TableCell align="justify">Registrado</TableCell>
                  <TableCell align="justify">Eliminar</TableCell>
                  <TableCell align="justify">Activar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchUsers(selectedUser).map((row) => (
                  <TableRow
                    key={row.email}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    style={row.active === false ? { backgroundColor: '#FB4100', color: 'white' } : {}}
                  >
                    <TableCell component="th" scope="row">
                      {row.nombreEmpresa}
                    </TableCell>
                    {/* <TableCell align="justify">{row.active}</TableCell> */}
                    <TableCell align="justify">{row.email}</TableCell>
                    <TableCell align="justify">{row.nombreEstablecimiento || '-'}</TableCell>
                    <TableCell align="justify">{row.cuit || '-'}</TableCell>
                    <TableCell align="justify">{row.provincia || '-'}</TableCell>
                    <TableCell align="justify">{row.ciudad || '-'}</TableCell>
                    <TableCell align="justify">{row.direccion || '-'}</TableCell>
                    <TableCell align="justify">{row.telefono || '-'}</TableCell>
                    <TableCell align="justify">{formatDate(row.createdAt) || '-'}</TableCell>
                    <TableCell align="justify">
                      <DeleteIcon style={{ cursor: 'pointer' }}
                        onClick={() => deleteUser(row.email)} />
                    </TableCell>
                    <TableCell align="justify">
                      <ActiveIcon style={{ cursor: 'pointer' }}
                        onClick={() => activeUser(row.email)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <>
            <File />
            <button className='btn' onClick={handleBack}>Volver</button>
          </>
        )}
      </div>
    )}
    <div>
      <button onClick={signOff}>Cerrar sesión</button>
    </div>
  </>
  );
}
