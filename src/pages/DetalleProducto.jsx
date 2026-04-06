import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, Divider, Space, InputNumber, message, Tag, Row, Col } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import clienteAxios from "../config/axios";
import { useCarrito } from "../hooks/useCarrito";
import { useSelector } from "react-redux";

/**
 * Componente para ver detalles de un producto y agregarlo al carrito
 */
const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [agregandoCarrito, setAgregandoCarrito] = useState(false);
  const { agregarItem } = useCarrito();
  const { user } = useSelector((state) => ({ ...state.auth }));

  window.scrollTo(0, 0);

  useEffect(() => {
    fetchProductoDetalle();
  }, [id]);

  const fetchProductoDetalle = async () => {
    setLoading(true);
    try {
      // Primero intenta obtener por ID directo
      try {
        const { data } = await clienteAxios.get(`/api/products/${id}`);
        const productoData = data.resultado || data.producto || data;
        
        if (productoData) {
          setProducto(productoData);
          return;
        }
      } catch (err) {
        console.log("Intento de búsqueda directa fallido, buscando en lista...");
      }

      // Si falla, obtén la lista completa y busca el producto
      const { data: listData } = await clienteAxios.get(`/api/products`);
      const productos = listData.resultado || listData.productos || listData || [];
      
      const productoEncontrado = Array.isArray(productos) 
        ? productos.find(p => String(p._id) === String(id))
        : null;

      if (productoEncontrado) {
        setProducto(productoEncontrado);
      } else {
        message.error("Producto no encontrado");
        navigate("/productos");
      }
    } catch (error) {
      console.error("Error al cargar producto:", error);
      message.error("Error al cargar el producto");
      navigate("/productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = async () => {
    if (!user) {
      message.warning("Debes iniciar sesión para agregar al carrito");
      navigate("/logindashboard");
      return;
    }

    if (!producto) {
      message.error("Producto no válido");
      return;
    }

    setAgregandoCarrito(true);

    try {
      // Transformar producto a formato compatible con carrito
      const itemProducto = {
        _id: producto._id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        img: producto.img,
        precio: producto.precio || 0,
        tipo: "producto", // Para diferenciarlo de disponibilidades
      };

      // Crear múltiples items si cantidad > 1
      for (let i = 0; i < cantidad; i++) {
        agregarItem(itemProducto, `producto-${producto._id}`, producto.nombre, producto.precio);
      }

      message.success(`¡${cantidad} producto(s) agregado(s) al carrito!`);
      setCantidad(1);

      // Scroll to top
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al agregar al carrito");
    } finally {
      setAgregandoCarrito(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Cargando producto..." />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-500">Producto no encontrado</p>
        <Button onClick={() => navigate("/productos")} className="mt-4">
          Volver a Productos
        </Button>
      </div>
    );
  }

  const precioDescuento = Number(producto.precio_regular) || 0;
  const precioBases = Number(producto.precio) || 0;
  const tieneDescuento = precioDescuento && precioDescuento > precioBases;
  const porcentajeDescuento = tieneDescuento
    ? Math.round(((precioDescuento - precioBases) / precioDescuento) * 100)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header con botón volver */}
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate("/productos")}
          className="mb-6"
        >
          Volver a Productos
        </Button>

        {/* Card principal */}
        <Card className="shadow-lg">
          <Row gutter={[32, 32]}>
            {/* Imagen */}
            <Col xs={24} sm={24} md={12} lg={10}>
              <div className="bg-white rounded-lg overflow-hidden">
                {producto.img ? (
                  <img
                    src={producto.img}
                    alt={producto.nombre}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: "500px" }}
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">Sin imagen disponible</span>
                  </div>
                )}
              </div>

              {/* Detalles de stock */}
              <div className="mt-4">
                {producto.stock ? (
                  <Tag color="green" className="text-sm py-1 px-3">
                    ✓ En Stock
                  </Tag>
                ) : (
                  <Tag color="red" className="text-sm py-1 px-3">
                    ✗ Agotado
                  </Tag>
                )}
              </div>
            </Col>

            {/* Información y acciones */}
            <Col xs={24} sm={24} md={12} lg={14}>
              {/* Título */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{producto.nombre}</h1>

              {/* Descripción */}
              {producto.descripcion && (
                <>
                  <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                    {producto.descripcion}
                  </p>
                  <Divider />
                </>
              )}

              {/* Precios */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-4xl font-bold text-green-600">
                    ${precioBases.toFixed(2)}
                  </span>
                  {tieneDescuento && (
                    <>
                      <span className="text-2xl text-gray-500 line-through">
                        ${precioDescuento.toFixed(2)}
                      </span>
                      <Tag color="red" className="text-sm">
                        -{porcentajeDescuento}%
                      </Tag>
                    </>
                  )}
                </div>
                {tieneDescuento && (
                  <p className="text-sm text-green-600 font-semibold">
                    ¡Ahorras ${(precioDescuento - precioBases).toFixed(2)}!
                  </p>
                )}
              </div>

              <Divider />

              {/* Información adicional */}
              <Space direction="vertical" className="w-full mb-6">
                {producto.tipo && (
                  <div>
                    <span className="font-semibold">Tipo:</span> {producto.tipo}
                  </div>
                )}
                {producto.categoria && (
                  <div>
                    <span className="font-semibold">Categoría:</span> {producto.categoria}
                  </div>
                )}
                {producto.sku && (
                  <div>
                    <span className="font-semibold">SKU:</span> {producto.sku}
                  </div>
                )}
              </Space>

              <Divider />

              {/* Cantidad y agregar carrito */}
              <Space direction="vertical" className="w-full mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Cantidad</label>
                  <InputNumber
                    min={1}
                    max={10}
                    value={cantidad}
                    onChange={(val) => setCantidad(val || 1)}
                    className="w-full md:w-32"
                    disabled={!producto.stock}
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAgregarAlCarrito}
                  loading={agregandoCarrito}
                  disabled={!producto.stock}
                  block
                  className="py-6 text-lg font-semibold"
                >
                  {producto.stock ? "Agregar al Carrito" : "Producto Agotado"}
                </Button>

                {!producto.stock && (
                  <p className="text-sm text-gray-500 text-center">
                    Este producto no está disponible en este momento
                  </p>
                )}
              </Space>

              {/* Información de compra */}
              <Card type="inner" className="bg-blue-50">
                <div className="space-y-2 text-sm">
                  <p>✓ Envío disponible a Misiones</p>
                  <p>✓ Garantía de satisfacción</p>
                  <p>✓ Soporte al cliente 24/7</p>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Descripción extendida */}
          {producto.descripcion_extendida && (
            <>
              <Divider />
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4">Detalles adicionales</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {producto.descripcion_extendida}
                </p>
              </div>
            </>
          )}

          {/* Tags/etiquetas */}
          {producto.tags && producto.tags.length > 0 && (
            <>
              <Divider />
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Características</h3>
                <Space wrap>
                  {producto.tags.map((tag, idx) => (
                    <Tag key={idx} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </Space>
              </div>
            </>
          )}
        </Card>

        {/* Productos relacionados */}
        <div className="mt-12 text-center">
          <Button 
            type="default" 
            size="large"
            onClick={() => navigate("/productos")}
          >
            Ver más productos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
