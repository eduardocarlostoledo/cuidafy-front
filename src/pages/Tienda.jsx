import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spin, message, Empty, Row, Col } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import clienteAxios from "../config/axios";

/**
 * Componente Tienda - Catálogo de productos
 * Mapea /api/products y permite agregar productos al carrito
 * Redirige a /servicio?id=productoId
 */
const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  window.scrollTo(0, 0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Consumir ambos endpoints en paralelo
      const [productosRes, disponibilidadesRes] = await Promise.all([
        clienteAxios.get("/api/products"),
        clienteAxios.get("/api/profesional/disponibilidades-totales"),
      ]);
      
      // Manejar diferentes estructuras de respuesta para productos
      const productosData = Array.isArray(productosRes.data) 
        ? productosRes.data 
        : (productosRes.data.resultados || productosRes.data.productos || productosRes.data.data || []);
      
      // Manejar diferentes estructuras de respuesta para disponibilidades
      const disponibilidadesData = Array.isArray(disponibilidadesRes.data)
        ? disponibilidadesRes.data
        : (disponibilidadesRes.data.resultados || disponibilidadesRes.data.data || []);
      
      setProductos(productosData);
      setDisponibilidades(disponibilidadesData);
      
      console.log("Productos obtenidos:", productosData);
      console.log("Disponibilidades obtenidas:", disponibilidadesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      message.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = (producto) => {
    // Validar que haya stock
    if (!tieneStock(producto)) {
      message.warning("Este producto no tiene stock disponible");
      return;
    }
    
    // Navegar a /servicio?id=productoId
    // El componente Service.jsx se encargará de manejar el producto
    navigate(`/servicio?id=${producto._id}`);
  };

  /**
   * Verifica si hay coincidencia entre producto.nombre y disponibilidades
   * creador.especialidad es un ARRAY de especialidades
   * Si existe al menos una disponibilidad que incluya el nombre del producto
   * en su array de especialidades, entonces el producto tiene stock
   */
  const tieneStock = (producto) => {
    return disponibilidades.some((disp) => {
      // Validar que exista creador y especialidad
      if (!disp.creador || !disp.creador.especialidad) return false;
      
      // creador.especialidad es un array, verificar si contiene el nombre del producto
      const especialidades = Array.isArray(disp.creador.especialidad)
        ? disp.creador.especialidad
        : [disp.creador.especialidad];
      
      return especialidades.includes(producto.nombre);
    });
  };

  /**
   * Obtiene la cantidad de especialistas disponibles para un producto
   */
  const obtenerCantidadEspecialistas = (producto) => {
    return disponibilidades.filter((disp) => {
      if (!disp.creador || !disp.creador.especialidad) return false;
      
      const especialidades = Array.isArray(disp.creador.especialidad)
        ? disp.creador.especialidad
        : [disp.creador.especialidad];
      
      return especialidades.includes(producto.nombre);
    }).length;
  };

  // Filtrar solo productos que tienen stock (coincidencias en disponibilidades)
  const productosConStock = productos.filter((p) => tieneStock(p));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <hr className="my-4" />

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tienda</h1>
          <p className="text-gray-600">
            Explora nuestros productos y agrega los que deseas a tu carrito
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : productos.length === 0 ? (
          <Empty
            description="No hay productos disponibles"
            style={{ marginTop: 60, marginBottom: 60 }}
          />
        ) : productosConStock.length === 0 ? (
          <Empty
            description="No hay productos disponibles con especialistas"
            style={{ marginTop: 60, marginBottom: 60 }}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {productosConStock.map((producto) => (
              <Col key={producto._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="h-full flex flex-col"
                  cover={
                    producto.img && (
                      <div className="h-48 overflow-hidden">
                        <img
                          alt={producto.nombre}
                          src={producto.img}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    )
                  }
                >
                  <div className="flex flex-col flex-grow">
                    {/* Nombre */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {producto.nombre}
                    </h3>

                    {/* Descripción */}
                    {producto.descripcion && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {producto.descripcion}
                      </p>
                    )}

                    {/* Precio */}
                    <div className="mb-4 mt-auto">
                      <p className="text-2xl font-bold text-green-600">
                        ${(Number(producto.precio) || 0).toFixed(2)}
                      </p>
                      {producto.precio_regular && 
                        Number(producto.precio_regular) > Number(producto.precio) && (
                        <p className="text-sm text-gray-500 line-through">
                          ${(Number(producto.precio_regular) || 0).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="mb-4">
                      {(() => {
                        const cantidad = obtenerCantidadEspecialistas(producto);
                        return (
                          <span className="text-xs text-green-600 font-semibold">
                            ✓ {cantidad} especialista{cantidad !== 1 ? "s" : ""} disponible{cantidad !== 1 ? "s" : ""}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Botón */}
                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAgregarAlCarrito(producto)}
                    >
                      Agregar al Carrito
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Tienda;
