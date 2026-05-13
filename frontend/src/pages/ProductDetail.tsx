import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { products } from "../data/products";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const ProductDetail = () => {
  const { id = "1" } = useParams();
  const [selectedSize, setSelectedSize] = useState("M");
  const [commentText, setCommentText] = useState("");
  const [selectedCommentRating, setSelectedCommentRating] = useState(0);

  const product = useMemo(
    () => products.find((p) => p.id === id) ?? products[0],
    [id],
  );
  const [comments, setComments] = useState(product.comments);
  const [helpfulSelectionByComment, setHelpfulSelectionByComment] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    setComments(product.comments);
    setHelpfulSelectionByComment({});
  }, [product]);

  const ratingAvg =
    comments.reduce((acc, c) => acc + c.rating, 0) / comments.length;
  // Mock hasta conectar auth + compras reales del backend.
  const currentUser = {
    name: "Usuario demo",
    purchasedProductIds: products.map((p) => p.id),
  };
  const canComment = currentUser.purchasedProductIds.includes(product.id);

  const handleCommentSubmit = () => {
    if (!canComment || !commentText.trim() || selectedCommentRating === 0)
      return;

    const newComment = {
      id: Date.now(),
      user: currentUser.name.toLowerCase().replace(/\s+/g, "_"),
      date: "ahora",
      text: commentText.trim(),
      rating: selectedCommentRating,
      helpfulYes: 0,
      helpfulNo: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    setSelectedCommentRating(0);
  };

  const handleHelpfulVote = (commentId: number, voteType: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id !== commentId) return comment;

        const prevVote = helpfulSelectionByComment[commentId];
        let helpfulYes = comment.helpfulYes;
        let helpfulNo = comment.helpfulNo;

        if (prevVote === "yes") helpfulYes = Math.max(0, helpfulYes - 1);
        if (prevVote === "no") helpfulNo = Math.max(0, helpfulNo - 1);

        if (voteType === "yes") helpfulYes += 1;
        if (voteType === "no") helpfulNo += 1;

        return { ...comment, helpfulYes, helpfulNo };
      }),
    );

    setHelpfulSelectionByComment((prev) => ({
      ...prev,
      [commentId]: voteType,
    }));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto py-4 sm:py-8 md:py-12 space-y-6 sm:space-y-8"
    >
      <div className="text-xs font-mono text-base-content/50 uppercase tracking-[0.2em] flex items-center gap-2">
        <Link to="/" className="hover:text-base-content transition-colors">
          Inicio
        </Link>
        <span className="text-base-content/30">/</span>
        <span>Producto</span>
        <span className="text-base-content/30">/</span>
        <span className="text-base-content font-bold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <article className="bg-base-200 border-2 sm:border-4 border-black shadow-brutal">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="min-h-[240px] sm:min-h-[380px] bg-base-300 border-b-2 sm:border-b-4 lg:border-b-0 lg:border-r-4 border-black flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,26,26,0.15) 3px, rgba(139,26,26,0.15) 6px)",
                }}
              />
              <div className="w-full max-w-sm aspect-square bg-base-200 border-4 border-base-300 flex flex-col items-center justify-center text-base-content/30 gap-3 glitch-hover relative z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                    d="M20.38 3.46 16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"
                  />
                </svg>
                <span className="text-xs uppercase tracking-[0.3em] font-impact">
                  Imagen del producto
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-warning font-impact">
                  {product.brand}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-impact uppercase leading-tight tracking-wider text-base-content">
                  {product.name}
                </h1>
                <p className="text-xs text-base-content/50 mt-2 uppercase tracking-[0.2em] font-mono">
                  5 cuotas de {formatPrice(Math.round(product.price / 5))}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-impact text-base-content tracking-wider">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm line-through text-base-content/30 font-mono">
                  {formatPrice(product.oldPrice)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-impact text-base-content/50 mb-2">
                  Talle
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.inStock}
                      className={`min-w-12 px-3 py-2 font-impact tracking-wider text-sm border-2 border-black rounded-none transition-all ${
                        selectedSize === size
                          ? "bg-primary text-primary-content shadow-brutal-sm"
                          : "bg-base-300 text-base-content/60 hover:border-primary/50 hover:text-base-content"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {!product.inStock && (
                <div className="bg-error/10 border-2 border-error p-4 text-center">
                  <p className="text-warning font-impact uppercase tracking-[0.2em]">
                    Producto sin stock
                  </p>
                  <p className="text-warning/60 text-xs font-mono mt-1">
                    Próximamente disponible
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="flex-1 bg-primary text-primary-content font-impact uppercase tracking-[0.2em] py-4 border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Comprar ahora" : "Sin stock"}
                </button>
                <button
                  className="flex-1 bg-base-300 text-base-content font-impact uppercase tracking-[0.2em] py-4 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Agregar al carrito" : "Sin stock"}
                </button>
              </div>

              <p className="text-xs text-base-content/40 uppercase tracking-[0.2em] font-mono">
                Seleccionado: talle {selectedSize}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="bg-base-200 border-4 border-black shadow-brutal p-6 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section className="space-y-4 border-b-4 xl:border-b-0 xl:border-r-4 border-black pb-6 xl:pb-0 xl:pr-8">
            <h2 className="text-xl md:text-2xl font-impact uppercase text-base-content tracking-[0.2em]">
              Descripción
            </h2>
            <p className="text-base-content/60 leading-relaxed font-mono text-sm">
              {product.description}
            </p>
            <div className="pt-2">
              <h3 className="text-xs font-impact uppercase tracking-[0.3em] text-warning mb-2">
                Talles
              </h3>
              <ul className="text-xs space-y-1 text-base-content/50 font-mono tracking-wider">
                <li>TALLE S: LARGO 68 CM // SISA 49 CM</li>
                <li>TALLE M: LARGO 70 CM // SISA 52 CM</li>
                <li>TALLE L: LARGO 73 CM // SISA 55 CM</li>
                <li>TALLE XL: LARGO 76 CM // SISA 58 CM</li>
                <li>TALLE XXL: LARGO 79 CM // SISA 61 CM</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl md:text-2xl font-impact uppercase text-base-content tracking-[0.2em]">
                Comentarios
              </h2>
              <span className="text-xs font-impact uppercase tracking-wider bg-base-300 text-base-content px-3 py-1 border-2 border-primary/30">
                {ratingAvg.toFixed(1)} / 5
              </span>
            </div>

            {!canComment && (
              <p className="text-xs font-impact uppercase tracking-wider text-warning">
                Solo pueden comentar usuarios que compraron este producto.
              </p>
            )}

            <div className="flex items-center gap-2">
              <p className="text-[10px] font-impact uppercase tracking-[0.2em] text-base-content/50">
                Tu puntuación:
              </p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedCommentRating(star)}
                    disabled={!canComment}
                    className={`text-lg leading-none transition-transform hover:scale-110 disabled:cursor-not-allowed ${
                      star <= selectedCommentRating
                        ? "text-base-content"
                        : "text-base-content/25"
                    }`}
                    aria-label={`Puntuar con ${star} estrellas`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe tu opinión..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!canComment}
                className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-2 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20 disabled:opacity-40 disabled:cursor-not-allowed h-10"
              />
              <button
                disabled={
                  !canComment ||
                  !commentText.trim() ||
                  selectedCommentRating === 0
                }
                onClick={handleCommentSubmit}
                className="h-10 px-4 bg-primary text-primary-content font-impact text-xs uppercase tracking-wider border-2 border-black transition-all hover:shadow-brutal-sm disabled:opacity-45 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Enviar comentario"
              >
                Enviar
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="bg-base-300 border-2 border-base-300 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-impact text-base-content">
                        {comment.user.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-mono font-bold text-xs text-base-content">
                        @{comment.user}
                      </p>
                    </div>
                    <span className="text-[10px] text-base-content/40 font-mono">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-base-content mt-1 text-sm leading-none">
                    {"★".repeat(comment.rating)}
                    <span className="text-base-content/20">
                      {"☆".repeat(5 - comment.rating)}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-base-content/60 font-mono">
                    {comment.text}
                  </p>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-impact uppercase text-base-content/40 tracking-wider">
                      ¿Te fue útil?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleHelpfulVote(comment.id, "yes")}
                      className={`px-2 py-0.5 text-[10px] font-impact tracking-wider border-2 transition-all ${
                        helpfulSelectionByComment[comment.id] === "yes"
                          ? "bg-primary text-primary-content border-black"
                          : "bg-transparent text-base-content/50 border-base-300 hover:border-primary/50"
                      }`}
                    >
                      Sí ({comment.helpfulYes})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHelpfulVote(comment.id, "no")}
                      className={`px-2 py-0.5 text-[10px] font-impact tracking-wider border-2 transition-all ${
                        helpfulSelectionByComment[comment.id] === "no"
                          ? "bg-error text-white border-black"
                          : "bg-transparent text-base-content/50 border-base-300 hover:border-error/50"
                      }`}
                    >
                      No ({comment.helpfulNo})
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductDetail;
