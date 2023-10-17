import path from "path";
import fs from "fs/promises";

const ProductDetailPage = (props) => {
  const { loadedProduct } = props;

  if (!loadedProduct) return <p>Loading...</p>;

  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
};

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;
  const data = await getData();
  const product = data.products.find((product) => product.id === productId);

  if (!product) return { notFound: true }; // redirect đến 404.html

  return { props: { loadedProduct: product } };
}

// phải cho NextJS biết trang nào cần pre-rendering
export async function getStaticPaths() {
  const data = await getData();
  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    paths: pathsWithParams,
    fallback: true,
    // cac [pid] hien tai la: p1, p2, p3
    // khi truy cap 1 [pid] khong duoc khai bao truoc, chang han http://localhost:3000/p4
    // fallback: false, redirect den 404 page
    // fallback: true, redirect den 1 trang tao san
  };
}

export default ProductDetailPage;
