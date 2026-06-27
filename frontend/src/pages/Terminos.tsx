import { Link } from "react-router-dom";

const Terminos = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-base-200 border-2 sm:border-4 border-black shadow-brutal overflow-hidden">
        <div className="bg-primary px-6 sm:px-10 py-6 border-b-2 sm:border-b-4 border-black">
          <h1 className="text-2xl sm:text-3xl font-impact text-primary-content uppercase tracking-[0.1em]">
            Términos y Condiciones
          </h1>
          <p className="text-primary-content/70 text-sm font-mono mt-2">
            Fecha de vigencia: 26 de junio de 2026
          </p>
        </div>

        <div className="p-6 sm:p-10 space-y-8 text-base-content/80 font-mono text-sm leading-relaxed">
          <section>
            <h2 className="font-impact text-lg uppercase tracking-wider text-base-content mb-3">
              Términos y Condiciones Generales de Uso y Contratación
            </h2>
            <p>
              El presente documento establece los Términos y Condiciones Generales (en adelante, los
              &quot;Términos&quot;) que regulan el acceso, navegación y uso de la plataforma de comercio
              electrónico CrumbSkate (en adelante, la &quot;Plataforma&quot; o la &quot;Empresa&quot;), así como la
              contratación de productos y servicios ofertados a través de la misma.
            </p>
            <p className="mt-3">
              El acceso a la Plataforma atribuye la condición de usuario (en adelante, el &quot;Usuario&quot;) e
              implica la aceptación expresa, plena y sin reservas de todas y cada una de las cláusulas
              contenidas en estos Términos desde el momento mismo del acceso. Si el Usuario no estuviere de
              acuerdo con estos Términos, deberá abstenerse de utilizar la Plataforma y de realizar
              cualquier tipo de transacción en ella.
            </p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              1. Consideraciones previas y aceptación del contrato
            </h2>
            <p>
              Lo establecido en el encabezado anterior constituye la aceptación vinculante del contrato
              entre el Usuario y la Empresa para el uso de la Plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              2. Capacidad legal
            </h2>
            <p>
              Los servicios y productos ofrecidos en la Plataforma están dirigidos exclusivamente a personas
              que cuenten con capacidad legal para contratar. No podrán utilizar los servicios las personas
              que no tengan dicha capacidad, los menores de edad o los Usuarios que hayan sido suspendidos
              o inhabilitados por la Empresa.
            </p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              3. Registro y gestión de cuentas
            </h2>
            <p className="mb-2"><strong>3.1.</strong> Es obligatorio completar el formulario de registro en todos sus campos con datos válidos, exactos y actuales para la adquisición de productos ofrecidos en la Plataforma. El Usuario asume el compromiso de actualizar los datos personales conforme resulte necesario.</p>
            <p className="mb-2"><strong>3.2.</strong> La Empresa no se responsabiliza por la certeza de los datos personales provistos por los Usuarios. Los Usuarios garantizan y responden, en cualquier caso, por la veracidad, exactitud, vigencia y autenticidad de los datos ingresados.</p>
            <p><strong>3.3.</strong> El Usuario accederá a su cuenta personal mediante el ingreso de su credencial de acceso y clave de seguridad personal elegida. El Usuario se obliga a mantener la estricta confidencialidad de su clave de seguridad. La cuenta es personal, única e intransferible.</p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              4. Condiciones generales de contratación y venta
            </h2>
            <p className="mb-2"><strong>4.1. Disponibilidad y Precio:</strong> Todos los productos y precios exhibidos están sujetos a disponibilidad y a modificaciones por parte de la Empresa sin previo aviso. La Empresa se reserva el derecho de limitar las cantidades de los productos, rechazar cualquier pedido o cancelar órdenes a su entera discreción.</p>
            <p className="mb-2"><strong>4.2. Perfeccionamiento del contrato:</strong> Toda transacción queda sujeta a la posterior verificación y aprobación por parte de la Empresa y de las entidades procesadoras de pago. El contrato de compraventa se considerará perfeccionado únicamente cuando la Empresa emita la confirmación formal del pedido y el pago haya sido acreditado.</p>
            <p><strong>4.3. Errores tipográficos:</strong> En el supuesto de que un producto figure listado con un precio incorrecto debido a un error tipográfico o un error en los sistemas subyacentes, la Empresa tendrá el derecho de denegar o cancelar cualquier pedido realizado para dicho producto.</p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              5. Política de envíos y transferencia de riesgo
            </h2>
            <p className="mb-2"><strong>5.1.</strong> Los productos adquiridos a través de la Plataforma se sujetarán a las condiciones de despacho y entrega elegidas por el Usuario y disponibles en el sitio.</p>
            <p className="mb-2"><strong>5.2.</strong> Los plazos de entrega son estimativos y no vinculantes. La Empresa no asume responsabilidad alguna por demoras imputables a las empresas de transporte o factores de fuerza mayor.</p>
            <p><strong>5.3.</strong> El riesgo de pérdida y el derecho de propiedad sobre los productos se transfieren al Usuario en el momento en que la Empresa hace entrega de los bienes al transportista designado.</p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              6. Derecho de revocación y política de garantías
            </h2>
            <p className="mb-2"><strong>6.1.</strong> En cumplimiento con la legislación vigente, el Usuario tiene el derecho irrenunciable a revocar la aceptación de la compra dentro de los diez (10) días corridos computados a partir de la recepción del bien, sin responsabilidad alguna.</p>
            <p className="mb-2"><strong>6.2.</strong> Para que la revocación sea admitida, el producto debe ser devuelto en perfectas condiciones, sin indicios de uso, desgaste o montaje, y con todos sus empaques, etiquetas y manuales originales intactos.</p>
            <p><strong>6.3.</strong> La Empresa ofrece garantía contra defectos de fabricación. Dicha garantía quedará anulada si el producto ha sufrido alteraciones, reparaciones no autorizadas, impacto, exposición a elementos abrasivos o uso negligente.</p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              7. Protección de datos personales
            </h2>
            <p>
              La recolección y el tratamiento de los datos personales se llevan a cabo de conformidad con la
              Ley de Protección de los Datos Personales (Ley N° 25.326). La Empresa adopta las medidas
              técnicas y organizativas necesarias para garantizar la seguridad, integridad y confidencialidad
              de los datos alojados en sus bases de datos (SQL/relacionales u otras). El Usuario consiente
              expresamente el tratamiento de sus datos para fines operativos, administrativos y de marketing
              directo.
            </p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              8. Propiedad intelectual e industrial
            </h2>
            <p>
              Toda la información, contenidos, interfaces, diseño UI/UX, bases de datos, código fuente y
              objeto, marcas, logotipos y gráficos presentes en la Plataforma son propiedad exclusiva de la
              Empresa o de terceros que han autorizado su uso, y están protegidos por las leyes y los
              tratados internacionales de derecho de autor, marcas, patentes y diseños industriales. Queda
              terminantemente prohibida su reproducción, distribución, comercialización, ingeniería inversa,
              extracción (scraping) o modificación sin la autorización expresa y por escrito de la Empresa.
            </p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              9. Limitación y exención de responsabilidad
            </h2>
            <p className="mb-2"><strong>9.1.</strong> La Empresa no garantiza el acceso y uso continuado o ininterrumpido de su sitio. El sistema puede eventualmente no estar disponible debido a dificultades técnicas, fallas de Internet, mantenimiento o por cualquier otra circunstancia.</p>
            <p className="mb-2"><strong>9.2.</strong> En ningún caso la Empresa será responsable por cualquier daño directo, indirecto, lucro cesante, daño emergente o daño moral, derivado del uso o la imposibilidad de uso de la Plataforma, o por la adquisición de los productos a través de esta.</p>
            <p><em>(Cláusula Especial de Naturaleza del Proyecto: Si la presente Plataforma operase en el marco de una implementación técnica o desarrollo académico, los Usuarios reconocen que los servicios podrán estar en fase beta y la Empresa no asume obligaciones de índole comercial o legal respecto a las transacciones simuladas).</em></p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              10. Indemnidad
            </h2>
            <p>
              El Usuario se compromete a indemnizar y mantener indemne a la Empresa, sus filiales,
              directivos, empleados y representantes frente a cualquier reclamo, demanda, responsabilidad,
              costos o gastos (incluyendo honorarios razonables de abogados) derivados de la infracción por
              parte del Usuario de estos Términos, de la ley, o de los derechos de terceros.
            </p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              11. Jurisdicción y ley aplicable
            </h2>
            <p>
              Este acuerdo estará regido en todos sus puntos por las leyes vigentes en la República
              Argentina. Cualquier controversia o divergencia derivada de la interpretación, validez o
              cumplimiento de estos Términos, será sometida a la competencia exclusiva de los Tribunales
              Ordinarios competentes correspondientes a la Provincia de Buenos Aires, República Argentina,
              renunciando expresamente a cualquier otro fuero o jurisdicción que pudiera corresponder.
            </p>
          </section>

          <section>
            <h2 className="font-impact text-base uppercase tracking-wider text-base-content mb-2">
              12. Modificaciones
            </h2>
            <p>
              La Empresa se reserva el derecho de modificar unilateralmente estos Términos en cualquier
              momento. Las modificaciones entrarán en vigor a partir de su publicación en la Plataforma. El
              uso continuado del sitio tras la publicación de los cambios constituirá la aceptación
              vinculante de las nuevas condiciones.
            </p>
          </section>

          <div className="pt-4 border-t border-base-content/20">
            <Link
              to="/registro"
              className="text-primary font-impact uppercase tracking-[0.2em] text-xs hover:underline"
            >
              ← Volver al registro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminos;
