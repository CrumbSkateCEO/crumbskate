import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const [helpfulSelectionByComment, setHelpfulSelectionByComment] = useState<Record<number, string>>(
    {},
  );

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
    <section className="w-full max-w-7xl mx-auto py-8 md:py-12 space-y-8">
      <div className="text-sm breadcrumbs">
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>Producto</li>
          <li className="font-bold">{product.name}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <article className="bg-base-200 border border-neutral/30 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="min-h-[380px] bg-base-100 border-b lg:border-b-0 lg:border-r border-neutral/30 flex items-center justify-center p-8">
              <div className="w-full max-w-sm aspect-square bg-neutral/90 rounded-md flex flex-col items-center justify-center text-neutral-content/50 gap-3">
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
                <span className="text-xs uppercase tracking-widest font-bold">
                  Imagen del producto
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              <div>
                <p className="text-sm uppercase tracking-wider text-primary font-bold">
                  {product.brand}
                </p>
                <h1 className="text-3xl md:text-4xl font-black uppercase leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-base-content/70 mt-2 uppercase tracking-wide">
                  5 cuotas de {formatPrice(Math.round(product.price / 5))}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-4xl font-black">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm line-through text-base-content/40">
                  {formatPrice(product.oldPrice)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-2">
                  Talle
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.inStock}
                      className={`btn btn-sm rounded-sm min-w-12 font-bold ${
                        selectedSize === size
                          ? "btn-primary"
                          : "btn-outline border-neutral/50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {!product.inStock && (
                <div className="bg-error/10 border border-error/50 rounded-md p-4 text-center">
                  <p className="text-error font-black uppercase tracking-wide">
                    Producto sin stock
                  </p>
                  <p className="text-error/70 text-sm mt-1">
                    Próximamente disponible
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="btn btn-primary rounded-sm uppercase font-black flex-1"
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Comprar ahora" : "Sin stock"}
                </button>
                <button
                  className="btn btn-neutral rounded-sm uppercase font-black flex-1"
                  disabled={!product.inStock}
                >
                  {product.inStock ? "Agregar al carrito" : "Sin stock"}
                </button>
              </div>

              <p className="text-xs text-base-content/60 uppercase tracking-wide">
                Seleccionado: talle {selectedSize}
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="bg-base-200 border border-neutral/30 shadow-lg p-6 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section className="space-y-4 border-b xl:border-b-0 xl:border-r border-neutral/30 pb-6 xl:pb-0 xl:pr-8">
            <h2 className="text-xl md:text-2xl font-black uppercase text-primary">
              Descripción
            </h2>
            <p className="text-base-content/80 leading-relaxed">
              {product.description}
            </p>
            <div className="pt-2">
              <h3 className="text-sm font-black uppercase tracking-wide mb-2">
                Talles
              </h3>
              <ul className="text-sm space-y-1 text-base-content/80">
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
              <h2 className="text-xl md:text-2xl font-black uppercase text-primary">
                Comentarios
              </h2>
              <span className="text-xs font-black uppercase tracking-wide bg-base-100 px-3 py-1 rounded-full border border-neutral/30">
                {ratingAvg.toFixed(1)} / 5
              </span>
            </div>

            {!canComment && (
              <p className="text-xs font-bold uppercase tracking-wide text-error">
                Solo pueden comentar usuarios que compraron este producto.
              </p>
            )}

            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-wide">
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
                        ? "text-amber-500"
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
                className="input input-bordered w-full bg-base-100 border-neutral/40 rounded-full h-10 text-sm disabled:bg-base-300 disabled:text-base-content/40"
              />
              <button
                disabled={
                  !canComment ||
                  !commentText.trim() ||
                  selectedCommentRating === 0
                }
                onClick={handleCommentSubmit}
                className="h-10 px-4 rounded-full bg-primary text-primary-content font-black text-xs uppercase tracking-wide border border-primary/50 transition-all hover:brightness-95 disabled:opacity-45 disabled:cursor-not-allowed flex items-center gap-2"
                aria-label="Enviar comentario"
              >
                Enviar
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="bg-base-100 border border-neutral/30 rounded-md p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-neutral/20 flex items-center justify-center text-xs font-black">
                        {comment.user.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-bold text-sm">@{comment.user}</p>
                    </div>
                    <span className="text-[11px] text-base-content/60">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-amber-500 mt-1 text-sm leading-none">
                    {"★".repeat(comment.rating)}
                    {"☆".repeat(5 - comment.rating)}
                  </p>
                  <p className="mt-2 text-sm text-base-content/80">
                    {comment.text}
                  </p>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase text-base-content/60">
                      ¿Te fue útil?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleHelpfulVote(comment.id, "yes")}
                      className={`btn btn-xs rounded-full ${
                        helpfulSelectionByComment[comment.id] === "yes"
                          ? "btn-primary"
                          : "btn-outline border-neutral/40"
                      }`}
                    >
                      Sí ({comment.helpfulYes})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHelpfulVote(comment.id, "no")}
                      className={`btn btn-xs rounded-full ${
                        helpfulSelectionByComment[comment.id] === "no"
                          ? "btn-error text-error-content"
                          : "btn-outline border-neutral/40"
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
    </section>
  );
};

export default ProductDetail;
