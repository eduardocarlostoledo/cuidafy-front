import React, { useEffect, useState } from "react";
import clienteAxios from "../../../../config/axios";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { setAccessToken } from "../../../../helpers/Components/afipAccessToken";
import { resetUserAndConfirm } from "../../../../helpers/admin/resetUserAndConfirm";

const initialCoupon = {
  codigo: "",
  tipoDescuento: "",
  descuento: "",
  vencimiento: "",
};

const initialAfipConfig = {
  AFIP_ACCESS_TOKEN: "",
  AFIP_CUIT: "",
  AFIP_PTO_VTA: "1",
  AFIP_PRODUCTION: "false",
  AFIP_CERT_PATH: "",
  AFIP_KEY_PATH: "",
  AFIP_CBTE_TIPO: "11",
  AFIP_CONCEPTO: "1",
  AFIP_DOC_TIPO: "96",
  AFIP_CONDICION_IVA_RECEPTOR: "5",
  AFIP_CURRENCY_ID: "PES",
  AFIP_CURRENCY_RATE: "1",
  AFIP_IVA_ID: "5",
};

const initialAutomation = {
  username: "",
  password: "",
  alias: "calyaan-dev",
  wsid: "wsfe",
  numero: "1",
  sistema: "RECE",
  nombreFantasia: "Calyaan",
};

const initialTestInvoice = {
  identification: "11111111",
  docTipo: "96",
  ivaCondition: "5",
  documentId: "11",
  pointOfSale: "1",
  concept: "1",
  net: "100",
  iva: "21",
  total: "121",
  itemDescription: "Servicio de prueba",
  observations: "Factura de prueba generada desde panel admin",
};

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const Card = ({ title, children }) => (
  <div className="rounded bg-white shadow p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <label className="block mb-3">
    <span className="block text-sm font-semibold text-gray-700 mb-1">{label}</span>
    {children}
  </label>
);

const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring ${props.className || ""}`}
  />
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`rounded px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-bgHover ${className}`}
  >
    {children}
  </button>
);

const Tools = () => {
  const [minDate, setMinDate] = useState("");
  const [coupon, setCoupon] = useState(initialCoupon);
  const [cuponesNoVigentes, setCuponesNoVigentes] = useState([]);
  const [cuponesVigentes, setCuponesVigentes] = useState([]);
  const [emailReset, setEmailReset] = useState("");
  const [passwordReset, setPasswordReset] = useState("");
  const [afipConfig, setAfipConfig] = useState(initialAfipConfig);
  const [automationForm, setAutomationForm] = useState(initialAutomation);
  const [afipStatus, setAfipStatus] = useState(null);
  const [automationResponse, setAutomationResponse] = useState(null);
  const [salesPoints, setSalesPoints] = useState([]);
  const [testInvoice, setTestInvoice] = useState(initialTestInvoice);
  const [testInvoiceResult, setTestInvoiceResult] = useState(null);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setMinDate(today.toISOString().split("T")[0]);
  }, []);

  const loadCoupons = async () => {
    try {
      const { data } = await clienteAxios.get(`/api/coupon/list-coupons`);
      setCuponesVigentes(data?.cuponesVigentes || []);
      setCuponesNoVigentes(data?.cuponesNoVigentes || []);
    } catch (error) {
      toast.error(error.response?.data?.msg || "No pudimos cargar cupones");
    }
  };

  const loadAfipConfig = async () => {
    try {
      const { data } = await clienteAxios.get("/api/afip/config", {
        headers: authHeaders(),
      });
      setAfipConfig((prev) => ({ ...prev, ...data.values }));
    } catch (error) {
      toast.error(error.response?.data?.message || "No pudimos leer la configuración AFIP");
    }
  };

  const loadAfipStatus = async () => {
    try {
      const { data } = await clienteAxios.get("/api/afip/status");
      setAfipStatus(data);
      setSalesPoints(data.salesPoints || []);
    } catch (error) {
      const fallback = error.response?.data?.status || null;
      setAfipStatus(fallback);
      toast.error(error.response?.data?.message || "No pudimos consultar el estado AFIP");
    }
  };

  useEffect(() => {
    loadCoupons();
    loadAfipConfig();
    loadAfipStatus();
  }, []);

  const handleCouponChange = (e) => {
    setCoupon((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    if (Object.values(coupon).includes("")) {
      return toast.error("Todos los campos del cupón son obligatorios");
    }

    try {
      const { data } = await clienteAxios.post(`/api/coupon`, coupon);
      toast.success(data.msg);
      setCoupon(initialCoupon);
      loadCoupons();
    } catch (error) {
      toast.error(error.response?.data?.msg || "No pudimos crear el cupón");
    }
  };

  const eliminarCupon = async (couponId) => {
    try {
      const { data } = await clienteAxios.patch(`/api/coupon/delete/${couponId}`);
      toast.success(data.msg);
      loadCoupons();
    } catch (error) {
      toast.error(error.response?.data?.msg || "No pudimos eliminar el cupón");
    }
  };

  const handleResetUser = async (e) => {
    e.preventDefault();

    if (!emailReset || !passwordReset) {
      return toast.error("E-mail y contraseña son necesarios");
    }

    try {
      await resetUserAndConfirm({ email: emailReset, password: passwordReset });
      toast.success("Cuenta reseteada con éxito");
      setEmailReset("");
      setPasswordReset("");
    } catch (error) {
      toast.error(error.response?.data?.msg || "No pudimos resetear el usuario");
    }
  };

  const handleAfipConfigChange = (e) => {
    setAfipConfig((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveAfipConfig = async (e) => {
    e.preventDefault();

    try {
      const { data } = await clienteAxios.put("/api/afip/config", afipConfig, {
        headers: authHeaders(),
      });
      setAfipConfig((prev) => ({ ...prev, ...data.values }));
      toast.success("Configuración AFIP guardada en .env");
      await loadAfipStatus();
    } catch (error) {
      toast.error(error.response?.data?.message || "No pudimos guardar la configuración");
    }
  };

  const handleAutomationChange = (e) => {
    setAutomationForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const ensureAfipSession = async () => {
    const { data } = await clienteAxios.post("/api/afip/auth");
    setAccessToken(data.access_token);
    return data;
  };

  const runAutomation = async (endpoint, body) => {
    try {
      await ensureAfipSession();
      const payload = {
        cuit: afipConfig.AFIP_CUIT,
        ...body,
      };
      const { data } = await clienteAxios.post(endpoint, payload);
      setAutomationResponse(data);
      toast.success("Automatización ejecutada");
      await loadAfipStatus();
      return data;
    } catch (error) {
      setAutomationResponse(error.response?.data || null);
      toast.error(error.response?.data?.message || "No pudimos ejecutar la automatización");
      return null;
    }
  };

  const createCert = async (mode) =>
    runAutomation(`/api/afip/automation/create-cert/${mode}`, {
      username: automationForm.username,
      password: automationForm.password,
      alias: automationForm.alias,
    });

  const authorizeWs = async (mode) =>
    runAutomation(`/api/afip/automation/authorize-ws/${mode}`, {
      username: automationForm.username,
      password: automationForm.password,
      alias: automationForm.alias,
      wsid: automationForm.wsid,
    });

  const listSalesPoints = async () => {
    const data = await runAutomation(`/api/afip/automation/list-sales-points`, {
      username: automationForm.username,
      password: automationForm.password,
    });

    const extracted = data?.data?.sales_points || data?.data?.points_of_sale || data?.data || [];
    setSalesPoints(Array.isArray(extracted) ? extracted : []);
  };

  const createSalesPoint = async () =>
    runAutomation(`/api/afip/automation/create-sales-point`, {
      username: automationForm.username,
      password: automationForm.password,
      numero: Number(automationForm.numero),
      sistema: automationForm.sistema,
      nombreFantasia: automationForm.nombreFantasia,
    });

  const handleTestInvoiceChange = (e) => {
    setTestInvoice((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createTestInvoice = async () => {
    try {
      await ensureAfipSession();
      const payload = {
        ...testInvoice,
        identification: testInvoice.identification,
        docTipo: Number(testInvoice.docTipo),
        ivaCondition: Number(testInvoice.ivaCondition),
        documentId: Number(testInvoice.documentId),
        pointOfSale: Number(testInvoice.pointOfSale || afipConfig.AFIP_PTO_VTA || 1),
        concept: Number(testInvoice.concept),
        net: Number(testInvoice.net),
        iva: Number(testInvoice.iva),
        total: Number(testInvoice.total),
      };

      const { data } = await clienteAxios.post("/api/afip/invoice/test", payload);
      setTestInvoiceResult(data);
      toast.success("Factura de prueba emitida");
    } catch (error) {
      setTestInvoiceResult(error.response?.data || null);
      toast.error(error.response?.data?.message || "No pudimos emitir la factura de prueba");
    }
  };

  const renderCouponList = (title, items) => (
    <div className="mb-8">
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No se encontraron cupones</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="rounded border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm">
                  <p className="font-semibold">{item.codigo}</p>
                  <p className="text-gray-600">
                    Vence: {item?.vencimiento?.split("T")[0] || "Sin fecha"}
                  </p>
                  <p className="text-gray-600">
                    {item.tipoDescuento === "valor" ? (
                      <NumericFormat
                        value={item.descuento}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"}
                      />
                    ) : (
                      `${item.descuento}%`
                    )}
                  </p>
                </div>
                <button
                  onClick={() => eliminarCupon(item._id)}
                  className="rounded border border-red-600 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Herramientas</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card title="Cupones">
          <form onSubmit={handleCreateCoupon} className="grid gap-3 md:grid-cols-2">
            <Field label="Código">
              <Input name="codigo" value={coupon.codigo} onChange={handleCouponChange} />
            </Field>
            <Field label="Tipo de descuento">
              <select
                name="tipoDescuento"
                value={coupon.tipoDescuento}
                onChange={handleCouponChange}
                className="w-full rounded border px-3 py-2 text-sm"
              >
                <option value="">Seleccionar</option>
                <option value="porcentaje">Porcentaje</option>
                <option value="valor">Valor</option>
              </select>
            </Field>
            <Field label="Descuento">
              <Input name="descuento" value={coupon.descuento} onChange={handleCouponChange} />
            </Field>
            <Field label="Vencimiento">
              <Input
                type="date"
                min={minDate}
                name="vencimiento"
                value={coupon.vencimiento}
                onChange={handleCouponChange}
              />
            </Field>
            <div className="md:col-span-2">
              <Button type="submit">Crear cupón</Button>
            </div>
          </form>

          <div className="mt-8">
            {renderCouponList("Cupones vigentes", cuponesVigentes)}
            {renderCouponList("Cupones vencidos", cuponesNoVigentes)}
          </div>
        </Card>

        <Card title="Onboarding AfipSDK">
          <form onSubmit={saveAfipConfig} className="grid gap-3 md:grid-cols-2">
            {Object.entries(afipConfig).map(([key, value]) => (
              <Field key={key} label={key}>
                {key === "AFIP_PRODUCTION" ? (
                  <select
                    name={key}
                    value={value}
                    onChange={handleAfipConfigChange}
                    className="w-full rounded border px-3 py-2 text-sm"
                  >
                    <option value="false">false</option>
                    <option value="true">true</option>
                  </select>
                ) : (
                  <Input
                    name={key}
                    value={value}
                    onChange={handleAfipConfigChange}
                    type={key.includes("TOKEN") ? "password" : "text"}
                  />
                )}
              </Field>
            ))}
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit">Guardar configuración en .env</Button>
              <button
                type="button"
                onClick={loadAfipStatus}
                className="rounded border px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Refrescar estado
              </button>
            </div>
          </form>

          <div className="mt-6 rounded border bg-gray-50 p-4 text-sm">
            <p className="font-semibold mb-2">Estado actual</p>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(afipStatus, null, 2)}
            </pre>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Field label="Usuario AFIP">
              <Input
                name="username"
                value={automationForm.username}
                onChange={handleAutomationChange}
              />
            </Field>
            <Field label="Password AFIP">
              <Input
                type="password"
                name="password"
                value={automationForm.password}
                onChange={handleAutomationChange}
              />
            </Field>
            <Field label="Alias certificado">
              <Input
                name="alias"
                value={automationForm.alias}
                onChange={handleAutomationChange}
              />
            </Field>
            <Field label="Web service">
              <Input name="wsid" value={automationForm.wsid} onChange={handleAutomationChange} />
            </Field>
            <Field label="Número punto de venta">
              <Input
                name="numero"
                value={automationForm.numero}
                onChange={handleAutomationChange}
              />
            </Field>
            <Field label="Sistema">
              <Input
                name="sistema"
                value={automationForm.sistema}
                onChange={handleAutomationChange}
              />
            </Field>
            <Field label="Nombre de fantasía">
              <Input
                name="nombreFantasia"
                value={automationForm.nombreFantasia}
                onChange={handleAutomationChange}
              />
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={() => createCert("dev")}>
              Crear certificado dev
            </Button>
            <Button type="button" onClick={() => createCert("prod")}>
              Crear certificado prod
            </Button>
            <Button type="button" onClick={() => authorizeWs("dev")}>
              Autorizar wsfe dev
            </Button>
            <Button type="button" onClick={() => authorizeWs("prod")}>
              Autorizar wsfe prod
            </Button>
            <Button type="button" onClick={listSalesPoints}>
              Listar puntos de venta
            </Button>
            <Button type="button" onClick={createSalesPoint}>
              Crear punto de venta
            </Button>
          </div>

          <div className="mt-6 rounded border bg-gray-50 p-4 text-sm">
            <p className="font-semibold mb-2">Respuesta de automatización</p>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(automationResponse, null, 2)}
            </pre>
          </div>

          <div className="mt-6 rounded border bg-gray-50 p-4 text-sm">
            <p className="font-semibold mb-2">Puntos de venta</p>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(salesPoints, null, 2)}
            </pre>
          </div>
        </Card>

        <Card title="Resetear Usuario">
          <form onSubmit={handleResetUser} className="grid gap-3">
            <Field label="Email">
              <Input
                type="email"
                value={emailReset}
                onChange={(e) => setEmailReset(e.target.value)}
              />
            </Field>
            <Field label="Contraseña">
              <Input
                type="password"
                value={passwordReset}
                onChange={(e) => setPasswordReset(e.target.value)}
              />
            </Field>
            <div>
              <Button type="submit">Resetear usuario y confirmar cuenta</Button>
            </div>
          </form>
        </Card>

        <Card title="Probar Emisión AFIP">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Documento cliente">
              <Input
                name="identification"
                value={testInvoice.identification}
                onChange={handleTestInvoiceChange}
              />
            </Field>
            <Field label="Tipo doc">
              <Input
                name="docTipo"
                value={testInvoice.docTipo}
                onChange={handleTestInvoiceChange}
              />
            </Field>
            <Field label="Condición IVA receptor">
              <Input
                name="ivaCondition"
                value={testInvoice.ivaCondition}
                onChange={handleTestInvoiceChange}
              />
            </Field>
            <Field label="Tipo comprobante">
              <Input
                name="documentId"
                value={testInvoice.documentId}
                onChange={handleTestInvoiceChange}
              />
            </Field>
            <Field label="Punto de venta">
              <Input
                name="pointOfSale"
                value={testInvoice.pointOfSale}
                onChange={handleTestInvoiceChange}
              />
            </Field>
            <Field label="Concepto">
              <Input
                name="concept"
                value={testInvoice.concept}
                onChange={handleTestInvoiceChange}
              />
            </Field>
            <Field label="Importe neto">
              <Input name="net" value={testInvoice.net} onChange={handleTestInvoiceChange} />
            </Field>
            <Field label="IVA">
              <Input name="iva" value={testInvoice.iva} onChange={handleTestInvoiceChange} />
            </Field>
            <Field label="Total">
              <Input name="total" value={testInvoice.total} onChange={handleTestInvoiceChange} />
            </Field>
            <Field label="Descripción ítem">
              <Input
                name="itemDescription"
                value={testInvoice.itemDescription}
                onChange={handleTestInvoiceChange}
              />
            </Field>
            <Field label="Observaciones">
              <Input
                name="observations"
                value={testInvoice.observations}
                onChange={handleTestInvoiceChange}
              />
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={createTestInvoice}>
              Emitir factura de prueba
            </Button>
          </div>

          <div className="mt-6 rounded border bg-gray-50 p-4 text-sm">
            <p className="font-semibold mb-2">Resultado prueba de emisión</p>
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(testInvoiceResult, null, 2)}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Tools;
