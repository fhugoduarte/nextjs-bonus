import { GetStaticProps } from "next";

interface Product {
  id: string;
  title: string;
}

interface Props {
  products: Product[];
}

export default function Top10({ products }: Props) {
  return (
    <div>
      <h1>Top 10</h1>

      <ul>
          {products.map(product => (
            <li key={`product-${product.id}`}>
              {product.title}
            </li>
          ))}
        </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const response = await fetch('http://localhost:3333/products');
  const products = await response.json();

  return {
    props: {
      products
    },
  }
}