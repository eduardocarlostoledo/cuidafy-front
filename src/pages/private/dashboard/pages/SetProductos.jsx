import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Popconfirm,
  Image,
  Tag,
  Tooltip,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import clienteAxios from "../../../../config/axios.js";

const SetProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Obtener productos
  const fetchProductos = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const { data } = await clienteAxios.get(
        `/api/products?page=${page}&limit=${pageSize}`
        // "/api/products"
      );
      console.log("Respuesta de productos:", data);
      // El backend retorna: resultados, totalProductos, totalPaginas, paginaActual
      setProductos(data.resultados || []);
      setPagination({
        current: data.paginaActual || page,
        pageSize: pageSize,
        total: data.totalProductos || 0,
      });
      console.log("Productos cargados:", data.resultados);
    } catch (error) {
      console.error("Error al cargar productos:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullMessage: error.message
      });
      message.error(`Error al cargar productos: ${error.response?.status || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductos();
  }, []);

  // Abrir modal para crear
  const showCreateModal = () => {
    setIsEditMode(false);
    setSelectedProducto(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Abrir modal para editar
  const showEditModal = (producto) => {
    setIsEditMode(true);
    setSelectedProducto(producto);
    form.setFieldsValue({
      nombre: producto.nombre,
      idWP: producto.idWP,
      img: producto.img,
      descripcion: producto.descripcion,
      precio: producto.precio,
      precio_regular: producto.precio_regular,
      link: producto.link,
      cantidad: producto.cantidad,
      porcetajeCalyaan: producto.porcetajeCalyaan,
      porcetajeProfesional: producto.porcetajeProfesional,
    });
    setIsModalVisible(true);
  };

  // Cerrar modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProducto(null);
    form.resetFields();
  };

  // Crear o actualizar producto
  const handleSubmit = async (values) => {
    try {
      if (isEditMode && selectedProducto?._id) {
        // Actualizar
        await clienteAxios.put(`/api/products/${selectedProducto._id}`, values);
        message.success("Producto actualizado exitosamente");
      } else {
        // Crear
        await clienteAxios.post("/api/products", values);
        message.success("Producto creado exitosamente");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchProductos(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Error al guardar producto:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        message: error.message
      });
      message.error(
        error.response?.data?.msg ||
          `Error al guardar el producto: ${error.response?.status || error.message}`
      );
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    try {
      await clienteAxios.delete(`/api/products/${id}`);
      message.success("Producto eliminado exitosamente");
      fetchProductos(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error("Error al eliminar producto:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        message: error.message
      });
      message.error(
        error.response?.data?.msg ||
          `Error al eliminar el producto: ${error.response?.status || error.message}`
      );
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: "Imagen",
      dataIndex: "img",
      key: "img",
      width: 80,
      render: (img) =>
        img ? (
          <Image
            width={50}
            height={50}
            src={img}
            alt="producto"
            style={{ objectFit: "cover", borderRadius: "4px" }}
          />
        ) : (
          <Tag color="default">Sin imagen</Tag>
        ),
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      width: 150,
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
      width: 200,
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            <span>{text.substring(0, 50)}...</span>
          </Tooltip>
        ) : (
          <Tag color="default">Sin descripción</Tag>
        ),
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      width: 100,
      render: (text) => (
        <span className="font-semibold text-green-600">${text}</span>
      ),
    },
    {
      title: "Precio Regular",
      dataIndex: "precio_regular",
      key: "precio_regular",
      width: 120,
      render: (text) => text ? `$${text}` : "-",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      width: 80,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Calyaan %",
      dataIndex: "porcetajeCalyaan",
      key: "porcetajeCalyaan",
      width: 100,
      render: (text) => <Tag color="purple">{text}%</Tag>,
    },
    {
      title: "Profesional %",
      dataIndex: "porcetajeProfesional",
      key: "porcetajeProfesional",
      width: 120,
      render: (text) => <Tag color="cyan">{text}%</Tag>,
    },
    {
      title: "Acciones",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            title="Editar"
          />
          <Popconfirm
            title="¿Eliminar producto?"
            description="¿Estás seguro de que deseas eliminar este producto?"
            onConfirm={() => handleDelete(record._id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              title="Eliminar"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showCreateModal}
          size="large"
        >
          Nuevo Producto
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={productos}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        onChange={(pag) => fetchProductos(pag.current, pag.pageSize)}
        scroll={{ x: 1200 }}
        bordered
      />

      {/* Modal para crear/editar */}
      <Modal
        title={isEditMode ? "Editar Producto" : "Crear Nuevo Producto"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[
              { required: true, message: "Por favor ingresa el nombre" },
            ]}
          >
            <Input placeholder="Nombre del producto" />
          </Form.Item>

          <Form.Item label="ID Wordpress" name="idWP">
            <Input placeholder="ID de Wordpress (opcional)" />
          </Form.Item>

          <Form.Item label="URL Imagen" name="img">
            <Input placeholder="https://ejemplo.com/imagen.jpg" />
          </Form.Item>

          <Form.Item label="Descripción" name="descripcion">
            <Input.TextArea
              rows={3}
              placeholder="Descripción del producto"
            />
          </Form.Item>

          <Form.Item
            label="Precio"
            name="precio"
            rules={[
              { required: true, message: "Por favor ingresa el precio" },
            ]}
          >
            <Input placeholder="Precio en pesos" />
          </Form.Item>

          <Form.Item label="Precio Regular" name="precio_regular">
            <Input placeholder="Precio regular (opcional)" />
          </Form.Item>

          <Form.Item label="Link" name="link">
            <Input placeholder="URL del producto (opcional)" />
          </Form.Item>

          <Form.Item
            label="Cantidad"
            name="cantidad"
            initialValue={1}
            rules={[
              { required: true, message: "Por favor ingresa la cantidad" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Porcentaje Calyaan (%)"
              name="porcetajeCalyaan"
              initialValue={39}
              rules={[
                { required: true, message: "Ingresa el porcentaje" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Porcentaje Profesional (%)"
              name="porcetajeProfesional"
              initialValue={61}
              rules={[
                { required: true, message: "Ingresa el porcentaje" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={handleCancel}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Actualizar" : "Crear"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SetProductos;
