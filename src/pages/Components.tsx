import { AuthCard } from "../components/AuthCard";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import * as Card from "../components/Card";
import Counter from "../components/Counter";
import * as Dialog from "../components/Dialog";
import DirectionCard from "../components/DirectionCard";
import Filter from "../components/Filter";
import Footer from "../components/Footer";
import { FormField } from "../components/FormField";
import MiniCard from "../components/MiniCard";
import Input from "../components/Input";
import { Label } from "../components/Label";
import LinkButton from "../components/LinkButton";
import LinkPhrase from "../components/Linkphrase";
import NavBar from "../components/NavBar";
import NewOrderCard from "../components/NewOrderCard";
import OrderCard from "../components/OrderCard";
import ProductCard from "../components/ProductCard";
import * as Select from "../components/Select";
import * as Sheet from "../components/Sheet";
import * as Table from "../components/Table";
import InformationCard from "../components/InformationCard";

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      <div className="mb-10 mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-primary drop-shadow-lg py-6 bg-white rounded-2xl shadow-md border-b-4 border-primary">
          Componentes
        </h1>
        <hr className="w-full border-t border-gray-300 mb-6" />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow mx-auto align-center felx items-center justify-center ">
        <h1 className="text-3xl font-bold text-primary mb-4 border-b-2 border-primary pb-2 ">
          AuthCard
        </h1>
        <AuthCard
          title="Título"
          description="Descripción de AuthCard"
          className="max-w-md"
        >
          <Input name="auth-input" type="text" placeholder="Usuario" />
        </AuthCard>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-green-700 mb-4 border-b-2 border-green-400 pb-2">
          Badge
        </h1>
        <Badge>Badge</Badge>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow gap-3 flex flex-col">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 border-b-2 border-blue-400 pb-2">
          Button
        </h1>
        <div className="flex gap-4">
          <Button variant="primary" size="md">
            Botón Primario
          </Button>
          <Button variant="gray" size="md">
            Botón gray
          </Button>
          <Button variant="outline" size="md">
            Botón outline
          </Button>
          <Button variant="grayTransparent" size="md">
            Botón grayTransparent
          </Button>
          <Button variant="tertiary" size="md">
            Botón tertiary
          </Button>
          <Button variant="danger" size="md">
            Botón danger
          </Button>
          <Button variant="green" size="md">
            Botón green
          </Button>
          <Button variant="destructive" size="md">
            Botón destructive
          </Button>
          <Button variant="ghost" size="md">
            Botón ghost
          </Button>
          <Button variant="link" size="md">
            Botón link
          </Button>
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 border-b-2 border-purple-400 pb-2">
          Card
        </h1>
        <div className="w-200">
          <Card.Card>
            <Card.CardHeader>
              <Card.CardTitle>Título de Card</Card.CardTitle>
              <Card.CardDescription>Descripción de Card</Card.CardDescription>
            </Card.CardHeader>
          </Card.Card>
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-yellow-700 mb-4 border-b-2 border-yellow-400 pb-2">
          Counter
        </h1>
        <div className="w-70">
          <Counter value={0} onChange={() => {}} />
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-pink-700 mb-4 border-b-2 border-pink-400 pb-2">
          Dialog
        </h1>
        <Dialog.Dialog>
          <Dialog.DialogTrigger>
            <Button>Abrir Diálogo</Button>
          </Dialog.DialogTrigger>
          <Dialog.DialogContent>
            <Dialog.DialogClose asChild>
              <Button>Cerrar</Button>
            </Dialog.DialogClose>
            <div className="p-4">Contenido del diálogo</div>
          </Dialog.DialogContent>
        </Dialog.Dialog>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-orange-700 mb-4 border-b-2 border-orange-400 pb-2">
          DirectionCard
        </h1>
        <DirectionCard
          direction={{
            id: 1,
            calle: "Calle Falsa",
            numero: "123",
            personaId: 1,
            casa: "A",
            dia: [true, false, false, false, false, false, false],
            zona: { id: 1, nombre: "Centro", detalle: "Zona centro" },
            ventas: [],
            activo: true,
            productosDomicilio: [],
          }}
          onSave={() => {}}
        />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-red-700 mb-4 border-b-2 border-red-400 pb-2">
          Filter
        </h1>
        <div className="flex ">
          <Filter
            name="filtro"
            options={["Opción 1", "Opción 2"]}
            onSave={() => {}}
            color="primary"
            size="md"
          />
          <Filter
            name="filtro"
            options={["Secundary ", "Opción 2"]}
            onSave={() => {}}
            color="secondary"
            size="md"
          />
          <Filter
            name="filtro"
            options={["green 1", "Opción 2"]}
            onSave={() => {}}
            color="green"
            size="md"
          />
          <Filter
            name="filtro"
            options={["red 1", "Opción 2"]}
            onSave={() => {}}
            color="red"
            size="md"
          />
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-gray-700 mb-4 border-b-2 border-gray-400 pb-2">
          Footer
        </h1>
        <Footer />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 border-b-2 border-indigo-400 pb-2">
          FormField
        </h1>
        <FormField label="Campo" name="campo" value="" onChange={() => {}} />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-gray-400 pb-2">
          Helmet
        </h1>
        {/* Helmet usage would be <Helmet.Helmet title="Título Helmet" /> if needed */}
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow flax flex-col gap-10 ">
        <h1 className="text-3xl font-bold text-amber-700 mb-4 border-b-2 border-amber-400 pb-2">
          InformationCard
        </h1>
        <div className="flex flex-wrap gap-5  ">
          {/* black */}
          <InformationCard
            miniTitle="Mini Título Black"
            title="Título white"
            description="Descripción Black"
            cardColor="black"
            titleColor="white"
            descriptionColor="black"
            size="md"
          />
          {/* white */}
          <InformationCard
            miniTitle="Mini Título White"
            title="Título black"
            description="Descripción White"
            cardColor="white"
            size="md"
            titleColor="black"
            descriptionColor="black"
          />
          {/* red */}
          <InformationCard
            miniTitle="Mini Título gray"
            title="Título Red"
            description="Descripción white"
            cardColor="red"
            size="md"
            titleColor="white"
            descriptionColor="gray"
          />
          {/* primary */}
          <InformationCard
            miniTitle="Mini Título white"
            title="Título Primary"
            description="Descripción white"
            cardColor="primary"
            titleColor="white"
            descriptionColor="white"
            size="md"
          />
          {/* secondary */}
          <InformationCard
            miniTitle="Mini Título Secondary"
            title="Título primary"
            description="Descripción primary"
            cardColor="secondary"
            titleColor="primary"
            size="md"
            descriptionColor="primary"
          />
          {/* gray */}
          <InformationCard
            miniTitle="Mini Título Gray"
            title="Título Gray"
            description="Descripción Gray"
            cardColor="gray"
            titleColor="gray"
            size="md"
            descriptionColor="gray"
          />
          {/* green (solo para titleColor) */}
          <InformationCard
            miniTitle="Mini Título Green"
            title="Título Green"
            description="Descripción Green"
            cardColor="white"
            size="md"
            titleColor="green"
            descriptionColor="black"
          />
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-cyan-700 mb-4 border-b-2 border-cyan-400 pb-2">
          Input
        </h1>
        <Input
          name="input"
          type="text"
          value=""
          onChange={() => {}}
          placeholder="Escribe algo..."
          color="primary"
        />
        <Input
          name="input"
          type="text"
          value=""
          onChange={() => {}}
          placeholder="Escribe algo..."
          color="secondary"
        />
        <Input
          name="input"
          type="text"
          value=""
          onChange={() => {}}
          placeholder="Escribe algo..."
          color="gray"
        />
        <Input
          name="input"
          type="text"
          value=""
          onChange={() => {}}
          placeholder="Escribe algo..."
          color="white"
        />
        <Input
          name="input"
          type="text"
          value=""
          onChange={() => {}}
          placeholder="Escribe algo..."
          color="grayTransparent"
        />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-gray-500 pb-2">
          Label
        </h1>
        <Label htmlFor="input">Etiqueta</Label>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow ">
        <h1 className="text-3xl font-bold text-emerald-700 mb-4 border-b-2 border-emerald-400 pb-2">
          LinkButton
        </h1>
        <div className="flex gap-4">
          <LinkButton
            name="Ir a algún lado"
            size="md"
            variant="primary"
            url="#"
          />
          <LinkButton name="secondary" size="md" variant="secondary" url="#" />
          <LinkButton name="outline" size="md" variant="outline" url="#" />
          <LinkButton name="white" size="md" variant="white" url="#" />
          <LinkButton
            name="grayTransparent"
            size="md"
            variant="grayTransparent"
            url="#"
          />
          <LinkButton name="tertiary" size="md" variant="tertiary" url="#" />
          <LinkButton name="green" size="md" variant="green" url="#" />
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-fuchsia-700 mb-4 border-b-2 border-fuchsia-400 pb-2">
          Linkphrase
        </h1>
        <div className="flex gap-4">
          <LinkPhrase
            text="¿No tienes cuenta?"
            url="#"
            size="md"
            color="primary"
          />
          <LinkPhrase text="garyPrimay" size="md" color="grayPrimary" url="#" />
          <LinkPhrase
            text="secundaryPrimary"
            size="md"
            color="secundaryPrimary"
            url="#"
          />
          <LinkPhrase text="black" size="md" color="black" url="#" />
          <LinkPhrase
            text="blackPrimary"
            size="md"
            color="blackPrimary"
            url="#"
          />
        </div>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-orange-900 mb-4 border-b-2 border-orange-600 pb-2">
          MiniCard
        </h1>
        <MiniCard
          svg={<span>🌟</span>}
          title="MiniCard"
          description="Contenido mini"
        />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-blue-900 mb-4 border-b-2 border-blue-600 pb-2">
          NavBar
        </h1>
        <NavBar />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-pink-900 mb-4 border-b-2 border-pink-600 pb-2">
          NewOrderCard
        </h1>
        <NewOrderCard
          orderNumber="001"
          cant={[1, 2]}
          products={[
            { name: "Producto", description: "desc", image: "", price: 10 },
          ]}
          total={20}
          open={false}
          setOpen={() => {}}
        />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-lime-900 mb-4 border-b-2 border-lime-600 pb-2">
          OrderCard
        </h1>
        <OrderCard
          prop={{
            id: 1,
            fecha: "2026-04-13",
            total: 100,
            estado: "Enviado",
            pagado: true,
            idDomicilio: 1,
            lineasPedido: [],
          }}
        />
        <OrderCard
          prop={{
            id: 1,
            fecha: "2026-04-13",
            total: 100,
            estado: "Completada",
            pagado: true,
            idDomicilio: 1,
            lineasPedido: [],
          }}
        />
        <OrderCard
          prop={{
            id: 1,
            fecha: "2026-04-13",
            total: 100,
            estado: "Pendiente",
            pagado: true,
            idDomicilio: 1,
            lineasPedido: [],
          }}
        />
        <OrderCard
          prop={{
            id: 1,
            fecha: "2026-04-13",
            total: 100,
            estado: "Cancelada",
            pagado: true,
            idDomicilio: 1,
            lineasPedido: [],
          }}
        />
        <OrderCard
          prop={{
            id: 1,
            fecha: "2026-04-13",
            total: 100,
            estado: "En proceso",
            pagado: true,
            idDomicilio: 1,
            lineasPedido: [],
          }}
        />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-rose-900 mb-4 border-b-2 border-rose-600 pb-2">
          ProductCard
        </h1>
        <ProductCard
          id={1}
          name="Producto"
          price={100}
          description="Descripción"
          image=""
        />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow w-auto">
        <h1 className="text-3xl font-bold text-rose-700 mb-4 border-b-2 border-rose-400 pb-2">
          Producto card para ordenes
        </h1>
        <ProductCard
          id={1}
          name="Producto"
          price={100}
          description="Descripción"
          image=""
          Cant={2}
          setCant={() => {}}
        />
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-sky-900 mb-4 border-b-2 border-sky-600 pb-2">
          Select
        </h1>
        <Select.Select>
          <Select.SelectTrigger>Selecciona una opción</Select.SelectTrigger>
          <Select.SelectContent>
            <Select.SelectItem value="uno">Uno</Select.SelectItem>
            <Select.SelectItem value="dos">Dos</Select.SelectItem>
          </Select.SelectContent>
        </Select.Select>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-teal-900 mb-4 border-b-2 border-teal-600 pb-2">
          Sheet
        </h1>
        <Sheet.Sheet>
          <Sheet.SheetTrigger>
            <Button>Abrir Sheet</Button>
          </Sheet.SheetTrigger>
          <Sheet.SheetContent>
            <div>Contenido del sheet</div>
          </Sheet.SheetContent>
        </Sheet.Sheet>
      </div>

      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-gray-600 pb-2">
          Table
        </h1>
        <Table.Table>
          <Table.TableHeader>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </Table.TableHeader>
          <Table.TableBody>
            <tr>
              <td>1</td>
              <td>Fila 1</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Fila 2</td>
            </tr>
          </Table.TableBody>
        </Table.Table>
      </div>
      <div className="mb-8 p-6 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-gray-600 pb-2">
          FormField (select)
        </h1>
        <FormField
          label="Tipo de Documento"
          name="persona_tipoDoc"
          type="select"
          value={""}
          //onChange={() => {}}
          error={""}
          options={[
            { value: "DNI", label: "DNI" },
            { value: "Cédula", label: "Cédula" },
            { value: "Pasaporte", label: "Pasaporte" },
          ]}
          required
        />
      </div>
    </div>
  );
}
