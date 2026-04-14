import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  formatGeorefLocation,
  parseGeorefLocation,
} from "../helpers/georefLocation";

const GEOREF_API = "https://apis.datos.gob.ar/georef/api";

const baseSelectClassName =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring";

const sortByName = (items = []) =>
  [...items].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

const prioritizeItem = (items = [], expectedName) => {
  if (!expectedName) {
    return items;
  }

  const index = items.findIndex(
    (item) => item.nombre.toLowerCase() === expectedName.toLowerCase()
  );

  if (index === -1) {
    return items;
  }

  const reordered = [...items];
  const [item] = reordered.splice(index, 1);
  reordered.unshift(item);
  return reordered;
};

const normalizeStructuredValue = (value) => {
  if (!value) {
    return { provincia: "", municipio: "", localidad: "", isStructured: true };
  }

  if (typeof value === "string") {
    return parseGeorefLocation(value);
  }

  return {
    provincia: value.provincia || "",
    municipio: value.municipio || "",
    localidad: value.localidad || "",
    isStructured: true,
  };
};

const GeorefLocationSelector = ({
  value = "",
  onChange,
  disabled = false,
  className = "",
  selectClassName = "",
  labels = {},
}) => {
  const normalizedValue = useMemo(() => normalizeStructuredValue(value), [value]);
  const [provincias, setProvincias] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [loading, setLoading] = useState({
    provincias: false,
    municipios: false,
    localidades: false,
  });

  useEffect(() => {
    setSelectedProvincia(normalizedValue.provincia || "");
    setSelectedMunicipio(normalizedValue.municipio || "");
    setSelectedLocalidad(normalizedValue.localidad || "");
  }, [
    normalizedValue.localidad,
    normalizedValue.municipio,
    normalizedValue.provincia,
  ]);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        setLoading((prev) => ({ ...prev, provincias: true }));
        const response = await axios.get(`${GEOREF_API}/provincias`);
        const ordered = prioritizeItem(
          sortByName(response.data?.provincias || []),
          "Buenos Aires"
        );
        setProvincias(ordered);
      } catch (error) {
        console.error("Error al obtener provincias desde Georef", error);
        setProvincias([]);
      } finally {
        setLoading((prev) => ({ ...prev, provincias: false }));
      }
    };

    fetchProvincias();
  }, []);

  useEffect(() => {
    const fetchMunicipios = async () => {
      if (!selectedProvincia) {
        setMunicipios([]);
        setLocalidades([]);
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, municipios: true }));
        const response = await axios.get(`${GEOREF_API}/municipios`, {
          params: {
            provincia: selectedProvincia,
            max: 1000,
          },
        });

        const ordered = prioritizeItem(
          sortByName(response.data?.municipios || []),
          selectedProvincia.toLowerCase() === "buenos aires" ? "La Plata" : ""
        );

        setMunicipios(ordered);
      } catch (error) {
        console.error("Error al obtener municipios desde Georef", error);
        setMunicipios([]);
      } finally {
        setLoading((prev) => ({ ...prev, municipios: false }));
      }
    };

    fetchMunicipios();
  }, [selectedProvincia]);

  useEffect(() => {
    const fetchLocalidades = async () => {
      if (!selectedProvincia || !selectedMunicipio) {
        setLocalidades([]);
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, localidades: true }));
        const response = await axios.get(`${GEOREF_API}/localidades`, {
          params: {
            provincia: selectedProvincia,
            municipio: selectedMunicipio,
            max: 1000,
          },
        });

        setLocalidades(sortByName(response.data?.localidades || []));
      } catch (error) {
        console.error("Error al obtener localidades desde Georef", error);
        setLocalidades([]);
      } finally {
        setLoading((prev) => ({ ...prev, localidades: false }));
      }
    };

    fetchLocalidades();
  }, [selectedMunicipio, selectedProvincia]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange({
      provincia: selectedProvincia,
      municipio: selectedMunicipio,
      localidad: selectedLocalidad,
      label: formatGeorefLocation({
        provincia: selectedProvincia,
        municipio: selectedMunicipio,
        localidad: selectedLocalidad,
      }),
    });
  }, [selectedLocalidad, selectedMunicipio, selectedProvincia]);

  const currentValueIsLegacy =
    typeof value === "string" && value.trim() && !normalizedValue.isStructured;
  const mergedSelectClassName = selectClassName
    ? `${baseSelectClassName} ${selectClassName}`
    : baseSelectClassName;

  return (
    <div className={`grid gap-3 md:grid-cols-3 ${className}`.trim()}>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase text-blueGray-600">
          {labels.provincia || "Provincia"}
        </span>
        <select
          value={selectedProvincia}
          disabled={disabled || loading.provincias}
          onChange={(event) => {
            const nextProvincia = event.target.value;
            setSelectedProvincia(nextProvincia);
            setSelectedMunicipio("");
            setSelectedLocalidad("");
            setMunicipios([]);
            setLocalidades([]);
          }}
          className={mergedSelectClassName}
        >
          <option value="">
            {loading.provincias ? "Cargando provincias..." : "-- Seleccionar provincia --"}
          </option>
          {provincias.map((provincia) => (
            <option key={provincia.id} value={provincia.nombre}>
              {provincia.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase text-blueGray-600">
          {labels.municipio || "Municipio"}
        </span>
        <select
          value={selectedMunicipio}
          disabled={disabled || !selectedProvincia || loading.municipios}
          onChange={(event) => {
            setSelectedMunicipio(event.target.value);
            setSelectedLocalidad("");
            setLocalidades([]);
          }}
          className={mergedSelectClassName}
        >
          <option value="">
            {loading.municipios ? "Cargando municipios..." : "-- Seleccionar municipio --"}
          </option>
          {municipios.map((municipio) => (
            <option key={municipio.id} value={municipio.nombre}>
              {municipio.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase text-blueGray-600">
          {labels.localidad || "Localidad"}
        </span>
        <select
          value={selectedLocalidad}
          disabled={disabled || !selectedMunicipio || loading.localidades}
          onChange={(event) => setSelectedLocalidad(event.target.value)}
          className={mergedSelectClassName}
        >
          <option value="">
            {loading.localidades ? "Cargando localidades..." : "-- Seleccionar localidad --"}
          </option>
          {localidades.map((localidad) => (
            <option key={localidad.id} value={localidad.nombre}>
              {localidad.nombre}
            </option>
          ))}
        </select>
      </label>

      {currentValueIsLegacy && (
        <p className="md:col-span-3 text-xs text-amber-700">
          Valor actual legado: {value}. Si editas este campo se guardará con el formato nuevo de
          Argentina.
        </p>
      )}
    </div>
  );
};

export default GeorefLocationSelector;
