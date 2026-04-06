import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import clienteAxios from "../config/axios";
import { getCaseSortDate } from "../helpers/careHub";

const buildUnreadCounts = async (items) => {
  const entries = await Promise.all(
    items.map(async (item) => {
      try {
        const { data } = await clienteAxios.get(`api/chat/stats/${item._id}`);
        return [item._id, data.unreadMessages || 0];
      } catch (error) {
        return [item._id, 0];
      }
    })
  );

  return Object.fromEntries(entries);
};

const sortCases = (items) =>
  [...items].sort((left, right) => {
    const leftDate = new Date(getCaseSortDate(left)).getTime() || 0;
    const rightDate = new Date(getCaseSortDate(right)).getTime() || 0;
    return rightDate - leftDate;
  });

const getInboxRequest = (role, user) => {
  if (role === "cliente" && user?._id) {
    return `api/usuarios/historial/${user._id}`;
  }

  if (role === "profesional" && user?.profesionalId) {
    return `api/profesional/historial/${user.profesionalId}`;
  }

  if (role === "admin") {
    return "api/ordenes/orden";
  }

  return null;
};

export const useCareInbox = ({ role, user }) => {
  const [items, setItems] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const requestPath = useMemo(() => getInboxRequest(role, user), [role, user]);

  useEffect(() => {
    let mounted = true;

    const loadInbox = async () => {
      if (!requestPath) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await clienteAxios.get(requestPath);
        const normalizedItems = sortCases((data || []).filter(Boolean));
        const counts = await buildUnreadCounts(normalizedItems);

        if (!mounted) return;
        setItems(normalizedItems);
        setUnreadCounts(counts);
      } catch (error) {
        const errorMsg =
          error.response?.data?.msg || "No pudimos cargar el inbox de casos";
        toast.error(errorMsg);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInbox();

    return () => {
      mounted = false;
    };
  }, [requestPath]);

  return {
    items,
    unreadCounts,
    loading,
  };
};

export const useCareCase = (id) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadCase = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await clienteAxios.get(`api/ordenes/getordenbyid/${id}`);
        if (mounted) {
          setItem(data);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.msg || "No pudimos cargar el caso";
        toast.error(errorMsg);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCase();

    return () => {
      mounted = false;
    };
  }, [id, reloadKey]);

  return {
    item,
    loading,
    reload: () => setReloadKey((current) => current + 1),
  };
};
