import path from "path";
import fs from "fs/promises";
import Link from "next/link";

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link key={product.id} href={`/${product.id}`}>
            {product.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
// Đối với React, thì là Client-side Rendering, khi ta View Page Source lên sẽ chỉ thấy 1 thẻ div rỗng, không tốt cho SEO
// Pre-rendering: Next.js sẽ tạo trước HTML cho từng trang, thay vì tất cả được thực hiện ở client như Reactjs.
// NextJS mac dinh tạo ra 2 file html đầy đủ là index.html và 404.html (gọi là pre-rendering) (có thể npm run build để thấy 2 file đó)
// Có 2 loại Pre-rendering: Static generation và Server-side rendering

// Static generation: HTML sẽ được generate tất cả ngay từ đầu và được sử dụng mỗi lần request.
// Server-side rendering: HTML sẽ được generate mỗi lần request.

// Static generation
// Tuy nhiên trong trường hợp data thay đổi liên tục, thì ta có thể sử dụng revalidate để làm mới lại trang html đã build đó. Tức là getStaticProps() được gọi lại mỗi 10s
export async function getStaticProps(context) {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    return {
      redirect: {
        destination: "/no-data", // redirect đến router "/no-data"
      },
    };
  }

  if (data.products.length === 0) {
    return { notFound: true }; // redirect đến 404.html
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10, // mỗi 10s, làm mới html
  };
}

export default HomePage;
