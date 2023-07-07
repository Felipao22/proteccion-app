import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setFilesData } from "../../redux/filesSlice";
import { getUser, setUserData } from "../../redux/userSlice";
import apiClient from "../../utils/client";
import { NotificationFailure } from "../notifications/Notifications";
import { getToken } from "../../utils/token";
import { useState } from "react";

export const useFetchUsers = () => {
const dispatch = useAppDispatch()
const token = getToken()

const user = useAppSelector(getUser)
const [loading, setLoading] = useState(true)


    useEffect(() => {
        const fetchUserData = async () => {
          try {
            if (token && user) {
              const { email } = user;
              const { data } = await apiClient.get(`/user/${email}`);
              if (data) {
                const user = {
                  email: data.email,
                  nombreEmpresa: data.nombreEmpresa,
                  nombreEstablecimiento: data.nombreEstablecimiento,
                  cuit: data.cuit,
                  telefono: data.telefono,
                  provincia: data.provincia,
                  ciudad: data.ciudad,
                  userId: data.userId,
                  authToken: data.authToken,
                  direccion: data.direccion
                };
                dispatch(setFilesData(data.files));
                dispatch(setUserData(user));
                setLoading(false)
              }
            }
          } catch (error) {
            NotificationFailure(error.response.data.message);
          }
        };
        fetchUserData();
      }, [token, user, dispatch]);
      return loading
}