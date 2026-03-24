import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://functions.poehali.dev/73974f70-7270-4f9f-9a2d-b93333c1b965", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="bg-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight">
          ОСТАВИТЬ ЗАЯВКУ
        </h2>
        <p className="text-neutral-500 mb-10 text-base md:text-lg">
          Расскажите, что вас интересует — мы свяжемся и поможем с выбором
        </p>

        {status === "success" ? (
          <div className="bg-neutral-900 text-white p-8 text-center">
            <p className="text-xl font-semibold mb-2">Заявка отправлена!</p>
            <p className="text-neutral-400">Мы свяжемся с вами в ближайшее время</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 border border-white text-white px-6 py-2 text-sm uppercase tracking-wide hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
            >
              Отправить ещё
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ваше имя *"
              required
              className="border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900 transition-colors duration-200"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Телефон *"
              required
              className="border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900 transition-colors duration-200"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Что вас интересует? (необязательно)"
              rows={4}
              className="border border-neutral-300 px-4 py-3 text-base outline-none focus:border-neutral-900 transition-colors duration-200 resize-none"
            />
            {status === "error" && (
              <p className="text-red-500 text-sm">Произошла ошибка. Попробуйте ещё раз.</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-black text-white px-6 py-3 text-sm uppercase tracking-wide hover:bg-neutral-800 transition-colors duration-300 cursor-pointer disabled:opacity-50 w-fit"
            >
              {status === "loading" ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
