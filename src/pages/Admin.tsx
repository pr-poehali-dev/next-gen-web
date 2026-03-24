import { useState } from "react";

const API_URL = "https://functions.poehali.dev/0a421c6f-ce20-4225-b628-7f8745497492";

interface Lead {
  id: number;
  name: string;
  phone: string;
  message: string;
  created_at: string;
}

export default function Admin() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLeads = async (adminKey: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        headers: { "X-Admin-Key": adminKey },
      });
      if (res.status === 401) {
        setError("Неверный пароль");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setAuthed(true);
    } catch {
      setError("Ошибка соединения");
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads(key);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-sm p-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight uppercase">Администратор</h1>
          <p className="text-neutral-500 text-sm mb-6">Введите пароль для просмотра заявок</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Пароль"
              required
              className="border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900 transition-colors duration-200"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight uppercase">Заявки</h1>
            <p className="text-neutral-500 text-sm mt-1">Всего: {leads.length}</p>
          </div>
          <button
            onClick={() => fetchLeads(key)}
            className="border border-neutral-900 text-neutral-900 px-4 py-2 text-sm uppercase tracking-wide hover:bg-neutral-900 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Обновить
          </button>
        </div>

        {leads.length === 0 ? (
          <div className="bg-white p-12 text-center text-neutral-400">
            Заявок пока нет
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-4 mb-2">
                    <span className="font-semibold text-neutral-900 text-lg">{lead.name}</span>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-neutral-600 hover:text-black transition-colors duration-200"
                    >
                      {lead.phone}
                    </a>
                  </div>
                  {lead.message && (
                    <p className="text-neutral-500 text-sm">{lead.message}</p>
                  )}
                </div>
                <div className="text-neutral-400 text-xs whitespace-nowrap shrink-0 pt-1">
                  {formatDate(lead.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
