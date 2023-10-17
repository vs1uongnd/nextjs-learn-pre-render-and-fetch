import path from "path";
import fs from "fs/promises";

const ProductDetailPage = (props) => {
  const { loadedProduct } = props;

  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
};

// phải cho NextJS biết trang nào cần pre-rendering
export async function getStaticPaths(context) {
  const { params } = context;

  const productId = params.pid;

  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  const product = data.products.find((product) => product.id === productId);

  return { props: { loadedProduct: product } };
}

export default ProductDetailPage;
