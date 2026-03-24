import { useState } from "react";

const API_URL = "https://functions.poehali.dev/8bac1c1b-d190-422d-bde9-e8ffa06d205d";

export default function WarrantyForm() {
  const [form, setForm] = useState({
    full_name: "",
    address: "",
    purchase_date: "",
    model: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ full_name: "", address: "", purchase_date: "", model: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="warranty" className="bg-neutral-50 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <p className="uppercase text-sm tracking-wide text-neutral-500 mb-4">Дополнительная гарантия</p>
        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
          ГАРАНТИЙНЫЙ ТАЛОН
        </h2>
        <p className="text-neutral-500 mb-10 text-base md:text-lg">
          Заполните анкету, чтобы зарегистрировать покупку и активировать расширенную гарантию
        </p>

        {status === "success" ? (
          <div className="bg-neutral-900 text-white p-8 text-center">
            <p className="text-xl font-semibold mb-2">Гарантия зарегистрирована!</p>
            <p className="text-neutral-400">Ваш талон сохранён. Храните чек как подтверждение покупки.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 border border-white text-white px-6 py-2 text-sm uppercase tracking-wide hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
            >
              Заполнить ещё раз
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wide text-neutral-500">ФИО *</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Иванов Иван Иванович"
                required
                className="border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900 transition-colors duration-200 bg-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-wide text-neutral-500">Адрес доставки *</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="г. Москва, ул. Ленина, д. 1, кв. 10"
                required
                className="border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900 transition-colors duration-200 bg-white"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs uppercase tracking-wide text-neutral-500">Дата покупки *</label>
                <input
                  name="purchase_date"
                  type="date"
                  value={form.purchase_date}
                  onChange={handleChange}
                  required
                  className="border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900 transition-colors duration-200 bg-white"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs uppercase tracking-wide text-neutral-500">Модель товара *</label>
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  placeholder="Диван «Комфорт-3»"
                  required
                  className="border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900 transition-colors duration-200 bg-white"
                />
              </div>
            </div>

            {status === "error" && (
              <p className="text-red-500 text-sm">Произошла ошибка. Попробуйте ещё раз.</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-black text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-neutral-800 transition-colors duration-300 cursor-pointer disabled:opacity-50 w-fit mt-2"
            >
              {status === "loading" ? "Сохраняем..." : "Зарегистрировать гарантию"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
