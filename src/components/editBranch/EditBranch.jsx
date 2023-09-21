import React, { useState, useEffect } from "react";
import apiClient from "../../utils/client";
import Swal from "sweetalert2";
import { Button, Col, Input, Row } from "antd";
import { Card } from "antd";
import { Form } from "antd";
import { useFetchCities } from "../hooks/useFetchCities";
import { Select } from "antd";
import Loading from "../loading/Loading";
import { NotificationFailure } from "../notifications/Notifications";

export default function EditBranch({
  email,
  onCancel,
  fetchAndSetBusinessData,
  originalBranchData,
}) {
  const [branchData, setBranchData] = useState(
    originalBranchData || {
      nombreEmpresa: "",
      nombreSede: "",
      cuit: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      emailJefe: "",
      emails: [],
    }
  );

  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const selectedCities = useFetchCities();

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await apiClient.get(`/user/${email}`);
        setBranchData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBranchData();
  }, [email]);

  const handleUpdateBranch = async () => {
    const response = await apiClient.get(`/user/${email}`);
    const userToEdit = response.data;
    try {
      const result = await Swal.fire({
        title: `¿Está seguro que desea editar el establecimiento/obra: ${userToEdit.nombreSede} de la empresa ${userToEdit.nombreEmpresa}?`,
        text: "¡Sus datos serán editados!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, editar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await apiClient.put(`/user/${email}`, branchData);
        fetchAndSetBusinessData();
        Swal.fire(
          `Establecimiento/Obra: ${userToEdit.nombreSede} de la empresa ${userToEdit.nombreEmpresa} editada`
        );
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        NotificationFailure(error.response.data.message);
      } else {
        NotificationFailure("Error al editar el Establecimiento/Obra");
      }
    }
  };

  const CitySelect = () => {
    return (
      <div>
        <Select
          onChange={(value) =>
            setBranchData({
              ...branchData,
              ciudad: value,
            })
          }
          value={branchData.ciudad || ""}
          placeholder="Ciudades"
          justify="center"
          style={{
            width: "100%",
          }}
        >
          <Select.Option disabled value="">
            Ciudades
          </Select.Option>
          {selectedCities?.map((city) => (
            <Select.Option
              key={city.id}
              value={city.nombre}
              style={{
                width: "100%",
              }}
            >
              {city.nombre}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Row justify="center" align="middle">
          <Col span={24} lg={12}>
            <Card
              className="text-black m-5 box-register"
              style={{ borderRadius: "25px" }}
            >
              <Form className="register" form={form}>
                <h2 className="text-register">Editar Establecimiento/Obra</h2>
                <label>Empresa:</label>
                <Input
                  type="text"
                  value={branchData.nombreEmpresa || ""}
                  onChange={(e) =>
                    setBranchData({
                      ...branchData,
                      nombreEmpresa: e.target.value,
                    })
                  }
                />
                <label>Establecimiento:</label>
                <Input
                  type="text"
                  value={branchData.nombreSede || ""}
                  onChange={(e) =>
                    setBranchData({ ...branchData, nombreSede: e.target.value })
                  }
                />
                <label>Cuit:</label>
                <Input
                  type="number"
                  value={branchData.cuit || ""}
                  onChange={(e) =>
                    setBranchData({ ...branchData, cuit: e.target.value })
                  }
                />
                <label>N° de teléfono:</label>
                <Input
                  type="number"
                  value={branchData.telefono || ""}
                  onChange={(e) =>
                    setBranchData({ ...branchData, telefono: e.target.value })
                  }
                />
                <label>Dirección:</label>
                <Input
                  type="text"
                  value={branchData.direccion || ""}
                  onChange={(e) =>
                    setBranchData({ ...branchData, direccion: e.target.value })
                  }
                />
                <label htmlFor="ciudad">Ciudad:</label>
                {CitySelect()}

                <div>
                  <label>Email del Jefe:</label>
                  <Input
                    type="text"
                    value={branchData.emailJefe || ""}
                    onChange={(e) =>
                      setBranchData({
                        ...branchData,
                        emailJefe: e.target.value,
                      })
                    }
                  />
                </div>

                <label>Emails adicionales:</label>
                <Input
                  type="text"
                  value={branchData.emails || ""}
                  onChange={(e) =>
                    setBranchData({
                      ...branchData,
                      emails: e.target.value.split(","),
                    })
                  }
                />
              </Form>
              <div style={{marginTop:"20px"}}>

              <Button style={{ marginRight:"5px"}} type="primary" onClick={handleUpdateBranch}>
                Guardar
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => {
                  setBranchData(originalBranchData);
                  onCancel();
                }}
              >
                Cancelar
              </Button>
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
